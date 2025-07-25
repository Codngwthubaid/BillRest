import { axiosInstance } from "@/lib/axiosInstance";
import type { Clinic, ClinicFeatures, ClinicPayload } from "@/types/clinic.types";

interface ClinicResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  clinic: Clinic;
}

export const getAllClinics = async () => {
  const res = await axiosInstance.get("/clinic/all");
  return res.data;
};

export const upsertClinic = async (payload: ClinicPayload): Promise<ClinicResponse> => {
  const res = await axiosInstance.post("/clinic", payload);
  return res.data;
};

export const getClinic = async (): Promise<Clinic> => {
  const res = await axiosInstance.get("/clinic");
  return res.data;
};

export const updateClinicFeatures = async (id: string, features: ClinicFeatures) => {
  const res = await axiosInstance.patch(`/admin/clinics/${id}/features`, {
    features
  });
  return res.data;
};
