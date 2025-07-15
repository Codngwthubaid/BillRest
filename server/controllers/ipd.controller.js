import { Counter } from "../models/counter.model.js"
import { IPD } from "../models/ipd.model.js"
import { Patient } from "../models/patient.model.js"
import { Service } from "../models/service.model.js"

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
      admissionDate,
      dischargeDate,
      treatments,
      roomCharges,
      medicineCharges,
      otherCharges
    } = req.body;

    // Validate patient
    const patient = await Patient.findOne({ _id: patientId, clinic: userId });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Prepare treatments list & compute service charges
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
        totalCharges
      });
    }

    // Compute total from all parts
    const total = 
      (roomCharges || 0) + 
      serviceCharges + 
      (medicineCharges || 0) + 
      (otherCharges?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0);

    // Create IPD record
    const ipd = await IPD.create({
      clinic: userId,
      patient: patient._id,
      ipdNumber: await getNextIPDNumber(),
      admissionDate: admissionDate || new Date(),
      dischargeDate,
      treatments: treatmentDetails,
      billing: {
        roomCharges,
        serviceCharges,
        medicineCharges,
        otherCharges,
        total
      },
      status: "Admitted"
    });

    res.status(201).json({
      message: "IPD record created successfully",
      ipd
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
      treatments,
      roomCharges,
      medicineCharges,
      otherCharges
    } = req.body;

    const ipd = await IPD.findOne({ _id: id, clinic: userId });
    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // Prepare new treatments & compute service charges
    let serviceCharges = 0;
    let treatmentDetails = [];

    if (treatments && treatments.length > 0) {
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
          totalCharges
        });
      }
    } else {
      // keep existing treatments if none passed
      treatmentDetails = ipd.treatments;
      serviceCharges = treatmentDetails.reduce((sum, t) => sum + (t.totalCharges || 0), 0);
    }

    // Compute billing total
    const total =
      (roomCharges ?? ipd.billing.roomCharges) +
      serviceCharges +
      (medicineCharges ?? ipd.billing.medicineCharges) +
      ((otherCharges ?? ipd.billing.otherCharges)
        .reduce((sum, item) => sum + (item.amount || 0), 0));

    // Update IPD fields
    ipd.admissionDate = admissionDate ?? ipd.admissionDate;
    ipd.dischargeDate = dischargeDate ?? ipd.dischargeDate;
    ipd.treatments = treatmentDetails;
    ipd.billing = {
      roomCharges: roomCharges ?? ipd.billing.roomCharges,
      serviceCharges,
      medicineCharges: medicineCharges ?? ipd.billing.medicineCharges,
      otherCharges: otherCharges ?? ipd.billing.otherCharges,
      total
    };

    await ipd.save();

    res.json({
      message: "IPD record updated successfully",
      ipd
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
      .populate("patient", "name phoneNumber age gender")
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

    const ipd = await IPD.findOne({ _id: id, clinic: userId });
    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    ipd.status = "Discharged";
    ipd.dischargeDate = dischargeDate ?? new Date();

    await ipd.save();

    res.json({
      message: "Patient discharged successfully",
      ipd
    });

  } catch (err) {
    console.error("Discharge IPD error:", err);
    res.status(500).json({ message: err.message });
  }
};
