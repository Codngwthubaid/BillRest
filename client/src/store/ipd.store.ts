import { create } from "zustand";
import {
  createIPD,
  getAllIPDs,
  getIPDById,
  updateIPD,
  dischargeIPD,
} from "@/services/ipd.service";
import type { IPDInput, IPDResponse } from "@/types/ipd.types";

interface IPDState {
  ipds: IPDResponse[];
  selectedIPD: IPDResponse | null;
  loading: boolean;
  error: string | null;

  fetchIPDs: () => Promise<void>;
  fetchIPD: (id: string) => Promise<void>;
  createIPDRecord: (data: IPDInput) => Promise<void>;
  updateIPDRecord: (id: string, data: Partial<IPDInput>) => Promise<void>;
  dischargeIPDRecord: (id: string, dischargeDate?: string) => Promise<void>;
}

export const useIPDStore = create<IPDState>((set) => ({
  ipds: [],
  selectedIPD: null,
  loading: false,
  error: null,

  fetchIPDs: async () => {
    set({ loading: true, error: null });
    try {
      const ipds = await getAllIPDs();
      set({ ipds });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch IPDs" });
    } finally {
      set({ loading: false });
    }
  },

  fetchIPD: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const ipd = await getIPDById(id);
      set({ selectedIPD: ipd });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch IPD" });
    } finally {
      set({ loading: false });
    }
  },

  createIPDRecord: async (data: IPDInput) => {
    set({ loading: true, error: null });
    try {
      await createIPD(data);
      await useIPDStore.getState().fetchIPDs();
    } catch (err: any) {
      set({ error: err.message || "Failed to create IPD" });
    } finally {
      set({ loading: false });
    }
  },

  updateIPDRecord: async (id: string, data: Partial<IPDInput>) => {
    set({ loading: true, error: null });
    try {
      await updateIPD(id, data);
      await useIPDStore.getState().fetchIPDs();
    } catch (err: any) {
      set({ error: err.message || "Failed to update IPD" });
    } finally {
      set({ loading: false });
    }
  },

  dischargeIPDRecord: async (id: string, dischargeDate?: string) => {
    set({ loading: true, error: null });
    try {
      await dischargeIPD(id, dischargeDate);
      await useIPDStore.getState().fetchIPDs();
    } catch (err: any) {
      set({ error: err.message || "Failed to discharge IPD" });
    } finally {
      set({ loading: false });
    }
  },
}));
