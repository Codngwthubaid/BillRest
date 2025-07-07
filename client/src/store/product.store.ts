import { create } from "zustand";
import type { Product } from "@/types/product.types";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
  getAllProducts,
} from "@/services/product.service";

interface ProductState {
  products: Product[];
  allProducts: Product[];
  loading: boolean;

  fetchProducts: () => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "_id">) => Promise<void>;
  editProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  search: (query: string) => Promise<Product[]>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  allProducts: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const data = await getProducts(); // expects Product[]
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
      const data = await getAllProducts(); // returns { count, products }
      console.log("Loaded all products:", data);
      set({ allProducts: data }); // ✅ fix: only store array of products
    } catch (err) {
      console.error("Fetch all products failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await createProduct(product);
      set({
        products: [...get().products, newProduct],
        allProducts: [...get().allProducts, newProduct],
      });
    } catch (err) {
      console.error("Add product failed:", err);
    }
  },

  editProduct: async (id, updated) => {
    try {
      const updatedProduct = await updateProduct(id, updated);
      set({
        products: get().products.map((p) => p._id === id ? updatedProduct : p),
        allProducts: get().allProducts.map((p) => p._id === id ? updatedProduct : p),
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
        allProducts: get().allProducts.filter((p) => p._id !== id),
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
