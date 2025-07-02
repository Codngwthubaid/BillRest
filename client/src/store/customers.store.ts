import { create } from "zustand";
import type { Customer } from "@/types/customers.types";
import { getCustomers, deleteCustomer as apiDeleteCustomer } from "@/services/customers.service";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
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

  deleteCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteCustomer(id);
      set((state) => ({
        customers: state.customers.filter((customer) => customer._id !== id),
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
