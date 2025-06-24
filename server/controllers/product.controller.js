import { Product } from "../models/product.model.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, price, costPrice, stock, unit, gstRate, barcode } = req.body;

    const product = await Product.create({
      user: userId,
      name,
      description,
      price,
      costPrice,
      stock,
      unit,
      gstRate,
      barcode,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search Product by name or barcode
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, "i");

    const products = await Product.find({
      user: req.user.id,
      $or: [{ name: regex }, { barcode: regex }],
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
