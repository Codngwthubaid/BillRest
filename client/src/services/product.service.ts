import { axiosInstance } from "@/lib/axiosInstance";
import type { Product } from "@/types/product.types";

export const createProduct = async (data: Omit<Product, "_id">) => {
  const res = await axiosInstance.post("/products", data);
  return res.data.product;
};

export const getProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get("/products");
  return res.data;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const res = await axiosInstance.get(`/products/search?q=${query}`);
  return res.data;
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "_id">>
): Promise<Product> => {
  const res = await axiosInstance.put(`/products/${id}`, data);
  return res.data.product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};


export const getAllProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get("/products/allProducts");
  return res.data.products;
};