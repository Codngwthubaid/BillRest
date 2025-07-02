import { SupportTicket } from "../models/supportTicket.model.js";
import { Product } from "../models/product.model.js";
import { Invoice } from "../models/invoice.model.js";
import { Counter } from "../models/counter.model.js";

export const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const user = req.user;

    // Use your existing counter schema
    const counter = await Counter.findOneAndUpdate(
      { _id: "support_ticket" },   // because you use _id
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const serialNumber = counter.sequence_value;

    const ticket = await SupportTicket.create({
      serialNumber,
      user: user.id,
      subject,
      message,
      status: "pending",
    });

    res.status(201).json({
      message: "Support ticket submitted",
      ticket
    });
  } catch (err) {
    console.error("Ticket creation failed:", err.message);
    res.status(500).json({ message: "Failed to submit ticket" });
  }
};


export const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id })
      .sort({ serialNumber: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

export const getTicketBySeriaNumber = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      user: req.user.id,
      serialNumber: parseInt(req.params.serialNumber)
    });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
}