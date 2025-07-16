import { axiosInstance } from "@/lib/axiosInstance";
import type { Plan } from "@/types/plan.types";


export const getAllPlansForGeneral = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans/general");
  return res.data.plans;
};

export const getPackagePlansForGeneral = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans/general/packages");
  return res.data.packages;
};

export const getIndividualPlansForGeneral = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans/general/individuals");
  return res.data.individuals;
};

export const getAllPlansForHealth = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans/health");
  return res.data.plans;
};

export const getPackagePlansForHealth = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans/health/packages");
  return res.data.packages;
};

export const getIndividualPlansForHealth = async (): Promise<Plan[]> => {
  const res = await axiosInstance.get("/plans/health/individuals");
  return res.data.individuals;
};
