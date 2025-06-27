import { create } from "zustand";
import type { Invoice, CreateInvoicePayload } from "@/types/invoice.types";
import {
  createInvoice as apiCreateInvoice,
  getInvoices as apiGetInvoices,
  getInvoiceById as apiGetInvoiceById,
  downloadInvoicePDF as apiDownloadPDF,
  sendInvoiceOnWhatsApp as apiSendWhatsApp,
  updateInvoice,
  deleteInvoice,
} from "@/services/invoice.service";

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchInvoices: () => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  updateInvoice: (id: string, payload: Partial<Invoice>) => Promise<Invoice | null>;
  deleteInvoice: (id: string) => Promise<boolean>;
  createInvoice: (payload: CreateInvoicePayload) => Promise<Invoice | null>;
  downloadInvoicePDF: (id: string) => Promise<Blob | null>;
  sendInvoiceOnWhatsApp: (id: string) => Promise<string | null>;

  setInvoices: (invoices: Invoice[]) => void;
  setSelectedInvoice: (invoice: Invoice | null) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null,

  setInvoices: (invoices) => set({ invoices }),
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),

  fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiGetInvoices();
      set({ invoices: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch invoices", loading: false });
    }
  },

  fetchInvoiceById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiGetInvoiceById(id);
      set({ selectedInvoice: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch invoice", loading: false });
    }
  },

  createInvoice: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { invoice } = await apiCreateInvoice(payload);
      set((state) => ({
        invoices: [...state.invoices, invoice],
        loading: false,
      }));
      return invoice;
    } catch (err: any) {
      console.error("🔥 Create Invoice Error:", err);
      set({ error: err.message || "Failed to create invoice", loading: false });
      return null;
    }
  },

  updateInvoice: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { invoice } = await updateInvoice(id, payload);
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv._id === id ? invoice : inv)),
        selectedInvoice: state.selectedInvoice?._id === id ? invoice : state.selectedInvoice,
        loading: false,
      }));
      return invoice;
    } catch (err: any) {
      console.error("🔥 Update Invoice Error:", err);
      set({ error: err.message || "Failed to update invoice", loading: false });
      return null;
    }
  },

  deleteInvoice: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteInvoice(id);
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv._id !== id),
        selectedInvoice: state.selectedInvoice?._id === id ? null : state.selectedInvoice,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      console.error("🔥 Delete Invoice Error:", err);
      set({ error: err.message || "Failed to delete invoice", loading: false });
      return false;
    }
  },

  downloadInvoicePDF: async (id) => {
    try {
      const blob = await apiDownloadPDF(id);
      return blob;
    } catch (err) {
      console.error("Failed to download PDF", err);
      return null;
    }
  },

  sendInvoiceOnWhatsApp: async (id) => {
    try {
      const res = await apiSendWhatsApp(id);
      return res.message;
    } catch (err) {
      console.error("Failed to send on WhatsApp", err);
      return null;
    }
  },
}));
