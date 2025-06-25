import { Plan } from "../models/plan.model.js";

export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json({ plans });
  } catch (err) {
    console.error("Error fetching plans:", err);
    res.status(500).json({ message: "Error fetching plans" });
  }
};
