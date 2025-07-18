import type { IPDInput, IPDResponse } from "@/types/ipd.types";
import { axiosInstance } from "@/lib/axiosInstance";

export const createIPD = async (data: IPDInput): Promise<IPDResponse> => {
  const res = await axiosInstance.post("/ipd", data);
  return res.data.ipd;
};

export const getAllIPDs = async (): Promise<IPDResponse[]> => {
  const res = await axiosInstance.get("/ipd");
  return res.data;
};

export const getIPDById = async (id: string): Promise<IPDResponse> => {
  const res = await axiosInstance.get(`/ipd/${id}`);
  return res.data;
};

export const updateIPD = async (id: string, data: Partial<IPDInput>): Promise<IPDResponse> => {
  const res = await axiosInstance.put(`/ipd/${id}`, data);
  return res.data.ipd;
};

export const dischargeIPD = async (id: string, dischargeDate?: string): Promise<IPDResponse> => {
  const res = await axiosInstance.patch(`/ipd/${id}/discharge`, { dischargeDate });
  return res.data.ipd;
};
