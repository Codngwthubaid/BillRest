import { Bed } from "../models/bed.model.js";

// ✅ Add a new bed
export const addBed = async (req, res) => {
  try {
    const { clinic, roomNumber, bedNumber, bedCharges } = req.body;

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

// ✅ Update a bed
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

// ✅ Delete a bed
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
