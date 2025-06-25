import { Business } from "../models/business.model.js";
import { User } from "../models/user.model.js";

// export const createOrUpdateBusiness = async (req, res) => {
//   try {
//     const { businessName, address, defaultCurrency, gstSlabs } = req.body;
//     const userId = req.user.id;

//     const existing = await Business.findOne({ user: userId });

//     if (existing) {
//       existing.businessName = businessName;
//       existing.address = address;
//       existing.defaultCurrency = defaultCurrency;
//       existing.gstSlabs = gstSlabs;
//       existing.isOnboarded = true;
//       await existing.save();
//       return res.status(200).json({ message: "Business updated", business: existing });
//     }

//     const newBusiness = await Business.create({
//       user: userId,
//       businessName,
//       address,
//       defaultCurrency,
//       gstSlabs,
//       isOnboarded: true,
//     });

//     res.status(201).json({ message: "Business created", business: newBusiness });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// controllers/business.controller.js


export const createOrUpdateBusiness = async (req, res) => {
  try {
    const {
      name,
      phone,
      businessName,
      address,
      defaultCurrency,
      gstSlabs,
    } = req.body;

    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    let business = await Business.findOne({ user: userId });

    if (business) {
      business.businessName = businessName;
      business.address = address;
      business.defaultCurrency = defaultCurrency;
      business.gstSlabs = gstSlabs;
      business.isOnboarded = true;
      await business.save();
    } else {
      business = await Business.create({
        user: userId,
        businessName,
        address,
        defaultCurrency,
        gstSlabs,
        isOnboarded: true,
      });
    }

    res.status(200).json({
      message: "Profile & Business updated",
      user,
      business,
    });
  } catch (err) {
    console.error("Update failed:", err.message);
    res.status(500).json({ message: "Failed to update profile/business" });
  }
};


export const getBusinessByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const business = await Business.findOne({ user: userId });
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
