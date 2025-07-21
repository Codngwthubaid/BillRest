import type { IPDInput, IPDResponse } from "@/types/ipd.types";
import { axiosInstance } from "@/lib/axiosInstance";

export const createIPD = async (data: IPDInput): Promise<IPDResponse> => {
  const res = await axiosInstance.post("/ipd", data);
  return res.data.ipd;
};

export const getIPDs = async (): Promise<IPDResponse[]> => {
  const res = await axiosInstance.get("/ipd");
  console.log("Loaded IPDs:", res.data);
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

export const deleteIPD = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/ipd/${id}`);
  return res.data;
};

export const downloadIPDPDF = async (id: string): Promise<Blob> => {
  const res = await axiosInstance.get(`/ipd/${id}/download-pdf`, {
    responseType: "blob",
  });
  return res.data;
};

export const printIPDPDF = async (id: string): Promise<Blob> => {
  const res = await axiosInstance.get(`/ipd/${id}/print-pdf`, {
    responseType: "blob",
  });
  return res.data;
};

export const getAllIPDs = async (): Promise<IPDResponse[]> => {
  const res = await axiosInstance.get("/ipd/all");
  console.log("Loaded All IPDs:", res.data);
  return res.data;
}