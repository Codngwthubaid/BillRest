import { Invoice } from "../models/invoice.model.js";
import { Product } from "../models/product.model.js";

// Helper to generate unique invoice numbers
let counter = 1;
const generateInvoiceNumber = () => `INV${String(counter++).padStart(4, "0")}`;

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      products, paymentMethod, currency, customerName, phoneNumber
    } = req.body;

    let subTotal = 0;
    let gstAmount = 0;

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const productTotal = item.price * item.quantity;
      const gst = (productTotal * item.gstRate) / 100;

      subTotal += productTotal;
      gstAmount += gst;
    }

    const totalAmount = subTotal + gstAmount;

    const invoice = await Invoice.create({
      user: userId,
      invoiceNumber: generateInvoiceNumber(),
      products,
      subTotal,
      gstAmount,
      totalAmount,
      paymentMethod,
      currency,
      customerName,
      phoneNumber,
    });

    res.status(201).json({ message: "Invoice created", invoice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Invoices for User
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).populate("products.product");
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user.id }).populate("products.product");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
