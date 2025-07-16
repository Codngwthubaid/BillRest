import { axiosInstance } from "@/lib/axiosInstance";
import type { Clinic } from "@/types/clinic.types";

export const createOrUpdateClinic = async (data: {
  name: string;
  phone: string;
  businessName: string;
  address?: string;
  protectedPin?: string;
}): Promise<{ message: string; user: any; clinic: Clinic }> => {
  const res = await axiosInstance.post("/clinic", data);
  return res.data;
};

export const getClinicProfile = async (): Promise<Clinic> => {
  const res = await axiosInstance.get("/clinic");
  return res.data;
};
