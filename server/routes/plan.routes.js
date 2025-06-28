import express from "express";
import { getAllPlans, getPackagePlans, getIndividualPlans } from "../controllers/plan.controller.js";

const router = express.Router();

router.get("/", getAllPlans);           // /api/plans
router.get("/packages", getPackagePlans); // /api/plans/packages
router.get("/individuals", getIndividualPlans); // /api/plans/individuals

export default router;
