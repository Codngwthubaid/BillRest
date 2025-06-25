import { User } from "../models/user.model";

export const updateCustomerFeatures = async (req, res) => {
  const { customerId } = req.params;
  const { features } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      customerId,
      { features },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Features updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating features" });
  }
};
