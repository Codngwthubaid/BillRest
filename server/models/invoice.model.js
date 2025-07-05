import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      gstRate: { type: Number, required: true },
      discount: { type: Number, default: 0 }
    },
  ],
  subTotal: Number,
  gstAmount: Number,
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  totalAmount: Number,
  currency: { type: String, default: "INR" },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'draft'],
    default: 'draft',
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "UPI", "Card", "Other"],
    default: "Cash",
  },
  customerName: String,
  phoneNumber: String,
  gstNumber: String,     
  customerState: String,
  businessState: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Invoice = mongoose.model("Invoice", invoiceSchema);
