import mongoose from "mongoose";

const gstSlabSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., "5%"
  value: { type: Number, required: true }, // e.g., 5
});

const businessSchema = new mongoose.Schema(
  {
    businessId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: { type: String, required: true },
    address: { type: String },
    gstNumber: {
      type: String,
      minlength: 15,
      maxlength: 15,
      trim: true,
    },
    defaultCurrency: {
      type: String,
      enum: ["INR", "USD", "AED"],
      default: "INR",
    },
    gstSlabs: [gstSlabSchema],
    isOnboarded: { type: Boolean, default: false },
    protectedPin: {
      type: String,
      minlength: 4,
      maxlength: 6,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export const Business = mongoose.model("Business", businessSchema);
