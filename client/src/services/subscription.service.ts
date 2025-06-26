import { axiosInstance } from "@/lib/axiosInstance";
import type { Plan, Subscription, RazorpayOrderResponse } from "@/types/subscription.types";

// ✅ Create Razorpay Order
export const createOrder = async (planId: string): Promise<RazorpayOrderResponse> => {
  const res = await axiosInstance.post("/payment/create-order", { planId });
  return res.data;
};

// ✅ Verify Payment & Activate Subscription
export const verifyAndActivate = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId: string;
}): Promise<{ message: string; subscription: Subscription }> => {
  const res = await axiosInstance.post("/payment/verify", data);
  return res.data;
};

// ✅ Get Active Subscription of Logged-in User
export const getSubscription = async (): Promise<{ subscription: Subscription }> => {
  const res = await axiosInstance.get("/subscription");
  return res.data;
};

export const getAllPlans = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans");
  return res.data.plans; // your backend sends { plans: [...] }
};