import { axiosInstance } from "@/lib/axiosInstance";
import type { Business, BusinessFeatures, BusinessPayload } from "@/types/business.types";

interface BusinessResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  business: Business;
}

export const upsertBusiness = async (payload: BusinessPayload): Promise<BusinessResponse> => {
  const res = await axiosInstance.post("/business", payload);
  return res.data;
};

export const getBusiness = async (): Promise<Business> => {
  const res = await axiosInstance.get("/business");
  return res.data;
};

export const getAllBusinesses = async () => {
  const res = await axiosInstance.get("/business/allBusinesses");
  return res.data;
};

export const updateBusinessFeatures = async (id: string, features: BusinessFeatures) => {
  const res = await axiosInstance.patch(`/admin/businesses/${id}/features`, {
    features
  });
  return res.data;
};
