import express from "express";
import { createRazorpayOrder } from "../controllers/payment.controller.js";
import { verifyPaymentAndActivate } from "../controllers/subscription.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-order", verifyToken, createRazorpayOrder);
router.post("/verify", verifyToken, verifyPaymentAndActivate);

export default router;
