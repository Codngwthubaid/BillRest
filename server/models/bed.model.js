import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    bedNumber: {
      type: String,
      required: true,
    },
    bedCharges: {
      type: Number,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null, 
    },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export const Bed = mongoose.model("Bed", bedSchema);
