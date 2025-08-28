import { IPD } from "../models/ipd.model.js"
import { Service } from "../models/service.model.js"
import { generateIPDPDF } from "../utils/generateIPDPDF.js"
import { Bed } from "../models/bed.model.js"
import { Clinic } from "../models/clinic.model.js"
import crypto from "crypto";

const generateRandomBillId = () => {
  const randomString = crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
  return `Bill-${randomString}`;
};

// export const createIPD = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const {
//       patientId,
//       appointmentId,
//       isNewPatient,
//       admissionDate,
//       dischargeDate,
//       bedId, // ✅ changed from bedNumber to bedId
//       grantsOrDiscounts = 0,
//       treatments = [],
//       note = "",
//     } = req.body;

//     const patient = await Patient.findOne({ _id: patientId, clinic: userId });
//     if (!patient) return res.status(404).json({ message: "Patient not found" });

//     const bed = await Bed.findOne({ _id: bedId, clinic: userId });
//     if (!bed) return res.status(404).json({ message: "Bed not found" });

//     // ✅ Calculate service charges
//     let serviceCharges = 0;
//     let treatmentDetails = [];
//     for (const t of treatments) {
//       const service = await Service.findOne({ _id: t.service, clinic: userId });
//       if (!service) {
//         return res.status(404).json({ message: `Service not found for ID ${t.service}` });
//       }
//       const totalCharges = service.price * (t.quantity || 1);
//       serviceCharges += totalCharges;
//       treatmentDetails.push({
//         service: service._id,
//         quantity: t.quantity || 1,
//         totalCharges,
//       });
//     }

//     // ✅ Calculate bed charges
//     const admitDate = new Date(admissionDate || new Date());
//     const discharge = dischargeDate ? new Date(dischargeDate) : new Date();
//     const daysStayed = Math.max(1, Math.ceil((discharge - admitDate) / (1000 * 60 * 60 * 24)));

//     const totalBedCharges = bed.bedCharges * daysStayed; // ✅ use bedCharges from Bed model

//     const totalBeforeDiscount = totalBedCharges + serviceCharges;
//     const finalAmount = totalBeforeDiscount - grantsOrDiscounts;

//     const ipd = await IPD.create({
//       clinic: userId,
//       patient: patient._id,
//       appointment: appointmentId,
//       isNewPatient,
//       ipdNumber: await generateRandomBillId(),
//       admissionDate: admitDate,
//       dischargeDate,
//       bed: bed._id, // ✅ store reference
//       treatments: treatmentDetails,
//       billing: {
//         bedCharges: totalBedCharges,
//         serviceCharges,
//         grantsOrDiscounts,
//         totalBeforeDiscount,
//         finalAmount,
//       },
//       note, // ✅ save note
//     });

//     // ✅ Update bed status to occupied
//     bed.status = "Occupied";
//     bed.patient = patient._id;
//     await bed.save();

//     res.status(201).json({
//       message: "IPD record created successfully",
//       ipd,
//     });
//   } catch (err) {
//     console.error("Create IPD error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const createIPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bedId, note = "", grantsOrDiscounts = 0, dischargeDate } = req.body;

    // ✅ Find the bed and populate related fields
    const bed = await Bed.findOne({ _id: bedId })
      .populate("patient")
      .populate("services.service")
      .populate("treatments")
      .populate("medicines");

    if (!bed) return res.status(404).json({ message: "Bed not found" });
    if (!bed.patient) return res.status(400).json({ message: "No patient assigned to this bed" });

    // ✅ Admission date will be bed's createdAt
    const admissionDate = new Date(bed.createdAt);
    const discharge = dischargeDate ? new Date(dischargeDate) : new Date();

    // ✅ Calculate number of days stayed
    const daysStayed = Math.max(1, Math.ceil((discharge - admissionDate) / (1000 * 60 * 60 * 24)));

    // ✅ Calculate charges
    const bedCharges = bed.bedCharges * daysStayed;

    // ✅ Calculate service charges
    const serviceCharges = bed.services.reduce((acc, s) => {
      return acc + (s.price || 0) * (s.quantity || 1);
    }, 0);

    // ✅ Calculate treatment charges
    const treatmentCharges = bed.treatments.reduce((acc, t) => acc + (t.price || 0), 0);

    // ✅ Calculate medicine charges
    const medicineCharges = bed.medicines.reduce((acc, m) => acc + (m.price || 0), 0);

    const totalBeforeDiscount = bedCharges + serviceCharges + treatmentCharges + medicineCharges;
    const finalAmount = totalBeforeDiscount - grantsOrDiscounts;

    // ✅ Create IPD entry
    const ipd = await IPD.create({
      clinic: userId,
      patient: bed.patient._id,
      ipdNumber: await generateRandomBillId(),
      admissionDate,
      dischargeDate: discharge,
      bed: bed,
      billing: {
        bedCharges,
        serviceCharges,
        treatmentCharges,
        medicineCharges,
        grantsOrDiscounts,
        totalBeforeDiscount,
        finalAmount,
      },
      note,
    });


    bed.status = "Available";
    bed.patient = null;
    await bed.save();

    console.log({
      clinic: userId,
      patient: bed.patient._id,
      ipdNumber: await generateRandomBillId(),
      admissionDate,
      dischargeDate: discharge,
      bed: bed,
      billing: {
        bedCharges,
        serviceCharges,
        treatmentCharges,
        medicineCharges,
        grantsOrDiscounts,
        totalBeforeDiscount,
        finalAmount,
      },
      note,
    })

    res.status(201).json({
      message: "IPD record created successfully",
      ipd,
    });
  } catch (err) {
    console.error("Create IPD error:", err);
    res.status(500).json({ message: err.message });
  }
};


