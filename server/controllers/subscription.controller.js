import { Plan } from "../models/plan.model.js";
import { Subscription } from "../models/subscription.model.js";
import crypto from "crypto";

// 📌 1. Get Current User's Subscription
export const getUserSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id })
      .sort({ endDate: -1 })
      .populate("plan");

    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    res.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Error fetching subscription" });
  }
};

// 📌 2. Verify Payment and Activate Subscription
// export const verifyPaymentAndActivate = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       planId,
//     } = req.body;

//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     const plan = await Plan.findById(planId);
//     const now = new Date();
//     const expiry = new Date(now);
//     expiry.setDate(expiry.getDate() + plan.durationInDays);

//     const subscription = new Subscription({
//       user: req.user.id,
//       plan: planId,
//       startDate: now,
//       endDate: expiry,
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       status: "active",
//     });

//     await subscription.save();
//     res.json({ message: "Subscription activated", subscription });
//   } catch (err) {
//     console.error("Payment verification failed:", err);
//     res.status(500).json({ message: "Error verifying payment" });
//   }
// };

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

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + plan.durationInDays);

    const subscription = new Subscription({
      user: req.user.id,
      plan: mongoose.Types.ObjectId(planId), // ensure ObjectId
      startDate: now,
      endDate: expiry,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "active",
    });

    await subscription.save();

    // Populate immediately if you want
    await subscription.populate("plan");

    res.json({ message: "Subscription activated", subscription });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
