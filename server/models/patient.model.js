import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: String,
  age: Number,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },

  visits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }]
}, { timestamps: true });

patientSchema.index({ phoneNumber: 1, clinic: 1 }, { unique: true });

export const Patient = mongoose.model("Patient", patientSchema);
