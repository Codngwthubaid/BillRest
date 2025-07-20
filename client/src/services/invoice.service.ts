import { axiosInstance } from "@/lib/axiosInstance";
import type { AllInvoicesResponse, CreateInvoicePayload, Invoice } from "@/types/invoice.types";

export const createInvoice = async (payload: CreateInvoicePayload): Promise<{ message: string; invoice: Invoice }> => {
  const res = await axiosInstance.post("/invoices", payload);
  return res.data;
};

export const getInvoices = async (): Promise<Invoice[]> => {
  const res = await axiosInstance.get("/invoices");
  return res.data;
};

export const updateInvoice = async (
  id: string,
  payload: Partial<Invoice>
): Promise<{ message: string; invoice: Invoice }> => {
  const res = await axiosInstance.put(`/invoices/${id}`, payload);
  return res.data;
};

export const deleteInvoice = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/invoices/${id}`);
  return res.data;
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const res = await axiosInstance.get(`/invoices/${id}`);
  return res.data;
};

export const downloadInvoicePDF = async (id: string): Promise<Blob> => {
  const res = await axiosInstance.get(`/invoices/${id}/download`, {
    responseType: "blob",
  });
  return res.data;
};

export const sendInvoiceOnWhatsApp = async (invoiceId: string): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/invoices/send-whatsapp/${invoiceId}`);
  return res.data;
};

export const downloadPOSReceiptPDF = async (invoiceId: string, size: "58mm" | "80mm"): Promise<Blob> => {
  const res = await axiosInstance.get(`/invoices/${invoiceId}/pos-pdf?size=${size}`, {
    responseType: "blob"
  });
  return res.data;
};

export const printInvoicePDF = async (id: string): Promise<void> => {
  const printUrl = await axiosInstance.get(`/invoices/${id}/print`);
  window.open(printUrl.data);
};

export const getAllInvoices = async (): Promise<AllInvoicesResponse> => {
  const res = await axiosInstance.get("/invoices/allInvoices");
  return res.data;
};