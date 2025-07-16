import { create } from "zustand";
import type { Clinic } from "@/types/clinic.types";
import { createOrUpdateClinic, getClinicProfile } from "@/services/clinic.service";

interface ClinicStore {
  clinic?: Clinic;
  loading: boolean;
  error: string | null;

  fetchClinic: () => Promise<void>;
  saveClinicProfile: (data: {
    name: string;
    phone: string;
    businessName: string;
    address?: string;
    protectedPin?: string;
  }) => Promise<void>;
}

export const useClinicStore = create<ClinicStore>((set) => ({
  clinic: undefined,
  loading: false,
  error: null,

  fetchClinic: async () => {
    set({ loading: true, error: null });
    try {
      const clinic = await getClinicProfile();
      set({ clinic, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch clinic profile", loading: false });
    }
  },

  saveClinicProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const { clinic } = await createOrUpdateClinic(data);
      set({ clinic, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to save clinic profile", loading: false });
    }
  },
}));
