import { create } from "zustand";
import type { Plan } from "@/types/plan.types";
import {
  getAllPlansForGeneral,
  getPackagePlansForGeneral,
  getIndividualPlansForGeneral,
  getAllPlansForHealth,
  getPackagePlansForHealth,
  getIndividualPlansForHealth,
} from "@/services/plan.service";

interface PlanState {
  // General plans
  allGeneralPlans: Plan[];
  packageGeneralPlans: Plan[];
  individualGeneralPlans: Plan[];

  // Health plans
  allHealthPlans: Plan[];
  packageHealthPlans: Plan[];
  individualHealthPlans: Plan[];

  // Actions
  fetchAllGeneralPlans: () => Promise<void>;
  fetchPackageGeneralPlans: () => Promise<void>;
  fetchIndividualGeneralPlans: () => Promise<void>;

  fetchAllHealthPlans: () => Promise<void>;
  fetchPackageHealthPlans: () => Promise<void>;
  fetchIndividualHealthPlans: () => Promise<void>;
}

export const usePlanStore = create<PlanState>((set) => ({
  // ✅ state
  allGeneralPlans: [],
  packageGeneralPlans: [],
  individualGeneralPlans: [],

  allHealthPlans: [],
  packageHealthPlans: [],
  individualHealthPlans: [],

  // ✅ general fetchers
  fetchAllGeneralPlans: async () => {
    try {
      const plans = await getAllPlansForGeneral();
      set({ allGeneralPlans: plans });
    } catch (err) {
      console.error("Failed to fetch all general plans:", err);
      set({ allGeneralPlans: [] });
    }
  },

  fetchPackageGeneralPlans: async () => {
    try {
      const plans = await getPackagePlansForGeneral();
      set({ packageGeneralPlans: plans });
    } catch (err) {
      console.error("Failed to fetch package general plans:", err);
      set({ packageGeneralPlans: [] });
    }
  },

  fetchIndividualGeneralPlans: async () => {
    try {
      const plans = await getIndividualPlansForGeneral();
      set({ individualGeneralPlans: plans });
    } catch (err) {
      console.error("Failed to fetch individual general plans:", err);
      set({ individualGeneralPlans: [] });
    }
  },

  // ✅ health fetchers
  fetchAllHealthPlans: async () => {
    try {
      const plans = await getAllPlansForHealth();
      set({ allHealthPlans: plans });
    } catch (err) {
      console.error("Failed to fetch all health plans:", err);
      set({ allHealthPlans: [] });
    }
  },

  fetchPackageHealthPlans: async () => {
    try {
      const plans = await getPackagePlansForHealth();
      set({ packageHealthPlans: plans });
    } catch (err) {
      console.error("Failed to fetch package health plans:", err);
      set({ packageHealthPlans: [] });
    }
  },

  fetchIndividualHealthPlans: async () => {
    try {
      const plans = await getIndividualPlansForHealth();
      set({ individualHealthPlans: plans });
    } catch (err) {
      console.error("Failed to fetch individual health plans:", err);
      set({ individualHealthPlans: [] });
    }
  },
}));
