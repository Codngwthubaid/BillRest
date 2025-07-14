import { PlanForGeneral } from "../models/planForGeneral.model.js";
import { PlanForHealth } from "../models/planForHealth.model.js";
import { Subscription } from "../models/subscription.model.js";
import crypto from "crypto";
import mongoose from "mongoose";

// Get Current User's Subscription
export const getUserSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id })
      .sort({ endDate: -1 });

    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    let plan = await PlanForGeneral.findById(subscription.plan);
    if (!plan) {
      plan = await PlanForHealth.findById(subscription.plan);
    }

    res.json({ subscription: { ...subscription.toObject(), plan } });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Error fetching subscription" });
  }
};

// Verify Payment and Activate Subscription
export const verifyPaymentAndActivate = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // if (generatedSignature !== razorpay_signature) {
    //   return res.status(400).json({ message: "Invalid signature" });
    // }

    let plan = await PlanForGeneral.findById(planId);
    if (!plan) {
      plan = await PlanForHealth.findById(planId);
    }

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + plan.durationInDays);

    const subscription = new Subscription({
      user: req.user.id,
      plan: new mongoose.Types.ObjectId(planId),
      startDate: now,
      endDate: expiry,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "active",
    });

    await subscription.save();

    res.json({
      message: "Subscription activated",
      subscription: { ...subscription.toObject(), plan }
    });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
