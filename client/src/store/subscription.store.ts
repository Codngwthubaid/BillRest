import { create } from "zustand";
import type {
  Plan,
  Subscription,
  RazorpayOrderResponse,
} from "@/types/subscription.types";
import {
  createOrder as apiCreateOrder,
  verifyAndActivate,
  getSubscription,
  getAllPlans,
} from "@/services/subscription.service";

interface SubscriptionState {
  currentSubscription: Subscription | null;
  availablePlans: Plan[];

  setSubscription: (subscription: Subscription | null) => void;
  setPlans: (plans: Plan[]) => void;

  fetchUserSubscription: () => Promise<void>;
  fetchAllPlans: () => Promise<void>; // ✅ NEW
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
  availablePlans: [],

  setSubscription: (subscription) => set({ currentSubscription: subscription }),
  setPlans: (plans) => set({ availablePlans: plans }),

  fetchUserSubscription: async () => {
    try {
      const { subscription } = await getSubscription();
      set({ currentSubscription: subscription });
    } catch {
      set({ currentSubscription: null });
    }
  },

  // ✅ NEW: Fetch All Plans
  fetchAllPlans: async () => {
    try {
      const plans = await getAllPlans();
      set({ availablePlans: plans });
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      set({ availablePlans: [] });
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
