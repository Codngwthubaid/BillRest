import { create } from "zustand";
import { getBusiness, getAllBusinesses } from "@/services/business.service";
import type { Business } from "@/types/business.types";

interface BusinessState {
  business: Business | null;
  businesses: Business[]; // ✅ NEW
  loading: boolean;
  error: string | null;
  isPinVerified: boolean;

  verifyPin: () => void;
  resetPinVerification: () => void;
  fetchBusiness: () => Promise<void>;
  fetchAllBusinesses: () => Promise<void>; // ✅ NEW
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => {
  // Load business for current user immediately
  const loadBusiness = async () => {
    set({ loading: true, error: null });
    try {
      const data = await getBusiness();
      console.log("Loaded business:", data);
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

  // Load on store initialization
  loadBusiness();

  return {
    business: null,
    businesses: [], // ✅ NEW
    loading: true,
    error: null,
    isPinVerified: false,

    verifyPin: () => set({ isPinVerified: true }),
    resetPinVerification: () => set({ isPinVerified: false }),
    fetchBusiness: loadBusiness,
    clearBusiness: () => set({ business: null }),

    // ✅ Fetch all businesses for admin
    fetchAllBusinesses: async () => {
      set({ loading: true, error: null });
      try {
        const data = await getAllBusinesses();
        console.log("Loaded all businesses:", data);
        set({ businesses: data.businesses, loading: false });
      } catch (err: any) {
        console.error("Failed to load all businesses:", err);
        set({ error: err?.message || "Failed to load all businesses", loading: false });
      }
    },
  };
});
