import { razorpay } from "../config/razorpay.js";
import { PlanForGeneral } from "../models/planForGeneral.model.js";
import { PlanForHealth } from "../models/planForHealth.model.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    let plan = await PlanForGeneral.findById(planId);
    if (!plan) {
      plan = await PlanForHealth.findById(planId);
    }

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const options = {
      amount: Math.round(Number(plan.totalPrice) * 100),
      currency: "INR",
      receipt: `receipt_order_${Math.random()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ orderId: order.id, amount: plan.totalPrice });
  } catch (err) {
    console.error("Order creation error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};
