import { Appointment } from "../models/appointment.model.js";
import { Patient } from "../models/patient.model.js";
import { Counter } from "../models/counter.model.js";
import { Clinic } from "../models/clinic.model.js";


const getNextAppointmentNumber = async () => {
  const latestAppointment = await Appointment.findOne({})
    .sort({ createdAt: -1 })
    .lean();

  let lastNumber = 0;
  if (latestAppointment?.appointmentNumber) {
    const match = latestAppointment.appointmentNumber.match(/APT(\d+)/);
    if (match) {
      lastNumber = parseInt(match[1], 10);
    }
  }

  const counterDoc = await Counter.findOne({ _id: "appointmentNumber" });
  const currentCounter = counterDoc ? counterDoc.sequence_value : 0;

  const nextNumber = Math.max(lastNumber, currentCounter) + 1;

  await Counter.findOneAndUpdate(
    { _id: "appointmentNumber" },
    { sequence_value: nextNumber },
    { upsert: true, new: true }
  );

  return `APT${String(nextNumber).padStart(4, "0")}`;
};

export const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name, phoneNumber, address, age, gender,
      description, status, admitted, appointmentNumber
    } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ message: "Patient name and phone number are required." });
    }

    const clinicDetails = await Clinic.findOne({ user: userId });
    let patient = await Patient.findOne({ clinic: userId, phoneNumber });
    if (!patient) {
      patient = await Patient.create({
        clinic: userId,
        name, phoneNumber, address, age, gender, visits: [],
        clinicData: clinicDetails,
      });
    } else {
      patient.name = name;
      patient.address = address;
      patient.age = age;
      patient.gender = gender;
      await patient.save();
    }

    let finalAppointmentNumber = appointmentNumber || await getNextAppointmentNumber();

    if (appointmentNumber) {
      const match = appointmentNumber.match(/APT(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        const counterDoc = await Counter.findOne({ _id: "appointmentNumber" });
        const currentCounter = counterDoc ? counterDoc.sequence_value : 0;
        if (num >= currentCounter) {
          await Counter.findOneAndUpdate(
            { _id: "appointmentNumber" },
            { sequence_value: num },
            { upsert: true }
          );
        }
      }
    }


    const appointment = await Appointment.create({
      clinic: userId,
      appointmentNumber: finalAppointmentNumber,
      patient: patient?._id,
      clinicData: clinicDetails,
      description,
      status,
      admitted
    });

    patient.visits.push(appointment._id);
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
    const { appointmentNumber, name, phoneNumber, address, age, gender } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    if (appointmentNumber) {
      const existingNumber = await Appointment.findOne({
        appointmentNumber,
        _id: { $ne: id }
      });

      if (existingNumber) {
        return res.status(400).json({ message: `Appointment number ${appointmentNumber} already exists.` });
      }

      const match = appointmentNumber.match(/APT(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        const counterDoc = await Counter.findOne({ _id: "appointmentNumber" });
        const currentCounter = counterDoc ? counterDoc.sequence_value : 0;
        if (num >= currentCounter) {
          await Counter.findOneAndUpdate(
            { _id: "appointmentNumber" },
            { sequence_value: num },
            { upsert: true }
          );
        }
      }
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, clinic: userId },
      req.body,
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (name || phoneNumber || address || age || gender) {
      const patient = await Patient.findOne({ _id: appointment.patient, clinic: userId });
      if (patient) {
        if (req.body.hasOwnProperty("name")) patient.name = name;
        if (req.body.hasOwnProperty("phoneNumber")) patient.phoneNumber = phoneNumber;
        if (req.body.hasOwnProperty("address")) patient.address = address;
        if (req.body.hasOwnProperty("age")) patient.age = age;
        if (req.body.hasOwnProperty("gender")) patient.gender = gender;
        await patient.save();
      }
    }

    res.json({ message: "Appointment and patient updated", appointment });

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
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await Patient.updateMany(
      { visits: appointment._id },
      { $pull: { visits: appointment._id } }
    );

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

    res.json({ message: "Appointment deleted and numbering updated" });

  } catch (err) {
    console.error("Delete appointment error:", err);
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
      .populate("clinicData")
      .sort({ createdAt: -1 });

      console.log("Fetched appointments:", appointments);

    res.json(appointments);
  } catch (err) {
    console.error("Get appointments error:", err);
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
    res.status(500).json({ message: err.message });
  }
};

