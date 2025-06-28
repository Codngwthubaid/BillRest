import { axiosInstance } from "@/lib/axiosInstance";
import type { Plan } from "@/types/plan.types";

// ✅ Get all plans
export const getAllPlans = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans");
  return res.data.plans;
};

// ✅ Get package plans only
export const getPackagePlans = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans/packages");
  return res.data.packages;
};

// ✅ Get individual add-on plans only
export const getIndividualPlans = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans/individuals");
  return res.data.individuals;
};
