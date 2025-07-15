import { Clinic } from "../models/clinic.model.js";
import { User } from "../models/user.model.js";

// 🔥 Create or Update Clinic Profile
export const createOrUpdateClinic = async (req, res) => {
  try {
    const {
      name,
      phone,
      businessName,
      address,
      protectedPin
    } = req.body;

    const userId = req.user.id;

    // Update User basic profile
    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if clinic exists
    let clinic = await Clinic.findOne({ user: userId });

    if (clinic) {
      // Handle protectedPin lock
      if (clinic.protectedPin && protectedPin && clinic.protectedPin !== protectedPin) {
        return res.status(400).json({ message: "Protected PIN is already set and cannot be changed." });
      }

      // Update details
      clinic.businessName = businessName;
      clinic.address = address;
      clinic.isOnboarded = true;

      if (!clinic.protectedPin && protectedPin) {
        clinic.protectedPin = protectedPin;
      }

      await clinic.save();
    } else {
      // Create new clinic
      clinic = await Clinic.create({
        user: userId,
        businessName,
        address,
        isOnboarded: true,
        protectedPin
      });
    }

    res.status(200).json({
      message: "Profile & Clinic updated",
      user,
      clinic,
    });

  } catch (err) {
    console.error("Clinic update failed:", err.message);
    res.status(500).json({ message: "Failed to update profile/clinic" });
  }
};

// 🔥 Get Clinic by User
export const getClinicByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const clinic = await Clinic.findOne({ user: userId });
    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    res.status(200).json(clinic);
  } catch (err) {
    console.error("Get clinic error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
