import express from "express";
import { getAllPlans } from "../controllers/plan.controller.js";

const router = express.Router();

router.get("/", getAllPlans);

export default router;
