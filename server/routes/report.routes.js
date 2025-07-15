import express from "express";
import { getSalesReportForGeneral, getSalesReportForHealth } from "../controllers/report.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.get("/sales/general", verifyToken, (req, res, next) => {
  if (req.user.role === "customer") {
    return checkSubscription(req, res, next);
  }
  next();
}, getSalesReportForGeneral);


router.get("/sales/health", verifyToken, (req, res, next) => {
  if (req.user.role === "clinic") {
    return checkSubscription(req, res, next);
  }
  next();
}, getSalesReportForHealth)

export default router;
