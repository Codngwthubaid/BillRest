import { axiosInstance } from '@/lib/axiosInstance';
import type { SupportTicket } from '@/types/support.types';

export const createSupportTicket = async (data: {
  subject: string;
  message: string;
}): Promise<{ message: string; ticket: SupportTicket }> => {
  const res = await axiosInstance.post('/support', data);
  return res.data;
};

export const getMyTickets = async (): Promise<SupportTicket[]> => {
  const res = await axiosInstance.get('/support');
  return res.data;
};

export const getTicketBySerialNumber = async (serialNumber: number): Promise<SupportTicket> => {
  const res = await axiosInstance.get(`/support/ticket/${serialNumber}`);
  return res.data;
};

export const getAllSupportTickets = async () => {
  const res = await axiosInstance.get("/support/allTickets");
  return res.data;
}

export const updateTicketStatus = async (id: string, status: string) => {
  const res = await axiosInstance.put(`/support/tickets/${id}`, { status });
  return res.data;
};
