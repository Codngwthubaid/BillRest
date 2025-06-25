import { razorpay } from "../config/razorpay.js";
import { Plan } from "../models/plan.model.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const options = {
      amount: plan.price * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Math.random()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: plan.price });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};
