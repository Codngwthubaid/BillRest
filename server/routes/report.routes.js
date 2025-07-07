import express from "express";
import { getSalesReport } from "../controllers/report.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.get("/sales", verifyToken, (req, res, next) => {
  if (req.user.role === "customer") {
    return checkSubscription(req, res, next);
  }
  next();
}, getSalesReport);

export default router;
