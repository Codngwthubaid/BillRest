import { Patient } from "../models/patient.model.js";

// GET ALL patients for the clinic
export const getPatients = async (req, res) => {
  try {
    const clinicId = req.user.id;

    const patients = await Patient.find({ clinic: clinicId })
      .populate({
        path: 'visits',
        select: 'appointmentNumber status createdAt' // just example fields
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json(patients);
  } catch (err) {
    console.error("Get patients error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE a patient
export const deletePatient = async (req, res) => {
  try {
    const clinicId = req.user.id;
    const patientId = req.params.id;

    const patient = await Patient.findOneAndDelete({
      _id: patientId,
      clinic: clinicId,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found or already deleted." });
    }

    res.json({ message: "Patient deleted successfully." });
  } catch (err) {
    console.error("Delete patient error:", err);
    res.status(500).json({ message: "Failed to delete patient." });
  }
};
