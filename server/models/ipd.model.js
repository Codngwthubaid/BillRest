import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalCharges: {
    type: Number,
    default: 0
  }
});

const billingSchema = new mongoose.Schema({
  roomCharges: { type: Number, default: 0 },
  serviceCharges: { type: Number, default: 0 },
  medicineCharges: { type: Number, default: 0 },
  otherCharges: [
    {
      itemName: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],
  total: { type: Number, default: 0 }
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
      ref: "Appointment"
    },
    ipdNumber: {
      type: String,
      required: true,
      unique: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: Date,
    treatments: [treatmentSchema],
    billing: billingSchema,
    status: {
      type: String,
      enum: ["Admitted", "Discharged"],
      default: "Admitted",
    },
  },
  { timestamps: true }
);

export const IPD = mongoose.model("IPD", ipdSchema);
