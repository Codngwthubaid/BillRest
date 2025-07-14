import { Service } from "../models/service.model.js";

// Create Service
export const createService = async (req, res) => {
  try {
    const clinicId = req.user.id;
    const { name, description, price, category, unit, gstRate } = req.body;

    const service = await Service.create({
      clinic: clinicId,
      name,
      description,
      price,
      category,
      unit,
      gstRate,
    });

    res.status(201).json({ message: "Service created", service });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ clinic: req.user.id });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Service
export const updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, clinic: req.user.id },
      req.body,
      { new: true }
    );

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json({ message: "Service updated", service });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, clinic: req.user.id });

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search Service by name
export const searchServices = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, "i");

    const services = await Service.find({
      clinic: req.user.id,
      name: regex
    });

    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
