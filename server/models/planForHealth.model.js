import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['package', 'individual'], required: true },
  role: { type: String },
  durationInDays: Number,
  pricePerMonth: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  includedInvoices: Number,
  description: { type: [String], required: true },
});

export const PlanForHealth = mongoose.model("PlanForHealth", planSchema);
