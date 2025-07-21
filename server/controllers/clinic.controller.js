import { Clinic } from "../models/clinic.model.js";
import { User } from "../models/user.model.js";
import { generateBusinessId } from "../utils/idGenerator.js";

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

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    let clinic = await Clinic.findOne({ user: userId });

    if (clinic) {
      if (clinic.protectedPin && protectedPin && clinic.protectedPin !== protectedPin) {
        return res.status(400).json({ message: "Protected PIN is already set and cannot be changed." });
      }

      clinic.businessName = businessName;
      clinic.address = address;
      clinic.isOnboarded = true;

      if (!clinic.protectedPin && protectedPin) {
        clinic.protectedPin = protectedPin;
      }

      await clinic.save();
    } else {
      const clinicId = generateBusinessId();

      clinic = await Clinic.create({
        user: userId,
        businessName,
        clinicId,
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