// export const updateIPD = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;

//     const {
//       admissionDate,
//       dischargeDate,
//       bedId, // ✅ new bed ID
//       otherCharges = [],
//       grantsOrDiscounts = 0,
//       treatments = [],
//       status,
//       note // ✅ added note
//     } = req.body;

//     const ipd = await IPD.findOne({ _id: id, clinic: userId }).populate("bed");
//     if (!ipd) return res.status(404).json({ message: "IPD record not found" });

//     let currentBedCharges = ipd.bed.bedCharges; // old bed charges by default
//     let newBed; // placeholder for new bed

//     // ✅ If bed changed, update beds and set correct bed charges
//     if (bedId && bedId !== String(ipd.bed._id)) {
//       // Free old bed
//       const oldBed = await Bed.findById(ipd.bed._id);
//       if (oldBed) {
//         oldBed.status = "Available";
//         oldBed.patient = null;
//         await oldBed.save();
//       }

//       // Occupy new bed
//       newBed = await Bed.findOne({ _id: bedId, clinic: userId });
//       if (!newBed) return res.status(404).json({ message: "New bed not found" });

//       newBed.status = "Occupied";
//       newBed.patient = ipd.patient;
//       await newBed.save();

//       ipd.bed = newBed._id;
//       currentBedCharges = newBed.bedCharges; // ✅ use new bed charges
//     }

//     // ✅ Prepare treatments
//     let serviceCharges = 0;
//     let treatmentDetails = [];
//     for (const t of treatments) {
//       const service = await Service.findOne({ _id: t.service, clinic: userId });
//       if (!service) {
//         return res.status(404).json({ message: `Service not found for ID ${t.service}` });
//       }

//       const totalCharges = service.price * (t.quantity || 1);
//       serviceCharges += totalCharges;

//       treatmentDetails.push({
//         service: service._id,
//         quantity: t.quantity || 1,
//         totalCharges,
//       });
//     }

//     // ✅ Calculate stay duration and charges
//     const admitDate = new Date(admissionDate || ipd.admissionDate);
//     const discharge = dischargeDate
//       ? new Date(dischargeDate)
//       : ipd.dischargeDate || (status === "Discharged" ? new Date() : null);

//     const daysStayed = discharge
//       ? Math.max(1, Math.ceil((discharge - admitDate) / (1000 * 60 * 60 * 24)))
//       : Math.max(1, Math.ceil((new Date() - admitDate) / (1000 * 60 * 60 * 24)));

//     const totalBedCharges = (currentBedCharges || 0) * daysStayed;
//     const otherTotal = otherCharges.reduce((sum, item) => sum + (item.amount || 0), 0);
//     const validDiscount = Math.max(0, grantsOrDiscounts || 0);
//     const totalBeforeDiscount = totalBedCharges + serviceCharges + otherTotal;
//     const finalAmount = totalBeforeDiscount - validDiscount;

//     // ✅ Update IPD record
//     ipd.admissionDate = admitDate;
//     ipd.dischargeDate = dischargeDate || ipd.dischargeDate;
//     ipd.status = status || ipd.status;
//     ipd.treatments = treatmentDetails;
//     ipd.note = note || ipd.note; // ✅ update note if provided

//     ipd.billing = {
//       bedCharges: totalBedCharges,
//       serviceCharges,
//       otherCharges,
//       grantsOrDiscounts,
//       totalBeforeDiscount,
//       finalAmount,
//     };

