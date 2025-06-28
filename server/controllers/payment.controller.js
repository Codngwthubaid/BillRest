import { razorpay } from "../config/razorpay.js";
import { Plan } from "../models/plan.model.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    console.log("Plan fetched:", plan);

    const options = {
      amount: Math.round(Number(plan.totalPrice) * 100),
      currency: "INR",
      receipt: `receipt_order_${Math.random()}`,
    };

    console.log("Creating order with options:", options);

    const order = await razorpay.orders.create(options);

    console.log("Order created:", order);
    res.json({ orderId: order.id, amount: plan.totalPrice });
  } catch (err) {
    console.error("Order creation error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};
