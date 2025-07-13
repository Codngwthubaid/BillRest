import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the clinic owner
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },

  appointmentNumber: { type: String, required: true, unique: true },

  services: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 }
    }
  ],

  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Canceled'],
    default: 'Pending',
  },

  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "UPI", "Card", "Other"],
    default: "Cash",
  },

  admitted: { type: Boolean, default: false }, // for IPD quick checks
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