//     // ✅ If discharged, free the bed
//     if (status === "Discharged" || dischargeDate) {
//       ipd.paymentStatus = "paid";
//       const currentBed = await Bed.findById(ipd.bed);
//       if (currentBed) {
//         currentBed.status = "Available";
//         currentBed.patient = null;
//         await currentBed.save();
//       }
//     }

//     await ipd.save();

//     res.json({
//       message: "IPD record updated successfully",
//       ipd,
//     });
//   } catch (err) {
//     console.error("Update IPD error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateIPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { bedId, note, grantsOrDiscounts, dischargeDate, status } = req.body;

    const ipd = await IPD.findOne({ _id: id, clinic: userId }).populate("bed");
    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // ✅ Handle bed change
    if (bedId && bedId !== String(ipd.bed._id)) {
      const oldBed = await Bed.findById(ipd.bed._id);
      if (oldBed) {
        oldBed.status = "Available";
        oldBed.patient = null;
        await oldBed.save();
      }

      const newBed = await Bed.findById(bedId)
        .populate("patient")
        .populate("services.service")
        .populate("treatments")
        .populate("medicines");

      if (!newBed) return res.status(404).json({ message: "New bed not found" });

      newBed.status = "Occupied";
      newBed.patient = ipd.patient;
      await newBed.save();
      ipd.bed = newBed._id;
    }

    const bed = await Bed.findById(ipd.bed)
      .populate("services.service")
      .populate("treatments")
      .populate("medicines");

    if (!bed) return res.status(404).json({ message: "Bed not found" });

    // ✅ Recalculate charges based on updated info
    const admissionDate = new Date(ipd.admissionDate);
    const discharge = dischargeDate ? new Date(dischargeDate) : ipd.dischargeDate || new Date();
    const daysStayed = Math.max(1, Math.ceil((discharge - admissionDate) / (1000 * 60 * 60 * 24)));

    const bedCharges = bed.bedCharges * daysStayed;
    const serviceCharges = bed.services.reduce((acc, s) => acc + (s.price || 0) * (s.quantity || 1), 0);
    const treatmentCharges = bed.treatments.reduce((acc, t) => acc + (t.price || 0), 0);
    const medicineCharges = bed.medicines.reduce((acc, m) => acc + (m.price || 0), 0);

    const totalBeforeDiscount = bedCharges + serviceCharges + treatmentCharges + medicineCharges;
    const finalAmount = totalBeforeDiscount - (grantsOrDiscounts || ipd.billing.grantsOrDiscounts);

    // ✅ Update IPD
    ipd.dischargeDate = dischargeDate || ipd.dischargeDate;
    ipd.status = status || ipd.status;
    ipd.note = note || ipd.note;

    ipd.billing = {
      bedCharges,
      serviceCharges,
      treatmentCharges,
      medicineCharges,
      grantsOrDiscounts: grantsOrDiscounts ?? ipd.billing.grantsOrDiscounts,
      totalBeforeDiscount,
      finalAmount,
    };

    // ✅ If discharged, free bed
    if (status === "Discharged" || dischargeDate) {
      const currentBed = await Bed.findById(ipd.bed);
      if (currentBed) {
        currentBed.status = "Available";
        currentBed.patient = null;
        await currentBed.save();
      }
    }

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


// export const getIPDs = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const ipds = await IPD.find({ clinic: userId })
//       .populate("patient")
//       .populate("treatments.service")
//       .sort({ createdAt: -1 });

//     res.json(ipds);

//   } catch (err) {
//     console.error("Get IPDs error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const getIPDs = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipds = await IPD.find({ clinic: userId })
      .populate("patient")
      .populate("bed")
      .sort({ createdAt: -1 });

    res.json(ipds);
  } catch (err) {
    console.error("Get IPDs error:", err);
    res.status(500).json({ message: err.message });
  }
};

// export const getIPDById = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const ipd = await IPD.findOne({ _id: req.params.id, clinic: userId })
//       .populate("patient")
//       .populate("treatments.service")
//       .populate("bed");

//     if (!ipd) return res.status(404).json({ message: "IPD record not found" });

//     res.json(ipd);

//   } catch (err) {
//     console.error("Get IPD by ID error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const getIPDById = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipd = await IPD.findOne({ _id: req.params.id, clinic: userId })
      .populate("patient")
      .populate("bed")
      .populate("bed.services.service");

    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    res.json(ipd);
  } catch (err) {
    console.error("Get IPD by ID error:", err);
    res.status(500).json({ message: err.message });
  }
};




// export const dischargeIPD = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;
//     const { dischargeDate } = req.body;

