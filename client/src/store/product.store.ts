import { create } from "zustand";
import type { Product } from "@/types/product.types";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
  getAllProducts, // ✅ NEW
} from "@/services/product.service";

interface ProductState {
  products: Product[];
  allProducts: Product[]; // ✅ NEW
  loading: boolean;

  fetchProducts: () => Promise<void>;
  fetchAllProducts: () => Promise<void>; // ✅ NEW
  addProduct: (product: Omit<Product, "_id">) => Promise<void>;
  editProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  search: (query: string) => Promise<Product[]>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  allProducts: [], // ✅ NEW
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const data = await getProducts();
      set({ products: data });
    } catch (err) {
      console.error("Fetch products failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const data = await getAllProducts();
      console.log("Loaded all products:", data);
      set({ allProducts: data });
    } catch (err) {
      console.error("Fetch all products failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await createProduct(product);
      set({ products: [...get().products, newProduct], allProducts: [...get().allProducts, newProduct] }); // ✅ also update allProducts
    } catch (err) {
      console.error("Add product failed:", err);
    }
  },

  editProduct: async (id, updated) => {
    try {
      const updatedProduct = await updateProduct(id, updated);
      set({
        products: get().products.map((p) => p._id === id ? updatedProduct : p),
        allProducts: get().allProducts.map((p) => p._id === id ? updatedProduct : p), // ✅ keep admin data updated
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
        allProducts: get().allProducts.filter((p) => p._id !== id), // ✅ remove from allProducts
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
