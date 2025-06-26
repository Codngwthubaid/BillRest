import { axiosInstance } from "@/lib/axiosInstance";
import type { CreateInvoicePayload, Invoice } from "@/types/invoice.types";

// ✅ Create new invoice
export const createInvoice = async (payload: CreateInvoicePayload): Promise<{ message: string; invoice: Invoice }> => {
  const res = await axiosInstance.post("/invoice", payload);
  return res.data;
};

// ✅ Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  const res = await axiosInstance.get("/invoice");
  return res.data;
};

// ✅ Get invoice by ID
export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const res = await axiosInstance.get(`/invoice/${id}`);
  return res.data;
};

// ✅ Download invoice PDF
export const downloadInvoicePDF = async (id: string): Promise<Blob> => {
  const res = await axiosInstance.get(`/invoice/${id}/download`, {
    responseType: "blob", // Important for PDF
  });
  return res.data;
};

// ✅ Send invoice via WhatsApp
export const sendInvoiceOnWhatsApp = async (invoiceId: string): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/invoice/send-whatsapp/${invoiceId}`);
  return res.data;
};
