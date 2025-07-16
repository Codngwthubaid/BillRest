// import { create } from "zustand";
// import type { Clinic } from "@/types/clinic.types";
// import { createOrUpdateClinic, getClinicProfile } from "@/services/clinic.service";

// interface ClinicStore {
//   clinic?: Clinic;
//   loading: boolean;
//   error: string | null;

//   fetchClinic: () => Promise<void>;
//   saveClinicProfile: (data: {
//     name: string;
//     phone: string;
//     businessName: string;
//     address?: string;
//     protectedPin?: string;
//   }) => Promise<void>;
// }

// export const useClinicStore = create<ClinicStore>((set) => ({
//   clinic: undefined,
//   loading: false,
//   error: null,

//   fetchClinic: async () => {
//     set({ loading: true, error: null });
//     try {
//       const clinic = await getClinicProfile();
//       set({ clinic, loading: false });
//     } catch (err: any) {
//       set({ error: err.message || "Failed to fetch clinic profile", loading: false });
//     }
//   },

//   saveClinicProfile: async (data) => {
//     set({ loading: true, error: null });
//     try {
//       const { clinic } = await createOrUpdateClinic(data);
//       set({ clinic, loading: false });
//     } catch (err: any) {
//       set({ error: err.message || "Failed to save clinic profile", loading: false });
//     }
//   },
// }));





import { create } from "zustand";
import type { Clinic } from "@/types/clinic.types";
import { createOrUpdateClinic, getClinicProfile } from "@/services/clinic.service";

interface ClinicStore {
  clinic: Clinic | null;
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
  clearClinic: () => void;
}

export const useClinicStore = create<ClinicStore>((set) => {
  const loadClinic = async () => {
    set({ loading: true, error: null });
    try {
      const clinic = await getClinicProfile();
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

  // Note: commented so it doesn't auto-load; you will call fetchClinic() explicitly
  loadClinic();

  return {
    clinic: null,
    loading: false,
    error: null,

    fetchClinic: loadClinic,
    clearClinic: () => set({ clinic: null }),

    saveClinicProfile: async (data) => {
      set({ loading: true, error: null });
      try {
        const { clinic } = await createOrUpdateClinic(data);
        console.log("Saved clinic profile:", clinic);
        set({ clinic, loading: false });
      } catch (err: any) {
        console.error("Failed to save clinic:", err);
        set({ error: err.message || "Failed to save clinic profile", loading: false });
      }
    }
  };
});
