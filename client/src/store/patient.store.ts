import { create } from "zustand";
import type { Patient } from "@/types/patient.types";
import {
  getPatients as apiGetPatients,
  deletePatient as apiDeletePatient,
  getAllPatients as apiGetAllPatients
} from "@/services/patient.service";

interface PatientState {
  patients: Patient[];
  allPatients: Patient[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchPatients: () => Promise<void>;
  fetchAllPatients: () => Promise<Patient[]>;
  deletePatient: (id: string) => Promise<boolean>;

  setPatients: (patients: Patient[]) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  allPatients: [],
  loading: false,
  error: null,

  setPatients: (patients) => set({ patients }),

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiGetPatients();
      set({ patients: data, loading: false });
    } catch (err: any) {
      console.error("Fetch patients error:", err);
      set({
        error: err.message || "Failed to fetch patients",
        loading: false,
      });
    }
  },

  deletePatient: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeletePatient(id);
      set((state) => ({
        patients: state.patients.filter((p) => p._id !== id),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      console.error("Delete patient error:", err);
      set({
        error: err.message || "Failed to delete patient",
        loading: false,
      });
      return false;
    }
  },

  fetchAllPatients: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiGetAllPatients();
      set({ allPatients: data, loading: false });
      return data;
    } catch (err: any) {
      console.error("Fetch all patients error:", err);
      set({
        error: err.message || "Failed to fetch all patients",
        loading: false,
      });
      return [];
    }
  },

}));
