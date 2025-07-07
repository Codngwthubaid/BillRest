import { axiosInstance } from "@/lib/axiosInstance";
import type { Customer } from "@/types/customers.types";

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await axiosInstance.get("/customers");
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/customers/${id}`);
  return response.data;
};

export const getAllCustomers = async () => {
  const res = await axiosInstance.get("/customers/allCustomers");
  return res.data;
};