//     // 1. Find the IPD record
//     const ipd = await IPD.findOne({ _id: id, clinic: userId }).populate("treatments.service");
//     if (!ipd) return res.status(404).json({ message: "IPD record not found" });

//     // 2. Check if already discharged
//     if (ipd.status === "Discharged") {
//       return res.status(400).json({ message: "Patient already discharged" });
//     }

//     // 3. Set discharge date
//     const discharge = dischargeDate ? new Date(dischargeDate) : new Date();
//     ipd.dischargeDate = discharge;
//     ipd.status = "Discharged";

//     // 4. Calculate days stayed (minimum 1)
//     const admitDate = new Date(ipd.admissionDate);
//     const daysStayed = Math.max(1, Math.ceil((discharge - admitDate) / (1000 * 60 * 60 * 24)));

//     // 5. Bed charges calculation
//     const previousBedCharges = ipd.billing?.bedCharges || 0;
//     const bedChargesPerDay = previousBedCharges / Math.max(1, ipd.stayDays || daysStayed);
//     const updatedBedCharges = bedChargesPerDay * daysStayed;

//     // 6. Recalculate service charges
//     let serviceCharges = 0;
//     for (const t of ipd.treatments) {
//       const price = t?.service?.price || 0;
//       t.totalCharges = price * (t.quantity || 1);
//       serviceCharges += t.totalCharges;
//     }

//     // 7. Other charges
//     const otherChargesList = ipd.billing?.otherCharges || [];
//     const otherTotal = otherChargesList.reduce((sum, item) => sum + (item.amount || 0), 0);

//     // 8. Discounts
//     const grantsOrDiscounts = ipd.billing?.grantsOrDiscounts || 0;

//     // 9. Final total
//     const totalBeforeDiscount = updatedBedCharges + serviceCharges + otherTotal;
//     const finalAmount = totalBeforeDiscount - grantsOrDiscounts;

//     // 10. Mark as fully paid
//     const paidAmount = finalAmount;
//     const paymentStatus = "paid";

//     // ✅ Update both nested billing and top-level field
//     ipd.billing = {
//       ...ipd.billing,
//       bedCharges: updatedBedCharges,
//       serviceCharges,
//       otherCharges: otherChargesList,
//       grantsOrDiscounts,
//       totalBeforeDiscount,
//       finalAmount,
//       paidAmount,
//       paymentStatus,
//     };

//     ipd.paymentStatus = paymentStatus; // ✅ FIXED HERE

//     // 11. Save
//     await ipd.save();

