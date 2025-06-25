import { axiosInstance } from '@/lib/axiosInstance';
import type { Product } from '@/types/index';

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get('/products', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};