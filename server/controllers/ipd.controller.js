import { Counter } from "../models/counter.model.js"
import { IPD } from "../models/ipd.model.js"
import { Patient } from "../models/patient.model.js"
import { Service } from "../models/service.model.js"
import { User } from "../models/user.model.js"
import { generateIPDPDF } from "../utils/generateIPDPDF.js"

const getNextIPDNumber = async () => {
  // 1️⃣ Find latest IPD from DB (highest created)
  const latestIPD = await IPD.findOne({}).sort({ createdAt: -1 }).lean();
  let lastNumber = 0;

  if (latestIPD?.ipdNumber) {
    const match = latestIPD.ipdNumber.match(/IPD(\d+)/);
    if (match) lastNumber = parseInt(match[1], 10);
  }

  // 2️⃣ Check Counter
  const counterDoc = await Counter.findOne({ _id: "ipdNumber" });
  let currentCounter = counterDoc ? counterDoc.sequence_value : 0;

  // 3️⃣ Calculate next
  let nextNumber = Math.max(lastNumber, currentCounter) + 1;

  // 4️⃣ Update Counter to keep in sync
  await Counter.findOneAndUpdate(
    { _id: "ipdNumber" },
    { sequence_value: nextNumber },
    { upsert: true, new: true }
  );

  // 5️⃣ Return formatted
  return `IPD${String(nextNumber).padStart(4, "0")}`;
};

