import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  state: { type: String },
  gstNumber: { type: String },   
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }]
}, { timestamps: true });


customerSchema.index({ phoneNumber: 1, user: 1 }, { unique: true }); // to avoid duplicate customers for same user

export const Customer = mongoose.model("Customer", customerSchema);
