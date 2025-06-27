import { axiosInstance } from "@/lib/axiosInstance";
import type { CreateInvoicePayload, Invoice } from "@/types/invoice.types";

// ✅ Create new invoice
export const createInvoice = async (payload: CreateInvoicePayload): Promise<{ message: string; invoice: Invoice }> => {
  const res = await axiosInstance.post("/invoices", payload);
  console.log(res.data)
  return res.data;
};

// ✅ Get all invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  const res = await axiosInstance.get("/invoices");
  return res.data;
};

// ✅ Update invoice
export const updateInvoice = async (
  id: string,
  payload: Partial<Invoice>
): Promise<{ message: string; invoice: Invoice }> => {
  const res = await axiosInstance.put(`/invoices/${id}`, payload);
  return res.data;
};

// ✅ Delete invoice
export const deleteInvoice = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/invoices/${id}`);
  return res.data;
};

// ✅ Get invoice by ID
export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const res = await axiosInstance.get(`/invoices/${id}`);
  return res.data;
};

// ✅ Download invoice PDF
export const downloadInvoicePDF = async (id: string): Promise<Blob> => {
  const res = await axiosInstance.get(`/invoices/${id}/download`, {
    responseType: "blob",
  });
  return res.data;
};

// ✅ Send invoice via WhatsApp
export const sendInvoiceOnWhatsApp = async (invoiceId: string): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/invoices/send-whatsapp/${invoiceId}`);
  return res.data;
};
