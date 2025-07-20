import { create } from "zustand";
import type { Clinic, ClinicPayload } from "@/types/clinic.types";
import { upsertClinic, getClinic, getAllClinics } from "@/services/clinic.service";
import { useAuthStore } from "./auth.store";

interface ClinicStore {
  clinic: Clinic | null;
  allClinics: Clinic | null;
  loading: boolean;
  error: string | null;
  isPinVerified: boolean;

  verifyPin: () => void;
  resetPinVerification: () => void;
  fetchClinic: () => Promise<void>;
  fetchAllClinics: () => Promise<void>;
  clearClinic: () => void;
  saveClinicProfile: (data: ClinicPayload) => Promise<void>;
}

export const useClinicStore = create<ClinicStore>((set) => {
  const user = useAuthStore.getState().user;

  const loadClinic = async () => {
    set({ loading: true, error: null });
    try {
      const clinic = await getClinic();
      console.log("Loaded clinic:", clinic);
      set({ clinic, loading: false });
    } catch (err: any) {
      console.error("Failed to load clinic:", err);
      if (err?.response?.status === 404) {
        set({ clinic: null, loading: false, error: null });
      } else {
        set({ error: err?.message || "Failed to load clinic", loading: false });
      }
    }
  };

  if (user?.role === "clinic") {
    loadClinic();
  }

  return {
    clinic: null,
    allClinics: null,
    loading: true,
    error: null,
    isPinVerified: false,

    verifyPin: () => set({ isPinVerified: true }),
    resetPinVerification: () => set({ isPinVerified: false }),

    fetchClinic: loadClinic,

    clearClinic: () => set({ clinic: null }),

    saveClinicProfile: async (data) => {
      set({ loading: true, error: null });
      try {
        const { clinic } = await upsertClinic(data);
        console.log("Saved clinic profile:", clinic);
        set({ clinic, loading: false });
      } catch (err: any) {
        console.error("Failed to save clinic profile:", err);
        set({ error: err.message || "Failed to save clinic profile", loading: false });
      }
    },

    fetchAllClinics: async () => {
      set({ loading: true, error: null });
      try {
        const res = await getAllClinics();
        set({ allClinics: res, loading: false });
      } catch (err: any) {
        console.error("Failed to load all clinics:", err);
        set({ error: err.message || "Failed to load clinics", loading: false });
      }
    },
  };
});
