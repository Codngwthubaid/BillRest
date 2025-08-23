import { Bed } from "../models/bed.model.js";

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
    const { roomNumber, bedNumber, bedCharges, status, patient } = req.body;

    const updatedBed = await Bed.findByIdAndUpdate(
      id,
      { roomNumber, bedNumber, bedCharges, status, patient },
      { new: true }
    );

    if (!updatedBed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    res.status(200).json({ message: "Bed updated successfully", bed: updatedBed });
  } catch (error) {
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
        const beds = await Bed.find().sort({ createdAt: -1 });
        res.status(200).json(beds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching beds", error: error.message });
    }
};

export const getBedById = async (req, res) => {
    try {
        const { id } = req.params;
        const bed = await Bed.findById(id);

        if (!bed) {
            return res.status(404).json({ message: "Bed not found" });
        }

        res.status(200).json(bed);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bed", error: error.message });
    }
};