import { axiosInstance } from '@/lib/axiosInstance';
import type { SyncInvoice, SyncProduct } from '@/types/sync.types';

export const syncInvoices = async (invoices: SyncInvoice[]) => {
  const response = await axiosInstance.post('/sync/invoices', { invoices });
  return response.data;
};

export const getSyncProducts = async (): Promise<SyncProduct[]> => {
  const response = await axiosInstance.get('/sync/products');
  return response.data;
};