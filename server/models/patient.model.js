import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  visits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  history: [
    {
      appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
      appointmentNumber: { type: String, required: true },
      description: { type: String, default: "" },
      date: { type: Date }, // optional, if needed
      time: { type: String }
    }
  ]
}, { timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);
