import { axiosInstance } from "@/lib/axiosInstance";
import type { Product } from "@/types/product.types";

// ✅ Create product
export const createProduct = async (data: Omit<Product, "_id">) => {
  const res = await axiosInstance.post("/products", data);
  return res.data.product;
};

// ✅ Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get("/products");
  return res.data;
};

// ✅ Search by name or barcode
export const searchProducts = async (query: string): Promise<Product[]> => {
  const res = await axiosInstance.get(`/products/search?q=${query}`);
  return res.data;
};

// ✅ Update product
export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "_id">>
): Promise<Product> => {
  const res = await axiosInstance.put(`/products/${id}`, data);
  return res.data.product;
};

// ✅ Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};
