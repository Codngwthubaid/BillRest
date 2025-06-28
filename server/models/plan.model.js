import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },            // e.g., "3 Months", "WA Add On"
  type: { type: String, enum: ["package", "individual"], required: true },
  durationInDays: { type: Number },                  // Only for packages
  pricePerMonth: { type: Number },                   // e.g., 1199
  totalPrice: { type: Number, required: true },      // e.g., 3597
  includedInvoices: { type: Number },                // e.g., 300 or 700
  description: { type: String },                     // e.g., "WhatsApp + Call support"
});

export const Plan = mongoose.model("Plan", planSchema);
