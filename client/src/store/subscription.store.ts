import { create } from "zustand";
import type { Subscription, RazorpayOrderResponse } from "@/types/subscription.types";
import {
  createOrder as apiCreateOrder,
  verifyAndActivate,
  getSubscription,
} from "@/services/subscription.service";

interface SubscriptionState {
  currentSubscription: Subscription | null;

  setSubscription: (subscription: Subscription | null) => void;
  fetchUserSubscription: () => Promise<void>;
  createOrder: (planId: string) => Promise<RazorpayOrderResponse>;
  handlePaymentVerification: (
    details: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    planId: string
  ) => Promise<Subscription | null>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  currentSubscription: null,

  setSubscription: (subscription) => set({ currentSubscription: subscription }),

  fetchUserSubscription: async () => {
    try {
      const { subscription } = await getSubscription();
      set({ currentSubscription: subscription });
    } catch {
      set({ currentSubscription: null });
    }
  },

  createOrder: async (planId) => {
    try {
      const response = await apiCreateOrder(planId);
      return response;
    } catch (err) {
      console.error("Failed to create Razorpay order:", err);
      throw err;
    }
  },

  handlePaymentVerification: async (
    { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    planId
  ) => {
    try {
      const { subscription } = await verifyAndActivate({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
      });

      set({ currentSubscription: subscription });
      return subscription;
    } catch (err) {
      console.error("Payment verification failed:", err);
      return null;
    }
  },
}));
