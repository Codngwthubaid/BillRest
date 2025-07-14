import { PlanForGeneral } from "../models/planForGeneral.model.js";
import { PlanForHealth } from "../models/planForHealth.model.js";

// GET /api/plans/general
export const getAllGeneralPlans = async (req, res) => {
  try {
    const plans = await PlanForGeneral.find();
    res.json({ plans });
  } catch (err) {
    console.error("Error fetching general plans:", err);
    res.status(500).json({ message: "Error fetching general plans" });
  }
};

// GET /api/plans/health
export const getAllHealthPlans = async (req, res) => {
  try {
    const plans = await PlanForHealth.find();
    res.json({ plans });
  } catch (err) {
    console.error("Error fetching health plans:", err);
    res.status(500).json({ message: "Error fetching health plans" });
  }
};

// GET /api/plans/general/packages
export const getGeneralPackagePlans = async (req, res) => {
  try {
    const packages = await PlanForGeneral.find({ type: "package" });
    res.json({ packages });
  } catch (err) {
    console.error("Error fetching general package plans:", err);
    res.status(500).json({ message: "Error fetching general package plans" });
  }
};

// GET /api/plans/health/packages
export const getHealthPackagePlans = async (req, res) => {
  try {
    const packages = await PlanForHealth.find({ type: "package" });
    res.json({ packages });
  } catch (err) {
    console.error("Error fetching health package plans:", err);
    res.status(500).json({ message: "Error fetching health package plans" });
  }
};

// GET /api/plans/general/individuals
export const getGeneralIndividualPlans = async (req, res) => {
  try {
    const individuals = await PlanForGeneral.find({ type: "individual" });
    res.json({ individuals });
  } catch (err) {
    console.error("Error fetching general individual plans:", err);
    res.status(500).json({ message: "Error fetching general individual plans" });
  }
};

// GET /api/plans/health/individuals
export const getHealthIndividualPlans = async (req, res) => {
  try {
    const individuals = await PlanForHealth.find({ type: "individual" });
    res.json({ individuals });
  } catch (err) {
    console.error("Error fetching health individual plans:", err);
    res.status(500).json({ message: "Error fetching health individual plans" });
  }
};
