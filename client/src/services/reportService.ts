import { axiosInstance } from '@/lib/axiosInstance';
import type { SalesReport } from '@/types/index';

export const getSalesReport = async (
  filterType: string,
  startDate: string,
  endDate: string
): Promise<SalesReport> => {
  const response = await axiosInstance.get('/report/sales', {
    params: { filterType, startDate, endDate },
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};