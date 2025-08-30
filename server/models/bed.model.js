import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
  roomNumber: String,
  bedNumber: String,
  bedCharges: Number,
  status: {
    type: String,
    enum: ["Available", "Occupied"],
    default: "Available"
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  },
  services: [
    {
      service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
      name: String,
      category: String,
      unit: String,
      gstRate: Number,
      price: Number,
      quantity: Number
    }
  ],
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
      price: Number
    }
  ]
}, { timestamps: true });


export const Bed = mongoose.model("Bed", bedSchema);
