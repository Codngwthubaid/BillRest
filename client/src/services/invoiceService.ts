import { axiosInstance } from '@/lib/axiosInstance';
import type { Invoice } from '@/types/index';

interface CreateInvoicePayload {
  customerName: string;
  phoneNumber: string;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Other';
  currency: 'INR' | 'USD' | 'AED';
  products: { product: string; quantity: number; price: number; gstRate: number }[];
}

export const getInvoices = async (): Promise<Invoice[]> => {
  const response = await axiosInstance.get('/invoices', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const response = await axiosInstance.get(`/invoices/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const createInvoice = async (data: CreateInvoicePayload): Promise<{ invoice: Invoice }> => {
  const response = await axiosInstance.post('/invoices', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const downloadInvoicePDF = async (id: string): Promise<Blob> => {
  const response = await axiosInstance.get(`/invoices/${id}/download`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    responseType: 'blob',
  });
  return response.data;
};

export const sendInvoiceWhatsApp = async (invoiceId: string): Promise<void> => {
  await axiosInstance.post(`/invoices/send-whatsapp/${invoiceId}`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
};