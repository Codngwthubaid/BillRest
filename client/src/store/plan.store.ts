import { create } from "zustand";
import type { Plan } from "@/types/plan.types";
import {
  getAllPlans,
  getPackagePlans,
  getIndividualPlans
} from "@/services/plan.service";

interface PlanState {
  allPlans: Plan[];
  packagePlans: Plan[];
  individualPlans: Plan[];

  fetchAllPlans: () => Promise<void>;
  fetchPackagePlans: () => Promise<void>;
  fetchIndividualPlans: () => Promise<void>;
}

export const usePlanStore = create<PlanState>((set) => ({
  allPlans: [],
  packagePlans: [],
  individualPlans: [],

  fetchAllPlans: async () => {
    try {
      const plans = await getAllPlans();
      set({ allPlans: plans });
    } catch (err) {
      console.error("Failed to fetch all plans:", err);
      set({ allPlans: [] });
    }
  },

  fetchPackagePlans: async () => {
    try {
      const plans = await getPackagePlans();
      set({ packagePlans: plans });
    } catch (err) {
      console.error("Failed to fetch package plans:", err);
      set({ packagePlans: [] });
    }
  },

  fetchIndividualPlans: async () => {
    try {
      const plans = await getIndividualPlans();
      set({ individualPlans: plans });
    } catch (err) {
      console.error("Failed to fetch individual plans:", err);
      set({ individualPlans: [] });
    }
  },
}));
