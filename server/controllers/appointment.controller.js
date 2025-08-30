import { Appointment } from "../models/appointment.model.js";
import { Patient } from "../models/patient.model.js";
import { Counter } from "../models/counter.model.js";
import crypto from "crypto";

const generateAppointmentId = () => {
  const randomString = crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
  return `APT-${randomString}`;
};

export const createAppointment = async (req, res) => {
  try {
    const clinicId = req.user.id;
    const { patientId, newPatient, date, time, description, status } = req.body;

    if (!date || !time) return res.status(400).json({ message: "Date and time are required." });

    let patient;

    // ✅ Check if patient exists or create a new one
    if (patientId) {
      patient = await Patient.findOne({ _id: patientId, clinic: clinicId });
      if (!patient) return res.status(404).json({ message: "Patient not found" });
    } else if (newPatient) {
      const { name, phoneNumber, address, age, gender } = newPatient;
      if (!name || !phoneNumber || !address || !age || !gender) {
        return res.status(400).json({ message: "All patient fields are required" });
      }

      patient = await Patient.create({
        clinic: clinicId,
        name,
        phoneNumber,
        address,
        age,
        gender,
        visits: [],
        history: []
      });
    } else {
      return res.status(400).json({ message: "Either patientId or newPatient must be provided." });
    }

    const appointmentNumber = generateAppointmentId();

    const appointment = await Appointment.create({
      clinic: clinicId,
      patient: patient._id,
      appointmentNumber,
      description: description || "",
      date: new Date(date),
      time,
      status: status || "Scheduled" // ✅ Default is Scheduled if not provided
    });

    // ✅ Add appointment to patient's visits and history
    patient.visits.push(appointment._id);
    patient.history.push({
      appointmentId: appointment._id,
      appointmentNumber,
      description: description || "",
      date: new Date(date),
      time,
      createdAt: new Date(),
      status: status || "Scheduled"
    });

    await patient.save();

    res.status(201).json({ message: "Appointment created successfully", appointment });

  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { patientId, name, phoneNumber, age, gender, description, date, time, status } = req.body;

    if (!id) return res.status(400).json({ message: "Invalid appointment ID" });

    // ✅ Update appointment fields (including status)
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, clinic: userId },
      { description, date, time, ...(status && { status }) },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    let patient;

    // ✅ Handle patient update or creation
    if (patientId) {
      patient = await Patient.findOne({ _id: patientId, clinic: userId });
      if (!patient) return res.status(404).json({ message: "Patient not found" });
    } else {
      if (!name || !phoneNumber) return res.status(400).json({ message: "Patient name and phone number required." });
      patient = await Patient.create({
        clinic: userId,
        name,
        phoneNumber,
        age,
        gender,
        visits: [],
        history: []
      });
    }

    // ✅ Update appointment patient reference if changed
    appointment.patient = patient._id;
    await appointment.save();

    // ✅ Update patient visits and history
    if (!patient.visits.includes(appointment._id)) patient.visits.push(appointment._id);

    patient.history.push({
      appointmentId: appointment._id,
      appointmentNumber: appointment.appointmentNumber,
      description: description || "",
      date,
      time,
      updatedAt: new Date(),
      status: status || appointment.status
    });

    // ✅ Update patient details if provided
    if (name) patient.name = name;
    if (phoneNumber) patient.phoneNumber = phoneNumber;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;

    await patient.save();

    res.json({ message: "Appointment and patient updated successfully", appointment });

  } catch (err) {
    console.error("Update appointment error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { date, patient, status } = req.query;
    const query = { clinic: req.user.id };

    if (date) {
      // Ensure proper date comparison
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    if (patient) query.patient = patient;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate("patient")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // ✅ Delete the appointment belonging to this clinic
    const appointment = await Appointment.findOneAndDelete({ _id: id, clinic: userId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ✅ Remove appointment reference from patient's visits array
    await Patient.findOneAndUpdate(
      { visits: appointment._id },
      { $pull: { visits: appointment._id } },
      { new: true }
    );

    // ✅ Fetch remaining appointments of this clinic
    const appointments = await Appointment.find({ clinic: userId }).sort({ createdAt: 1 });

    // ✅ Recalculate appointment numbers using updateMany (no validation issue)
    let counter = 1;
    for (const appt of appointments) {
      await Appointment.updateOne(
        { _id: appt._id },
        { $set: { appointmentNumber: `APT${String(counter).padStart(4, "0")}` } }
      );
      counter++;
    }

    // ✅ Update counter collection
    await Counter.findOneAndUpdate(
      { _id: "appointmentNumber" },
      { sequence_value: counter - 1 },
      { upsert: true }
    );

    return res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Delete appointment error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOne({ _id: id, clinic: req.user.id })
      .populate("patient");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json(appointment);
  } catch (err) {
    console.error("Get appointment by ID error:", err);
    res.status(500).json({ message: err.message });
  }
};
