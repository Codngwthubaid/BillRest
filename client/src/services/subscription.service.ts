import { axiosInstance } from "@/lib/axiosInstance";
import type { Subscription, RazorpayOrderResponse } from "@/types/subscription.types";

export const createOrder = async (planId: string): Promise<RazorpayOrderResponse> => {
  const res = await axiosInstance.post("/payment/create-order", { planId });
  return res.data;
};

export const verifyAndActivate = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId: string;
}): Promise<{ message: string; subscription: Subscription }> => {
  const res = await axiosInstance.post("/payment/verify", data);
  return res.data;
};

export const getSubscription = async (): Promise<{ subscription: Subscription }> => {
  const res = await axiosInstance.get("/subscription");
  return res.data;
};
