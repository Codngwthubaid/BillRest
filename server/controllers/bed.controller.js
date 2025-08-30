import { Bed } from "../models/bed.model.js";
import { Patient } from "../models/patient.model.js";

export const addBed = async (req, res) => {
  try {
    const clinic = req.user.id;
    const { roomNumber, bedNumber, bedCharges } = req.body;

    if (!clinic || !roomNumber || !bedNumber || !bedCharges) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBed = new Bed({
      clinic,
      roomNumber,
      bedNumber,
      bedCharges,
    });

    await newBed.save();

    res.status(201).json({ message: "Bed added successfully", bed: newBed });
  } catch (error) {
    res.status(500).json({ message: "Error adding bed", error: error.message });
  }
};

export const updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomNumber, bedNumber, bedCharges, patient, services, medicines } = req.body;

    const updateData = {};
    if (roomNumber) updateData.roomNumber = roomNumber;
    if (bedNumber) updateData.bedNumber = bedNumber;
    if (bedCharges) updateData.bedCharges = bedCharges;

    // ✅ Assign patient and set status
    if (patient) {
      updateData.patient = patient;
      updateData.status = "Occupied";
    }

    // ✅ Directly save services from frontend (includes details)
    if (services && Array.isArray(services)) {
      updateData.services = services.map(s => ({
        service: s.service,
        name: s.name,
        category: s.category,
        unit: s.unit,
        gstRate: s.gstRate,
        price: s.price,
        quantity: s.quantity || 1
      }));
    }

    if (medicines) updateData.medicines = medicines;

    const updatedBed = await Bed.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate("patient");

    res.status(200).json({ message: "Bed updated successfully", bed: updatedBed });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating bed", error: error.message });
  }
};

export const deleteBed = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBed = await Bed.findByIdAndDelete(id);

    if (!deletedBed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    res.status(200).json({ message: "Bed deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bed", error: error.message });
  }
};

export const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find().populate("patient").sort({ createdAt: -1 });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beds", error: error.message });
  }
};

export const getBedById = async (req, res) => {
  try {
    const { id } = req.params;
    const bed = await Bed.findById(id).populate("patient");

    if (!bed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    res.status(200).json(bed);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bed", error: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ clinic: req.user.id });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
};
