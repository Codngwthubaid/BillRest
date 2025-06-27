import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      default: "pcs",
    },
    gstRate: {
      type: Number,
      required: true,
    },
    barcode: {
      type: String,
      unique: false, // uniqueness handled per user
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
