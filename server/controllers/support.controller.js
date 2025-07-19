import { SupportTicketForHealth } from "../models/supportTicketForHealth.model.js";
import { SupportTicketForGeneral } from "../models/supportTicketForGeneral.model.js";
import { Counter } from "../models/counter.model.js";

export const createTicketForGeneral = async (req, res) => {
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

    const ticket = await SupportTicketForGeneral.create({
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

export const getMyTicketsForGeneral = async (req, res) => {
  try {
    const tickets = await SupportTicketForGeneral.find({ user: req.user.id })
      .sort({ serialNumber: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const getTicketBySeriaNumberForGeneral = async (req, res) => {
  try {
    const ticket = await SupportTicketForGeneral.findOne({
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

export const updateTicketStatusForGeneral = async (req, res) => {
  try {
    const { status, respondedBy } = req.body;
    const ticket = await SupportTicketForGeneral.findOneAndUpdate(
      { _id: req.params.id },
      { status, respondedBy },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket status updated", ticket });
  } catch (err) {
    console.error("Failed to update ticket:", err.message);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};


// Create a support ticket
export const createTicketForHealth = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const user = req.user;

    // Increment counter for serial number
    const counter = await Counter.findOneAndUpdate(
      { _id: "support_ticket_health" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const serialNumber = counter.sequence_value;

    // Create ticket
    const ticket = await SupportTicketForHealth.create({
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

// Get all tickets for logged-in user
export const getMyHealthTickets = async (req, res) => {
  try {
    const tickets = await SupportTicketForHealth.find({ user: req.user.id })
      .sort({ serialNumber: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Fetch tickets failed:", err.message);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// Get single ticket by serial number
export const getHealthTicketBySerialNumber = async (req, res) => {
  try {
    const ticket = await SupportTicketForHealth.findOne({
      user: req.user.id,
      serialNumber: parseInt(req.params.serialNumber)
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Fetch ticket failed:", err.message);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

// Update status (for admin or support role)
export const updateHealthTicketStatus = async (req, res) => {
  try {
    const { status, respondedBy } = req.body;
    const ticket = await SupportTicketForHealth.findOneAndUpdate(
      { _id: req.params.id },
      { status, respondedBy },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket status updated", ticket });
  } catch (err) {
    console.error("Failed to update ticket:", err.message);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};
