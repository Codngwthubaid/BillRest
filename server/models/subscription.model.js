import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String },
  status: { type: String, enum: ["active", "expired"], default: "active" },
}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
