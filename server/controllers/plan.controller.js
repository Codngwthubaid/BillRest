import { Plan } from "../models/plan.model.js";

// GET /api/plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json({ plans });
  } catch (err) {
    console.error("Error fetching all plans:", err);
    res.status(500).json({ message: "Error fetching all plans" });
  }
};

// GET /api/plans/packages
export const getPackagePlans = async (req, res) => {
  try {
    const packages = await Plan.find({ type: "package" });
    res.json({ packages });
  } catch (err) {
    console.error("Error fetching package plans:", err);
    res.status(500).json({ message: "Error fetching package plans" });
  }
};

// GET /api/plans/individuals
export const getIndividualPlans = async (req, res) => {
  try {
    const individuals = await Plan.find({ type: "individual" });
    res.json({ individuals });
  } catch (err) {
    console.error("Error fetching individual plans:", err);
    res.status(500).json({ message: "Error fetching individual plans" });
  }
};
