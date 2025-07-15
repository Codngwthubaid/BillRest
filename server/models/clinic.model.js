import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: { type: String, required: true },
    address: { type: String },
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

export const Clinic = mongoose.model("Clinic", clinicSchema);
