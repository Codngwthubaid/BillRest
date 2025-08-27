import { Appointment } from "../models/appointment.model.js";
import { Patient } from "../models/patient.model.js";
import { Counter } from "../models/counter.model.js";
import crypto from "crypto"

const generateAppointmentId = () => {
  const randomString = crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
  return `APT-${randomString}`;
};

export const createAppointment = async (req, res) => {
  try {
    const clinicId = req.user.id;
    const { patientId, newPatient, date, time, description } = req.body;

    if (!date || !time) return res.status(400).json({ message: "Date and time are required." });

    let patient;

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
    });

    patient.visits.push(appointment._id);
    patient.history.push({
      appointmentId: appointment._id,
      appointmentNumber,
      description: description || "",
      date: new Date(date),
      time,
      createdAt: new Date()
    });

    await patient.save();

    res.status(201).json({ message: "Appointment created successfully", appointment });

  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getAppointments = async (req, res) => {
  try {
    const { date, patient } = req.query;
    const query = { clinic: req.user.id };

    if (date) query.date = date;
    if (patient) query.patient = patient;

    const appointments = await Appointment.find(query)
      .populate("patient")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { patientId, name, phoneNumber, age, gender, description, status, admitted, date, time } = req.body;

    if (!id) return res.status(400).json({ message: "Invalid appointment ID" });

    // 1. Update appointment
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, clinic: userId },
      { description, status, admitted, date, time },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    let patient;

    // 2. Handle patient update or creation
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

    // 3. Update appointment patient reference if changed
    appointment.patient = patient._id;
    await appointment.save();

    // 4. Update patient visits and history
    if (!patient.visits.includes(appointment._id)) patient.visits.push(appointment._id);

    patient.history.push({
      appointmentId: appointment._id,
      appointmentNumber: appointment.appointmentNumber,
      description: description || "",
      status: status || "Pending",
      admitted: admitted || false,
      date,
      time,
      updatedAt: new Date()
    });

    // Update patient details if new data provided
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

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await Appointment.findOneAndDelete({ _id: id, clinic: userId });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Remove appointment reference from patient
    const patient = await Patient.findOneAndUpdate(
      { visits: appointment._id },
      { $pull: { visits: appointment._id } },
      { new: true }
    );

    // Recalculate appointment numbers
    const appointments = await Appointment.find({ clinic: userId }).sort({ createdAt: 1 });
    let counter = 1;
    for (const appt of appointments) {
      appt.appointmentNumber = `APT${String(counter).padStart(4, "0")}`;
      await appt.save();
      counter++;
    }

    await Counter.findOneAndUpdate(
      { _id: "appointmentNumber" },
      { sequence_value: counter - 1 },
      { upsert: true }
    );

    res.json({ message: "Appointment and related patient updated/deleted successfully" });

  } catch (err) {
    console.error("Delete appointment error:", err);
    res.status(500).json({ message: err.message });
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
