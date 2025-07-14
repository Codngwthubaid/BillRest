import express from "express";
import {
  getAllGeneralPlans,
  getAllHealthPlans,
  getGeneralPackagePlans,
  getHealthPackagePlans,
  getGeneralIndividualPlans,
  getHealthIndividualPlans
} from "../controllers/plan.controller.js";

const router = express.Router();

// General Plans
router.get("/general", getAllGeneralPlans);                     // /api/plans/general
router.get("/general/packages", getGeneralPackagePlans);        // /api/plans/general/packages
router.get("/general/individuals", getGeneralIndividualPlans);  // /api/plans/general/individuals

// Health Plans
router.get("/health", getAllHealthPlans);                       // /api/plans/health
router.get("/health/packages", getHealthPackagePlans);          // /api/plans/health/packages
router.get("/health/individuals", getHealthIndividualPlans);    // /api/plans/health/individuals

export default router;
