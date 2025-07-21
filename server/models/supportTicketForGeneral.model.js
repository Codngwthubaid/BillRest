import mongoose from "mongoose";

const supportTicketSchemaForGeneral = new mongoose.Schema(
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
    messages: [
      {
        senderRole: { type: String, enum: ['support'], required: true },
        message: { type: String, required: true },
      }
    ]
  },
  { timestamps: true }
);


export const SupportTicketForGeneral = mongoose.model("SupportTicketForGeneral", supportTicketSchemaForGeneral);
