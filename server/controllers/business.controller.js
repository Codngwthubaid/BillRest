import { Business } from "../models/business.model.js";
import { User } from "../models/user.model.js";

// export const createOrUpdateBusiness = async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       businessName,
//       address,
//       defaultCurrency,
//       gstSlabs,
//     } = req.body;

//     const userId = req.user.id;

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { name, phone },
//       { new: true, runValidators: true }
//     );

//     if (!user) return res.status(404).json({ message: "User not found" });

//     let business = await Business.findOne({ user: userId });

//     if (business) {
//       business.businessName = businessName;
//       business.address = address;
//       business.defaultCurrency = defaultCurrency;
//       business.gstSlabs = gstSlabs;
//       business.isOnboarded = true;
//       await business.save();
//     } else {
//       business = await Business.create({
//         user: userId,
//         businessName,
//         address,
//         defaultCurrency,
//         gstSlabs,
//         isOnboarded: true,
//       });
//     }

//     res.status(200).json({
//       message: "Profile & Business updated",
//       user,
//       business,
//     });
//   } catch (err) {
//     console.error("Update failed:", err.message);
//     res.status(500).json({ message: "Failed to update profile/business" });
//   }
// };

export const createOrUpdateBusiness = async (req, res) => {
  try {
    const {
      name,
      phone,
      businessName,
      address,
      defaultCurrency,
      gstSlabs,
      protectedPin,
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
      if (business.protectedPin && protectedPin && business.protectedPin !== protectedPin) {
        return res.status(400).json({ message: "Protected PIN is already set and cannot be changed." });
      }

      business.businessName = businessName;
      business.address = address;
      business.defaultCurrency = defaultCurrency;
      business.gstSlabs = gstSlabs;
      business.isOnboarded = true;

      if (!business.protectedPin && protectedPin) {
        business.protectedPin = protectedPin;
      }

      await business.save();
    } else {
      business = await Business.create({
        user: userId,
        businessName,
        address,
        defaultCurrency,
        gstSlabs,
        isOnboarded: true,
        protectedPin,
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
