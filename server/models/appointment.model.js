import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  appointmentNumber: { type: String, required: true, unique: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "Delayed", "Cancelled", "Completed"],
    default: "Scheduled"
  }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
