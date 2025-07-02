// import { create } from "zustand";
// import { getBusiness } from "@/services/business.service";
// import type { Business } from "@/types/business.types";


// interface BusinessState {
//   business: Business | null;
//   loading: boolean;
//   error: string | null;
//   isPinVerified: boolean;
//   verifyPin: () => void;
//   resetPinVerification: () => void;
//   fetchBusiness: () => Promise<void>;
//   clearBusiness: () => void;
// }

// export const useBusinessStore = create<BusinessState>((set) => {
//   const loadBusiness = async () => {
//     set({ loading: true, error: null });
//     try {
//       const data = await getBusiness();
//       console.log("Loaded business:", data);
//       set({ business: data, loading: false });
//     } catch (err: any) {
//       console.error("Failed to load business:", err);
//       set({ error: err?.message || "Failed to load", loading: false });
//     }
//   };

//   loadBusiness();

//   return {
//     business: null,
//     loading: true,
//     error: null,
//     isPinVerified: false,
//     verifyPin: () => set({ isPinVerified: true }),
//     resetPinVerification: () => set({ isPinVerified: false }),
//     fetchBusiness: loadBusiness,
//     clearBusiness: () => set({ business: null }),
//   };
// });


import { create } from "zustand";
import { getBusiness } from "@/services/business.service";
import type { Business } from "@/types/business.types";

interface BusinessState {
  business: Business | null;
  loading: boolean;
  error: string | null;
  isPinVerified: boolean;
  verifyPin: () => void;
  resetPinVerification: () => void;
  fetchBusiness: () => Promise<void>;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => {
  const loadBusiness = async () => {
    set({ loading: true, error: null });
    try {
      const data = await getBusiness();
      console.log("Loaded business:", data);
      set({ business: data, loading: false });
    } catch (err: any) {
      console.error("Failed to load business:", err);
      
      // 🥇 Handle 404 gracefully
      if (err?.response?.status === 404) {
        set({ business: null, loading: false, error: null }); // no error on 404
      } else {
        set({ error: err?.message || "Failed to load", loading: false });
      }
    }
  };

  loadBusiness();

  return {
    business: null,
    loading: true,
    error: null,
    isPinVerified: false,
    verifyPin: () => set({ isPinVerified: true }),
    resetPinVerification: () => set({ isPinVerified: false }),
    fetchBusiness: loadBusiness,
    clearBusiness: () => set({ business: null }),
  };
});

