import { Appointment } from "../models/appointment.model.js";
import { Patient } from "../models/patient.model.js";
import { Counter } from "../models/counter.model.js";
import crypto from "crypto"

const generateAppointmentId = () => {
  const randomString = crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
  return `APT-${randomString}`;
};

// export const createAppointment = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const {
//       name,
//       phoneNumber,
//       address,
//       age,
//       gender,
//       description,
//       status,
//       admitted,
//       appointmentNumber
//     } = req.body;

//     if (!name || !phoneNumber) {
//       return res.status(400).json({ message: "Patient name and phone number are required." });
//     }

//     // 1. Find or create patient
//     let patient = await Patient.findOne({ clinic: userId, phoneNumber });
//     if (!patient) {
//       patient = await Patient.create({
//         clinic: userId,
//         name,
//         phoneNumber,
//         address,
//         age,
//         gender,
//         visits: [],
//         history: [] // new field for storing appointment details
//       });
//     } else {
//       // Update patient details if changed
//       patient.name = name;
//       patient.address = address;
//       patient.age = age;
//       patient.gender = gender;
//       await patient.save();
//     }

//     // 2. Generate appointment number
//     let finalAppointmentNumber = appointmentNumber || await generateAppointmentId();

//     if (appointmentNumber) {
//       const match = appointmentNumber.match(/APT(\d+)/);
//       if (match) {
//         const num = parseInt(match[1], 10);
//         const counterDoc = await Counter.findOne({ _id: "appointmentNumber" });
//         const currentCounter = counterDoc ? counterDoc.sequence_value : 0;
//         if (num >= currentCounter) {
//           await Counter.findOneAndUpdate(
//             { _id: "appointmentNumber" },
//             { sequence_value: num },
//             { upsert: true }
//           );
//         }
//       }
//     }

//     // 3. Create appointment
//     const appointment = await Appointment.create({
//       clinic: userId,
//       appointmentNumber: finalAppointmentNumber,
//       patient: patient._id,
//       description,
//       status,
//       admitted
//     });

//     // 4. Add appointment reference and details to patient
//     patient.visits.push(appointment._id);

//     patient.history.push({
//       appointmentId: appointment._id,
//       appointmentNumber: finalAppointmentNumber,
//       description,
//       status,
//       admitted,
//       createdAt: new Date()
//     });

//     await patient.save();

//     res.status(201).json({
//       message: "Appointment created successfully",
//       appointment
//     });

//   } catch (err) {
//     console.error("Create appointment error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const updateAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     const { appointmentNumber, name, phoneNumber, address, age, gender } = req.body;

//     if (!id) {
//       return res.status(400).json({ message: "Invalid appointment ID" });
//     }

//     if (appointmentNumber) {
//       const existingNumber = await Appointment.findOne({
//         appointmentNumber,
//         _id: { $ne: id }
//       });

//       if (existingNumber) {
//         return res.status(400).json({ message: `Appointment number ${appointmentNumber} already exists.` });
//       }

//       const match = appointmentNumber.match(/APT(\d+)/);
//       if (match) {
//         const num = parseInt(match[1], 10);
//         const counterDoc = await Counter.findOne({ _id: "appointmentNumber" });
//         const currentCounter = counterDoc ? counterDoc.sequence_value : 0;
//         if (num >= currentCounter) {
//           await Counter.findOneAndUpdate(
//             { _id: "appointmentNumber" },
//             { sequence_value: num },
//             { upsert: true }
//           );
//         }
//       }
//     }

//     const appointment = await Appointment.findOneAndUpdate(
//       { _id: id, clinic: userId },
//       req.body,
//       { new: true }
//     );

//     if (!appointment) return res.status(404).json({ message: "Appointment not found" });

//     if (name || phoneNumber || address || age || gender) {
//       const patient = await Patient.findOne({ _id: appointment.patient, clinic: userId });
//       if (patient) {
//         if (req.body.hasOwnProperty("name")) patient.name = name;
//         if (req.body.hasOwnProperty("phoneNumber")) patient.phoneNumber = phoneNumber;
//         if (req.body.hasOwnProperty("address")) patient.address = address;
//         if (req.body.hasOwnProperty("age")) patient.age = age;
//         if (req.body.hasOwnProperty("gender")) patient.gender = gender;
//         await patient.save();
//       }
//     }

//     res.json({ message: "Appointment and patient updated", appointment });

//   } catch (err) {
//     console.error("Update appointment error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const deleteAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     // 1. Find and delete appointment
//     const appointment = await Appointment.findOneAndDelete({ _id: id, clinic: userId });
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     // 2. Remove appointment reference from patient
//     const patient = await Patient.findOneAndUpdate(
//       { visits: appointment._id },
//       { $pull: { visits: appointment._id } },
//       { new: true }
//     );

//     // 3. Recalculate appointment numbers for this clinic
//     const appointments = await Appointment.find({ clinic: userId }).sort({ createdAt: 1 });

//     let counter = 1;
//     for (const appt of appointments) {
//       appt.appointmentNumber = `APT${String(counter).padStart(4, "0")}`;
//       await appt.save();
//       counter++;
//     }

//     await Counter.findOneAndUpdate(
//       { _id: "appointmentNumber" },
//       { sequence_value: counter - 1 },
//       { upsert: true }
//     );

//     res.json({ message: "Appointment and related patient deleted successfully (if no visits left)" });

//   } catch (err) {
//     console.error("Delete appointment error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getAppointments = async (req, res) => {
//   try {
//     const { date, patient } = req.query;
//     const query = { clinic: req.user.id };

//     if (date) query.date = date;
//     if (patient) query.patient = patient;

//     const appointments = await Appointment.find(query)
//       .populate("patient")
//       .sort({ createdAt: -1 });

//       res.json(appointments);
//   } catch (err) {
//     console.error("Get appointments error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getAppointmentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const appointment = await Appointment.findOne({ _id: id, clinic: req.user.id })
//       .populate("patient");

//     if (!appointment) return res.status(404).json({ message: "Appointment not found" });

//     res.json(appointment);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientId, name, phoneNumber, age, gender, description, status, admitted, date, time } = req.body;

    let patient;

    // 1. If patientId exists, fetch patient
    if (patientId) {
      patient = await Patient.findOne({ _id: patientId, clinic: userId });
      if (!patient) return res.status(404).json({ message: "Patient not found" });
    } else {
      // 2. Create new patient
      if (!name || !phoneNumber) {
        return res.status(400).json({ message: "Patient name and phone number are required." });
      }

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

    // 3. Generate appointment number
    const appointmentNumber = generateAppointmentId();

    // 4. Create appointment
    const appointment = await Appointment.create({
      clinic: userId,
      patient: patient._id,
      appointmentNumber,
      description: description || "",
      status: status || "Pending",
      admitted: admitted || false,
      date,
      time
    });

    // 5. Add appointment reference to patient
    patient.visits.push(appointment._id);
    patient.history.push({
      appointmentId: appointment._id,
      appointmentNumber,
      description: description || "",
      status: status || "Pending",
      admitted: admitted || false,
      date,
      time,
      createdAt: new Date()
    });

    await patient.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment
    });

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
