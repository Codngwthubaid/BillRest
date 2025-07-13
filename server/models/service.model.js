import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    clinic: { // renamed for clarity, same as `user`
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: String, // e.g., Consultation, Test, Injection
    unit: {
      type: String,
      default: "service",
    },
    gstRate: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
