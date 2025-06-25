import { SupportTicket } from "../models/supportTicket.model.js";
import { Product } from "../models/product.model.js";
import { Invoice } from "../models/invoice.model.js";

export const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const user = req.user;

    const ticket = await SupportTicket.create({
      user: user.id,
      subject,
      message,
      status: "pending",
    });

    res.status(201).json({ message: "Support ticket submitted", ticket });
  } catch (err) {
    console.error("Ticket creation failed:", err.message);
    res.status(500).json({ message: "Failed to submit ticket" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("user", "name email");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};