//     res.status(200).json({
//       message: "Patient discharged and billing updated successfully",
//       ipd,
//     });
//   } catch (err) {
//     console.error("Discharge IPD error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const dischargeIPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { dischargeDate } = req.body;

    const ipd = await IPD.findOne({ _id: id, clinic: userId }).populate("bed");
    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    if (ipd.status === "Discharged") {
      return res.status(400).json({ message: "Patient already discharged" });
    }

    const discharge = dischargeDate ? new Date(dischargeDate) : new Date();
    const admissionDate = new Date(ipd.admissionDate);
    const daysStayed = Math.max(1, Math.ceil((discharge - admissionDate) / (1000 * 60 * 60 * 24)));

    const bed = await Bed.findById(ipd.bed)
      .populate("services.service")
      .populate("treatments")
      .populate("medicines");

    const bedCharges = bed.bedCharges * daysStayed;
    const serviceCharges = bed.services.reduce((acc, s) => acc + (s.price || 0) * (s.quantity || 1), 0);
    const treatmentCharges = bed.treatments.reduce((acc, t) => acc + (t.price || 0), 0);
    const medicineCharges = bed.medicines.reduce((acc, m) => acc + (m.price || 0), 0);

    const totalBeforeDiscount = bedCharges + serviceCharges + treatmentCharges + medicineCharges;
    const finalAmount = totalBeforeDiscount - (ipd.billing.grantsOrDiscounts || 0);

    ipd.status = "Discharged";
    ipd.dischargeDate = discharge;
    ipd.billing = {
      ...ipd.billing,
      bedCharges,
      serviceCharges,
      treatmentCharges,
      medicineCharges,
      totalBeforeDiscount,
      finalAmount,
      paymentStatus: "paid",
    };

    await ipd.save();

    bed.status = "Available";
    bed.patient = null;
    await bed.save();

    res.status(200).json({
      message: "Patient discharged successfully",
      ipd,
    });
  } catch (err) {
    console.error("Discharge IPD error:", err);
    res.status(500).json({ message: err.message });
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

// export const downloadIPDPDF = async (req, res) => {
//   try {
//     const ipd = await IPD.findOne({
//       _id: req.params.id,
//       clinic: req.user.id,
//     })
//       .populate("patient", "name phoneNumber age gender address")
//       .populate("treatments.service", "name price gstRate category")
//       .populate("bed", "bedNumber bedCharges");

//     if (!ipd) return res.status(404).json({ message: "IPD record not found" });

//     // Ensure treatments have service name and handle missing date
//     const enrichedTreatments = (ipd.treatments || []).map((t) => ({
//       ...t.toObject(),
//       service: t.service
//         ? {
//           name: t.service.name || "Unknown",
//           price: t.service.price || 0,
//           gstRate: t.service.gstRate || 0,
//           category: t.service.category || "N/A",
//         }
//         : { name: "Unknown", price: 0 },
//       date: t.date || ipd.admissionDate, // fallback to admission date if missing
//     }));

//     ipd.treatments = enrichedTreatments;

//     // Fetch clinic details
//     const clinic = await Clinic.findOne({ user: req.user.id });
//     console.log("Clinic data:", clinic);

//     if (!clinic) return res.status(404).json({ message: "Clinic not found" });

//     const pdfBuffer = await generateIPDPDF(ipd, clinic, ipd.patient);

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename=${ipd.ipdNumber || "IPD"}.pdf`,
//       "Content-Length": pdfBuffer.length,
//     });

//     res.send(pdfBuffer);
//   } catch (err) {
//     console.error("Download IPD PDF error:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };



export const downloadIPDPDF = async (req, res) => {
  try {
    const ipd = await IPD.findOne({
      _id: req.params.id,
      clinic: req.user.id,
    })
      .populate("patient", "name phoneNumber age gender address")
      .populate("treatments.service", "name price gstRate category")
      .populate("bed", "bedNumber bedCharges");

    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // Normalize treatments
    const enrichedTreatments = (ipd.treatments || []).map((t) => ({
      ...t.toObject(),
      service: t.service
        ? {
            name: t.service.name || "Unknown",
            price: t.service.price || 0,
            gstRate: t.service.gstRate || 0,
            category: t.service.category || "N/A",
          }
        : { name: "Unknown", price: 0 },
      date: t.date || ipd.admissionDate,
    }));
    ipd.treatments = enrichedTreatments;

    const clinic = await Clinic.findOne({ user: req.user.id });
    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    const pdfBuffer = await generateIPDPDF(ipd, clinic, ipd.patient);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${ipd.ipdNumber || "IPD"}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Download IPD PDF error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};



// export const printIPDPDF = async (req, res) => {
//   try {
//     const ipd = await IPD.findOne({
//       _id: req.params.id,
//       clinic: req.user.id,
//     })
//       .populate("patient", "name phoneNumber age gender address")
//       .populate("treatments.service", "name price gstRate category")
//       .populate("bed", "bedNumber bedCharges");

//     if (!ipd) return res.status(404).json({ message: "IPD record not found" });

//     const enrichedTreatments = (ipd.treatments || []).map((t) => ({
//       ...t.toObject(),
//       serviceName: t.service?.name || "Unknown",
//       date: t.date || ipd.admissionDate,
//     }));

//     ipd.treatments = enrichedTreatments;

//     const clinic = await Clinic.findOne({ user: req.user.id });
//     console.log("Clinic data:", clinic);

//     if (!clinic) return res.status(404).json({ message: "Clinic not found" });

//     const pdfBuffer = await generateIPDPDF(ipd, clinic, ipd.patient);

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `inline; filename=${ipd.ipdNumber || "IPD"}.pdf`,
//       "Content-Length": pdfBuffer.length,
//     });

//     res.send(pdfBuffer);
//   } catch (err) {
//     console.error("Print IPD PDF error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };



export const printIPDPDF = async (req, res) => {
  try {
    const ipd = await IPD.findOne({
      _id: req.params.id,
      clinic: req.user.id,
    })
      .populate("patient", "name phoneNumber age gender address")
      .populate("treatments.service", "name price gstRate category")
      .populate("bed", "bedNumber bedCharges");

    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // Normalize treatments
    const enrichedTreatments = (ipd.treatments || []).map((t) => ({
      ...t.toObject(),
      serviceName: t.service?.name || "Unknown",
      date: t.date || ipd.admissionDate,
    }));
    ipd.treatments = enrichedTreatments;

    const clinic = await Clinic.findOne({ user: req.user.id });
    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    const pdfBuffer = await generateIPDPDF(ipd, clinic, ipd.patient);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${ipd.ipdNumber || "IPD"}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Print IPD PDF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
