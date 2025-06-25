import express from "express";
import { getSalesReport } from "../controllers/report.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.get("/sales", verifyToken, checkSubscription, getSalesReport);

export default router;
