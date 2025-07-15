import mongoose from "mongoose";

const supportTicketSchemaForHealth = new mongoose.Schema(
  {
    serialNumber: { type: Number, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "resolved", "escalated"],
      default: "pending",
    },
    respondedBy: { type: String },
  },
  { timestamps: true }
);


export const SupportTicketForHealth = mongoose.model("SupportTicketForHealth", supportTicketSchemaForHealth);
