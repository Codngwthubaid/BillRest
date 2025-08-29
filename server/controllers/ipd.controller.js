import { Appointment } from "../models/appointment.model.js"
import { generateIPDPDF } from "../utils/generateIPDPDF.js"
import { Bed } from "../models/bed.model.js"
import { Clinic } from "../models/clinic.model.js"
import crypto from "crypto";
import { IPD } from "../models/ipd.model.js"
import { Service } from "../models/service.model.js";

const generateRandomBillId = () => {
  const randomString = crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
  return `Bill-${randomString}`;
};

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
      paymentStatus: "pending",
      note,
    });


    bed.status = "Available";
    bed.patient = null;
    await bed.save();

    console.log({
      clinic: userId,
      patient: bed.patient,
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

export const updateIPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { bedId, note, grantsOrDiscounts, dischargeDate, status, paymentStatus } = req.body;

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
    ipd.paymentStatus = paymentStatus || ipd.paymentStatus;

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

export const downloadIPDPDF = async (req, res) => {
  try {
    // Fetch IPD with all related fields, populate clinic directly
    const ipd = await IPD.findOne({
      _id: req.params.id,
      clinic: req.user.id,
    })
      .populate("patient", "name phoneNumber age gender address") // patient details
      .populate({
        path: "bed",
        populate: [
          { path: "services.service" }, // populate services
          { path: "treatments" }, // populate treatments in bed
          { path: "medicines" }, // populate medicines in bed
        ],
      })
      .populate({
        path: "treatments",
        populate: { path: "service", select: "name price gstRate category" }, // populate service for treatments
      })
      .populate("clinic", "name phone email"); // ✅ populate clinic directly

    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // Enrich treatments
    ipd.treatments = (ipd.treatments || []).map((t) => ({
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

    // Use populated clinic
    const clinic = ipd.clinic;
    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    // Prepare PDF data
    const pdfData = {
      ipdNumber: ipd.ipdNumber,
      admissionDate: ipd.admissionDate,
      dischargeDate: ipd.dischargeDate,
      note: ipd.note,
      patient: ipd.patient,
      bed: ipd.bed || {},
      treatments: ipd.treatments,
      billing: ipd.billing || {},
      services: ipd.bed?.services || [],
      medicines: ipd.bed?.medicines || [],
    };

    // Generate PDF
    const pdfBuffer = await generateIPDPDF(pdfData, clinic, ipd.patient);

    // Send PDF as attachment
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

export const printIPDPDF = async (req, res) => {
  try {
    // Fetch IPD record with all related fields, populate clinic from IPD
    const ipd = await IPD.findOne({
      _id: req.params.id,
      clinic: req.user.id,
    })
      .populate("patient") // patient details
      .populate({
        path: "bed",
        populate: [
          { path: "patient" }, // patient assigned to bed (if any)
          { path: "services.service" }, // services details
          { path: "treatments" }, // treatment details
          { path: "medicines" }, // medicine details
        ],
      })
      .populate({
        path: "treatments",
        populate: { path: "service" }, // populate service for treatments
      })
      .populate("clinic", "name phone email"); // ✅ populate clinic with required fields

    if (!ipd) return res.status(404).json({ message: "IPD record not found" });

    // Enrich treatments with date if not present
    ipd.treatments = (ipd.treatments || []).map((t) => ({
      ...t.toObject(),
      date: t.date || ipd.admissionDate,
    }));

    // Now clinic is populated from IPD
    const clinic = ipd.clinic;
    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    // Build complete data object for PDF
    const pdfData = {
      ipdNumber: ipd.ipdNumber,
      admissionDate: ipd.admissionDate,
      dischargeDate: ipd.dischargeDate,
      note: ipd.note,
      patient: ipd.patient,
      bed: ipd.bed || {},
      treatments: ipd.treatments,
      billing: ipd.billing || {},
      services: ipd.bed?.services || [],
      medicines: ipd.bed?.medicines || [],
    };

    // Generate PDF
    const pdfBuffer = await generateIPDPDF(pdfData, clinic, ipd.patient);

    // Send PDF as response
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

export const createOPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId, note = "", grantsOrDiscounts = 0 } = req.body;

    // ✅ Find the appointment
    const appointment = await Appointment.findById(appointmentId).populate("patient");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // ✅ Use a flat OPD charge (if you want, can also take it from request)
    const consultationCharge = 500; // Example fixed charge
    const totalBeforeDiscount = consultationCharge;
    const finalAmount = totalBeforeDiscount - grantsOrDiscounts;

    // ✅ Create OPD record
    const opd = await IPD.create({
      clinic: userId,
      patient: appointment.patient._id,
      appointment: appointmentId,
      ipdNumber: await generateRandomBillId(),
      consultationDate: appointment.date,
      billing: {
        consultationCharge,
        grantsOrDiscounts,
        totalBeforeDiscount,
        finalAmount,
      },
      paymentStatus: "pending",
      note,
    });

    res.status(201).json({
      message: "OPD record created successfully",
      opd,
    });
  } catch (err) {
    console.error("Create OPD error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateOPD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // OPD record ID (stored in IPD collection)
    const { services = [], note, grantsOrDiscounts, paymentStatus } = req.body;

    // ✅ Find OPD Record in IPD collection
    const opd = await IPD.findOne({ _id: id, clinic: userId }).populate("treatments.service");
    if (!opd) return res.status(404).json({ message: "OPD record not found" });

    // ✅ Add new treatments (services) if provided
    if (services.length > 0) {
      for (let s of services) {
        const serviceData = await Service.findById(s.serviceId);
        if (!serviceData) {
          return res.status(404).json({ message: `Service not found: ${s.serviceId}` });
        }

        const quantity = s.quantity || 1;
        const totalCharges = serviceData.price * quantity;

        opd.treatments.push({
          service: serviceData._id,
          quantity,
          date: new Date(),
          totalCharges,
        });
      }
    }

    // ✅ Recalculate charges
    const bedCharges = opd.billing.bedCharges || 0; // For OPD, usually 0
    const serviceCharges = opd.treatments.reduce((acc, t) => acc + t.totalCharges, 0);
    const grants = grantsOrDiscounts ?? opd.billing.grantsOrDiscounts;

    const totalBeforeDiscount = bedCharges + serviceCharges;
    const finalAmount = totalBeforeDiscount - grants;

    // ✅ Update billing object
    opd.billing = {
      bedCharges,
      serviceCharges,
      grantsOrDiscounts: grants,
      totalBeforeDiscount,
      finalAmount,
    };

    if (note) opd.note = note;
    if (paymentStatus) opd.paymentStatus = paymentStatus;

    await opd.save();

    res.json({
      message: "OPD updated successfully with services",
      opd,
    });
  } catch (err) {
    console.error("Update OPD error:", err);
    res.status(500).json({ message: err.message });
  }
};

