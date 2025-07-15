import { axiosInstance } from "@/lib/axiosInstance";
import type { Service, CreateServicePayload, UpdateServicePayload } from "@/types/service.types";

// Create
export const createService = async (data: CreateServicePayload): Promise<Service> => {
  const res = await axiosInstance.post("/services", data);
  return res.data.service;
};

// Get all
export const getServices = async (): Promise<Service[]> => {
  const res = await axiosInstance.get("/services");
  return res.data;
};

// Update
export const updateService = async (id: string, data: UpdateServicePayload): Promise<Service> => {
  const res = await axiosInstance.put(`/services/${id}`, data);
  return res.data.service;
};

// Delete
export const deleteService = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/services/${id}`);
  return res.data;
};

// Search
export const searchServices = async (query: string): Promise<Service[]> => {
  const res = await axiosInstance.get(`/services/search?q=${encodeURIComponent(query)}`);
  return res.data;
};
