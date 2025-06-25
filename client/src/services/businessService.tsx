import { axiosInstance } from '@/lib/axiosInstance';
import type { Business } from '@/types/index';

interface BusinessPayload {
  name: string;
  phone: string;
  businessName: string;
  address: string;
  defaultCurrency: 'INR' | 'USD' | 'AED';
  gstSlabs: { label: string; value: number }[];
  gstNumber?: string;
}

export const createOrUpdateBusiness = async (data: BusinessPayload): Promise<{ user: any; business: Business }> => {
  const response = await axiosInstance.post('/business', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const getBusinessByUser = async (): Promise<Business> => {
  const response = await axiosInstance.get('/business', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};