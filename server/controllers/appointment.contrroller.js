import { Appointment } from "../models/appointment.model.js";
import { Patient } from "../models/patient.model.js";
import { Service } from "../models/service.model.js";
import { Counter } from "../models/counter.model.js";
import { Business } from "../models/business.model.js";
import { generateInvoicePDF } from "../utils/pdfGenerator.js"; // reuse
import { sendInvoiceViaWhatsApp, uploadPDFAndGetLink } from "../utils/whatsappSender.js"; // reuse

const getNextAppointmentNumber = async () => {
  const latest = await Appointment.findOne({}).sort({ createdAt: -1 }).lean();
  let lastNumber = 0;
  if (latest?.appointmentNumber) {
    const match = latest.appointmentNumber.match(/APT(\d+)/);
    if (match) lastNumber = parseInt(match[1], 10);
  }

  const counterDoc = await Counter.findOne({ _id: "appointmentNumber" });
  let currentCounter = counterDoc ? counterDoc.sequence_value : 0;
  let nextNumber = Math.max(lastNumber, currentCounter) + 1;

  await Counter.findOneAndUpdate(
    { _id: "appointmentNumber" },
    { sequence_value: nextNumber },
    { upsert: true, new: true }
  );

  return `APT${String(nextNumber).padStart(4, "0")}`;
};

// CREATE
export const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId, services, date, time, paymentMethod, status, notes } = req.body;

    let totalAmount = 0;
    const appointmentServices = [];

    for (const item of services) {
      const service = await Service.findById(item.service);
      if (!service) return res.status(404).json({ message: "Service not found" });

      const price = service.price;
      totalAmount += price;

      appointmentServices.push({
        name: service.name,
        price
      });
    }

    const appointment = await Appointment.create({
      user: userId,
      appointmentNumber: await getNextAppointmentNumber(),
      patient: patientId,
      services: appointmentServices,
      totalAmount,
      date,
      time,
      paymentMethod,
      status,
      notes
    });

    // update patient visit history
    const patient = await Patient.findById(patientId);
    if (patient) {
      patient.visits.push(appointment._id);
      await patient.save();
    }

    res.status(201).json({ message: "Appointment created", appointment });
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    console.error("Update appointment error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await Appointment.findOneAndDelete({ _id: id, user: userId });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("Delete appointment error:", err);
    res.status(500).json({ message: err.message });
  }
};

// LIST ALL
export const getAppointments = async (req, res) => {
  try {
    const { date, patient } = req.query;
    const query = { user: req.user.id };

    if (date) query.date = date;
    if (patient) query.patient = patient;

    const appointments = await Appointment.find(query)
      .populate("patient", "name phoneNumber")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOne({ _id: id, user: req.user.id })
      .populate("patient", "name phoneNumber");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DOWNLOAD PDF
export const downloadAppointmentPDF = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user.id })
      .populate("patient", "name phoneNumber");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const business = await Business.findOne({ user: req.user.id });
    const pdfBuffer = await generateInvoicePDF(appointment, business); // reuse with appointment data

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${appointment.appointmentNumber}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Download PDF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PRINT PDF
export const printAppointmentPDF = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user.id })
      .populate("patient", "name phoneNumber");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const business = await Business.findOne({ user: req.user.id });
    const pdfBuffer = await generateInvoicePDF(appointment, business);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${appointment.appointmentNumber}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Print PDF error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// SEND WHATSAPP
export const sendAppointmentWhatsApp = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user.id })
      .populate("patient", "name phoneNumber");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const pdfBuffer = await generateInvoicePDF(appointment); // reuse
    const pdfUrl = await uploadPDFAndGetLink(pdfBuffer, `appointment-${appointment._id}.pdf`);

    await sendInvoiceViaWhatsApp(appointment.patient.phoneNumber, pdfUrl);
    res.json({ message: "Appointment slip sent via WhatsApp ✅" });
  } catch (err) {
    console.error("Send WhatsApp error:", err);
    res.status(500).json({ message: "Failed to send via WhatsApp ❌" });
  }
};
