import { create } from "zustand";
import type { Service, CreateServicePayload, UpdateServicePayload } from "@/types/service.types";
import {
  createService as apiCreateService,
  getServices as apiGetServices,
  updateService as apiUpdateService,
  deleteService as apiDeleteService,
  searchServices as apiSearchServices,
} from "@/services/service.service";

interface ServiceState {
  services: Service[];
  filteredServices: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchServices: () => Promise<void>;
  createService: (payload: CreateServicePayload) => Promise<Service | null>;
  updateService: (id: string, payload: UpdateServicePayload) => Promise<Service | null>;
  deleteService: (id: string) => Promise<boolean>;
  searchServices: (query: string) => Promise<void>;

  setServices: (services: Service[]) => void;
  setSelectedService: (service: Service | null) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  filteredServices: [],
  selectedService: null,
  loading: false,
  error: null,

  setServices: (services) => set({ services }),
  setSelectedService: (service) => set({ selectedService: service }),

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiGetServices();
      set({ services: data, loading: false });
    } catch (err: any) {
      console.error("Fetch services error:", err);
      set({ error: err.message || "Failed to fetch services", loading: false });
    }
  },

  createService: async (payload) => {
    set({ loading: true, error: null });
    try {
      const service = await apiCreateService(payload);
      set((state) => ({
        services: [...state.services, service],
        loading: false,
      }));
      return service;
    } catch (err: any) {
      console.error("Create service error:", err);
      set({ error: err.message || "Failed to create service", loading: false });
      return null;
    }
  },

  updateService: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const updated = await apiUpdateService(id, payload);
      set((state) => ({
        services: state.services.map((svc) => (svc._id === id ? updated : svc)),
        selectedService: state.selectedService?._id === id ? updated : state.selectedService,
        loading: false,
      }));
      return updated;
    } catch (err: any) {
      console.error("Update service error:", err);
      set({ error: err.message || "Failed to update service", loading: false });
      return null;
    }
  },

  deleteService: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteService(id);
      set((state) => ({
        services: state.services.filter((svc) => svc._id !== id),
        selectedService: state.selectedService?._id === id ? null : state.selectedService,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      console.error("Delete service error:", err);
      set({ error: err.message || "Failed to delete service", loading: false });
      return false;
    }
  },

  searchServices: async (query) => {
    set({ loading: true, error: null });
    try {
      const data = await apiSearchServices(query);
      set({ filteredServices: data, loading: false });
    } catch (err: any) {
      console.error("Search services error:", err);
      set({ error: err.message || "Failed to search services", loading: false });
    }
  },
}));