export const createIPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      patientId,
      appointmentId,
      isNewPatient,
      admissionDate,
      dischargeDate,
      bedNumber,
      bedCharges = 0,
      otherCharges = [],
      grantsOrDiscounts = 0,
      treatments = [],
    } = req.body;

    const patient = await Patient.findOne({ _id: patientId, clinic: userId });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    let serviceCharges = 0;
    let treatmentDetails = [];

    for (const t of treatments) {
      const service = await Service.findOne({ _id: t.service, clinic: userId });
      if (!service) {
        return res.status(404).json({ message: `Service not found for ID ${t.service}` });
      }

      const totalCharges = (service.price * (t.quantity || 1));
      serviceCharges += totalCharges;

      treatmentDetails.push({
        service: service._id,
        quantity: t.quantity || 1,
        totalCharges,
      });
    }

    const admitDate = new Date(admissionDate || new Date());
    const discharge = dischargeDate ? new Date(dischargeDate) : new Date();
    const daysStayed = Math.max(1, Math.ceil((discharge - admitDate) / (1000 * 60 * 60 * 24)));

    const totalBedCharges = bedCharges * daysStayed;
    const otherTotal = otherCharges.reduce((sum, item) => sum + (item.amount || 0), 0);

    const totalBeforeDiscount = totalBedCharges + serviceCharges + otherTotal;
    const finalAmount = totalBeforeDiscount - grantsOrDiscounts;

    const ipd = await IPD.create({
      clinic: userId,
      patient: patient._id,
      appointment: appointmentId,
      isNewPatient,
      ipdNumber: await getNextIPDNumber(),
      admissionDate: admitDate,
      dischargeDate,
      bedNumber,
      treatments: treatmentDetails,
      billing: {
        bedCharges: totalBedCharges,
        serviceCharges,
        otherCharges,
        grantsOrDiscounts,
        totalBeforeDiscount,
        finalAmount,
      },
    });

    res.status(201).json({
      message: "IPD record created successfully",
      ipd,
    });
  } catch (err) {
    console.error("Create IPD error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateIPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      admissionDate,
      dischargeDate,
      bedNumber,
      bedCharges = 0,
      otherCharges = [],
      grantsOrDiscounts = 0,
      treatments = [],
    } = req.body;

    const ipd = await IPD.findOne({ _id: id, clinic: userId });
    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // Prepare treatment details
    let serviceCharges = 0;
    let treatmentDetails = [];

    for (const t of treatments) {
      const service = await Service.findOne({ _id: t.service, clinic: userId });
      if (!service) {
        return res.status(404).json({ message: `Service not found for ID ${t.service}` });
      }

      const totalCharges = (service.price * (t.quantity || 1));
      serviceCharges += totalCharges;

      treatmentDetails.push({
        service: service._id,
        quantity: t.quantity || 1,
        totalCharges,
      });
    }

    const admitDate = new Date(admissionDate || ipd.admissionDate || new Date());
    const discharge = dischargeDate ? new Date(dischargeDate) : (ipd.dischargeDate || new Date());

    const daysStayed = Math.max(1, Math.ceil((discharge - admitDate) / (1000 * 60 * 60 * 24)));
    const totalBedCharges = bedCharges * daysStayed;

    const otherTotal = otherCharges.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalBeforeDiscount = totalBedCharges + serviceCharges + otherTotal;
    const finalAmount = totalBeforeDiscount - grantsOrDiscounts;

    // Update IPD record
    ipd.admissionDate = admitDate;
    ipd.dischargeDate = dischargeDate || ipd.dischargeDate;
    ipd.bedNumber = bedNumber ?? ipd.bedNumber;
    ipd.treatments = treatmentDetails;
    ipd.billing = {
      bedCharges: totalBedCharges,
      serviceCharges,
      otherCharges,
      grantsOrDiscounts,
      totalBeforeDiscount,
      finalAmount,
    };

    await ipd.save();

    res.json({
      message: "IPD record updated successfully",
      ipd,
    });
  } catch (err) {
    console.error("Update IPD error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getIPDs = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipds = await IPD.find({ clinic: userId })
      .populate("patient")
      .populate("treatments.service")
      .sort({ createdAt: -1 });

    res.json(ipds);

  } catch (err) {
    console.error("Get IPDs error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getIPDById = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipd = await IPD.findOne({ _id: req.params.id, clinic: userId })
      .populate("patient", "name phoneNumber age gender address")
      .populate("treatments.service", "name price gstRate category");

    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    res.json(ipd);

  } catch (err) {
    console.error("Get IPD by ID error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const dischargeIPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { dischargeDate } = req.body;

    // 1. Find the IPD record
    const ipd = await IPD.findOne({ _id: id, clinic: userId }).populate("treatments.service");
    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // 2. Check if already discharged
    if (ipd.status === "Discharged") {
      return res.status(400).json({ message: "Patient already discharged" });
    }

    // 3. Set discharge date
    const discharge = dischargeDate ? new Date(dischargeDate) : new Date();
    ipd.dischargeDate = discharge;
    ipd.status = "Discharged";

    // 4. Calculate days stayed (minimum 1)
    const admitDate = new Date(ipd.admissionDate);
    const daysStayed = Math.max(1, Math.ceil((discharge - admitDate) / (1000 * 60 * 60 * 24)));

    // 5. Bed charges calculation
    const previousBedCharges = ipd.billing?.bedCharges || 0;
    const bedChargesPerDay = previousBedCharges / Math.max(1, ipd.stayDays || daysStayed);
    const updatedBedCharges = bedChargesPerDay * daysStayed;

    // 6. Recalculate service charges
    let serviceCharges = 0;
    for (const t of ipd.treatments) {
      const price = t?.service?.price || 0;
      t.totalCharges = price * (t.quantity || 1);
      serviceCharges += t.totalCharges;
    }

    // 7. Other charges
    const otherChargesList = ipd.billing?.otherCharges || [];
    const otherTotal = otherChargesList.reduce((sum, item) => sum + (item.amount || 0), 0);

    // 8. Discounts
    const grantsOrDiscounts = ipd.billing?.grantsOrDiscounts || 0;

    // 9. Final total
    const totalBeforeDiscount = updatedBedCharges + serviceCharges + otherTotal;
    const finalAmount = totalBeforeDiscount - grantsOrDiscounts;

    // 10. Mark as fully paid
    const paidAmount = finalAmount;
    const paymentStatus = "paid";

    // ✅ Update both nested billing and top-level field
    ipd.billing = {
      ...ipd.billing,
      bedCharges: updatedBedCharges,
      serviceCharges,
      otherCharges: otherChargesList,
      grantsOrDiscounts,
      totalBeforeDiscount,
      finalAmount,
      paidAmount,
      paymentStatus,
    };

    ipd.paymentStatus = paymentStatus; // ✅ FIXED HERE

    // 11. Save
    await ipd.save();

    res.status(200).json({
      message: "Patient discharged and billing updated successfully",
      ipd,
    });
  } catch (err) {
    console.error("Discharge IPD error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteIPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const ipd = await IPD.findOneAndDelete({ _id: id, clinic: userId });
    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    res.status(200).json({ message: "IPD record deleted successfully" });
  } catch (err) {
    console.error("Delete IPD error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const downloadIPDPDF = async (req, res) => {
  try {
    const ipd = await IPD.findOne({
      _id: req.params.id,
      clinic: req.user.id,
    })
      .populate("patient", "name phoneNumber age gender address")
      .populate("treatments.service", "name price");

    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // Enrich treatments with service names (already populated, but ensure consistency)
    const enrichedTreatments = ipd.treatments.map((treatment) => ({
      ...treatment.toObject(),
      service: {
        ...treatment.service.toObject(),
        name: treatment.service?.name || "Unknown",
      },
    }));

    ipd.treatments = enrichedTreatments;

    // Fetch clinic details (assuming User model contains business details)
    const clinic = await User.findById(req.user.id).select("businessName address gstNumber phone email");
    const patient = await Patient.findById(ipd.patient).select("name phoneNumber age gender address");

    // Generate the PDF
    const pdfBuffer = await generateIPDPDF(ipd, clinic, patient);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${ipd.ipdNumber}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Download IPD PDF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const printIPDPDF = async (req, res) => {
  try {
    const ipd = await IPD.findOne({
      _id: req.params.id,
      clinic: req.user.id,
    })
      .populate("patient", "name phoneNumber age gender address")
      .populate("treatments.service", "name price");

    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // Enrich treatments (similar to enrichedProducts)
    const enrichedTreatments = ipd.treatments.map((item) => {
      let serviceName = "Unknown";
      try {
        if (item.service && item.service.name) {
          serviceName = item.service.name;
        }
      } catch (err) {
        console.log(`Error fetching service name:`, err.message);
      }
      return {
        ...item.toObject(),
        serviceName,
      };
    });

    ipd.treatments = enrichedTreatments;

    // Get clinic details
    const clinic = await User.findById(req.user.id).select("businessName address gstNumber phone email");
    const patient = await Patient.findById(ipd.patient).select("name phoneNumber age gender address");

    // Generate PDF
    const pdfBuffer = await generateIPDPDF(ipd, clinic, patient);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${ipd.ipdNumber}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Print IPD PDF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
