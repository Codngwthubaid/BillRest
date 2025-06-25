import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    getUserSubscription,
    verifyPaymentAndActivate
} from "../controllers/subscription.controller.js";

const router = express.Router();

// 🟢 1. Get Current User's Subscription
router.get("/", verifyToken, getUserSubscription);

// 🟢 2. Payment verification (called after Razorpay payment success)
router.post("/verify-payment", verifyToken, verifyPaymentAndActivate);

export default router;
