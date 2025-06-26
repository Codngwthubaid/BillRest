import { create } from "zustand";
import type { Product } from "@/types/product.types";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "@/services/product.service";

interface ProductState {
  products: Product[];
  loading: boolean;

  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "_id">) => Promise<void>;
  editProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  search: (query: string) => Promise<Product[]>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const data = await getAllProducts();
      set({ products: data });
    } catch (err) {
      console.error("Fetch products failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await createProduct(product);
      set({ products: [...get().products, newProduct] });
    } catch (err) {
      console.error("Add product failed:", err);
    }
  },

  editProduct: async (id, updated) => {
    try {
      const updatedProduct = await updateProduct(id, updated);
      set({
        products: get().products.map((p) =>
          p._id === id ? updatedProduct : p
        ),
      });
    } catch (err) {
      console.error("Update product failed:", err);
    }
  },

  removeProduct: async (id) => {
    try {
      await deleteProduct(id);
      set({
        products: get().products.filter((p) => p._id !== id),
      });
    } catch (err) {
      console.error("Delete product failed:", err);
    }
  },

  search: async (query) => {
    try {
      return await searchProducts(query);
    } catch (err) {
      console.error("Search failed:", err);
      return [];
    }
  },
}));
