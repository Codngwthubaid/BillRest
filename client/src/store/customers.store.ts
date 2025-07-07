import { create } from "zustand";
import type { Customer } from "@/types/customers.types";
import {
  getCustomers,
  deleteCustomer as apiDeleteCustomer,
  getAllCustomers
} from "@/services/customers.service";

interface CustomerState {
  customers: Customer[];
  allCustomers: Customer[]; // ✅ NEW for admin
  loading: boolean;
  error: string | null;

  fetchCustomers: () => Promise<void>;
  fetchAllCustomers: () => Promise<void>; // ✅ NEW
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  allCustomers: [], // ✅ NEW
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCustomers();
      set({ customers: data, loading: false });
    } catch (err: any) {
      console.error("Fetch customers failed:", err);
      set({
        error: err.message || "Failed to load customers",
        loading: false,
        customers: []
      });
    }
  },

  fetchAllCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllCustomers();
      console.log("Loaded all customers:", data);
      set({ allCustomers: data, loading: false });
    } catch (err: any) {
      console.error("Fetch all customers failed:", err);
      set({
        error: err.message || "Failed to load all customers",
        loading: false,
        allCustomers: []
      });
    }
  },

  deleteCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteCustomer(id);
      set((state) => ({
        customers: state.customers.filter((customer) => customer._id !== id),
        allCustomers: state.allCustomers.filter((customer) => customer._id !== id), // ✅ keep both updated
        loading: false
      }));
    } catch (err: any) {
      console.error("Delete customer failed:", err);
      set({
        error: err.message || "Failed to delete customer",
        loading: false
      });
    }
  },
}));
