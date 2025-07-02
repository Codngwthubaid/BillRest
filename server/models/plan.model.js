import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['package', 'individual'], required: true },
  durationInDays: Number,
  pricePerMonth: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  includedInvoices: Number,
  description: { type: [String], required: true },
});

export const Plan = mongoose.model("Plan", planSchema);
