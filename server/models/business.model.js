import mongoose from "mongoose";

const gstSlabSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., "5%"
  value: { type: Number, required: true }, // e.g., 5
});

const businessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one business per customer
    },
    businessName: { type: String, required: true },
    address: { type: String },
    defaultCurrency: {
      type: String,
      enum: ["INR", "USD", "AED"],
      default: "INR",
    },
    gstSlabs: [gstSlabSchema],
    isOnboarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Business = mongoose.model("Business", businessSchema);
