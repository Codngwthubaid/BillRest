import { Invoice } from "../models/invoice.model.js";
import { Product } from "../models/product.model.js";

export const syncInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoices = req.body.invoices;

    if (!invoices || !Array.isArray(invoices)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const saved = [];

    for (const data of invoices) {
      const invoice = new Invoice({ ...data, user: userId });
      await invoice.save();
      saved.push(invoice._id);
    }

    res.status(200).json({ message: "Invoices synced", ids: saved });
  } catch (err) {
    console.error("Sync Error:", err);
    res.status(500).json({ message: "Error syncing invoices" });
  }
};

export const getSyncProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ user: userId });
    res.status(200).json(products);
  } catch (err) {
    console.error("Sync Product Error:", err);
    res.status(500).json({ message: "Error getting products" });
  }
};
