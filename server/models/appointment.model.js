import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },

  appointmentNumber: { type: String, required: true, unique: true },

  description: { type: String }, // patient problem / reason

  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Canceled'],
    default: 'Pending',
  },

  admitted: { type: Boolean, default: false },
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
