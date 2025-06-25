import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },           // e.g., "3 Months"
  durationInDays: { type: Number, required: true }, // 90, 180, 365
  price: { type: Number, required: true },          // in INR
});

export const Plan = mongoose.model("Plan", planSchema);
