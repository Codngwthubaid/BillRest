import { create } from "zustand";
import {
  createIPD,
  getIPDs,
  getIPDById,
  updateIPD,
  dischargeIPD,
  deleteIPD,
  downloadIPDPDF,
  printIPDPDF,
  getAllIPDs,
} from "@/services/ipd.service";

import type { IPDInput, IPDResponse } from "@/types/ipd.types";

interface IPDState {
  ipds: IPDResponse[];
  allIPDs: IPDResponse[];
  selectedIPD: IPDResponse | null;
  loading: boolean;
  error: string | null;

  fetchIPDs: () => Promise<void>;
  fetchAllIPDs: () => Promise<void>;
  fetchIPD: (id: string) => Promise<void>;
  createIPDRecord: (data: IPDInput) => Promise<void>;
  updateIPDRecord: (id: string, data: Partial<IPDInput>) => Promise<void>;
  dischargeIPDRecord: (id: string, dischargeDate?: string) => Promise<void>;
  deleteIPDRecord: (id: string) => Promise<void>;

  downloadIPDPDFById: (id: string) => Promise<void>;
  printIPDPDF: (id: string) => void;
}

export const useIPDStore = create<IPDState>((set) => ({
  ipds: [],
  allIPDs: [],
  selectedIPD: null,
  loading: false,
  error: null,

  fetchIPDs: async () => {
    set({ loading: true, error: null });
    try {
      const ipds = await getIPDs();
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

  updateIPDRecord: async (id, data) => {
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

  dischargeIPDRecord: async (id, dischargeDate) => {
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

  deleteIPDRecord: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteIPD(id);
      await useIPDStore.getState().fetchIPDs();
    } catch (err: any) {
      set({ error: err.message || "Failed to delete IPD" });
    } finally {
      set({ loading: false });
    }
  },

  downloadIPDPDFById: async (id) => {
    try {
      const blob = await downloadIPDPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `IPD-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      set({ error: err.message || "Failed to download IPD PDF" });
    }
  },

  printIPDPDF: async (id) => {
    try {
      const blob = await printIPDPDF(id);
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url);
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.print();
          newWindow.onafterprint = () => {
            window.URL.revokeObjectURL(url);
            newWindow.close();
          };
        };
      } else {
        set({ error: "Failed to open print window. Please allow pop-ups." });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to print IPD PDF" });
    }
  },

  fetchAllIPDs: async () => {
    set({ loading: true, error: null });
    try {
      const ipds = await getAllIPDs();
      set({ allIPDs: ipds });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch all IPDs" });
    } finally {
      set({ loading: false });
    }
  },

}));
