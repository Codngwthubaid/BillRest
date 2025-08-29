import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalCharges: {
    type: Number,
    default: 0,
  },
});

const billingSchema = new mongoose.Schema({
  bedCharges: { type: Number, default: 0 }, 
  serviceCharges: { type: Number, default: 0 },
  grantsOrDiscounts: { type: Number, default: 0 },
  totalBeforeDiscount: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 },
});

const ipdSchema = new mongoose.Schema(
  {
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    ipdNumber: {
      type: String,
      unique: true,
      required: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: Date,
    bed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
    },
    treatments: [treatmentSchema],
    billing: billingSchema,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    note: {
      type: String, // ✅ added note field
      default: "",
    },
  },
  { timestamps: true }
);

export const IPD = mongoose.model("IPD", ipdSchema);
