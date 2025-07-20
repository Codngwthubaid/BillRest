import { create } from "zustand";
import {
  getBusiness,
  getAllBusinesses,
  updateBusinessFeatures
} from "@/services/business.service";
import type { Business } from "@/types/business.types";
import { useAuthStore } from "./auth.store";

interface BusinessState {
  business: Business | null;
  businesses: Business[];
  loading: boolean;
  error: string | null;
  isPinVerified: boolean;

  verifyPin: () => void;
  resetPinVerification: () => void;
  fetchBusiness: () => Promise<void>;
  fetchAllBusinesses: () => Promise<void>;
  clearBusiness: () => void;
  updateBusinessFeaturesInStore: (id: string, features: any) => Promise<void>;
}

export const useBusinessStore = create<BusinessState>((set, get) => {
  const user = useAuthStore.getState().user;

  const loadBusiness = async () => {
    set({ loading: true, error: null });
    try {
      const data = await getBusiness();
      set({ business: data, loading: false });
    } catch (err: any) {
      console.error("Failed to load business:", err);
      if (err?.response?.status === 404) {
        set({ business: null, loading: false, error: null });
      } else {
        set({ error: err?.message || "Failed to load", loading: false });
      }
    }
  };

  if (user?.role === "customer") {
    loadBusiness(); // only load for customer
  }


  return {
    business: null,
    businesses: [],
    loading: true,
    error: null,
    isPinVerified: false,

    verifyPin: () => set({ isPinVerified: true }),
    resetPinVerification: () => set({ isPinVerified: false }),
    fetchBusiness: loadBusiness,
    clearBusiness: () => set({ business: null }),

    fetchAllBusinesses: async () => {
      set({ loading: true, error: null });
      try {
        const data = await getAllBusinesses();
        set({ businesses: data.businesses, loading: false });
      } catch (err: any) {
        console.error("Failed to load all businesses:", err);
        set({ error: err?.message || "Failed to load all businesses", loading: false });
      }
    },

    updateBusinessFeaturesInStore: async (id, features) => {
      set({ loading: true, error: null });
      try {
        const data = await updateBusinessFeatures(id, features);;
        const updatedBusinesses = get().businesses.map((b) =>
          b.user._id === id
            ? { ...b, user: { ...b.user, features: data.features } }
            : b
        );

        set({ businesses: updatedBusinesses, loading: false });
      } catch (err: any) {
        console.error("Failed to update business features:", err);
        set({ error: err?.message || "Failed to update business features", loading: false });
      }
    }
  };
});
