import { axiosInstance } from '@/lib/axiosInstance';
import type { SupportTicket } from '@/types/support.types';


export const createSupportTicketForGeneral = async (data: {
  subject: string;
  message: string;
}): Promise<{ message: string; ticket: SupportTicket }> => {
  const res = await axiosInstance.post('/support/general', data);
  return res.data;
};

export const getMyTicketsForGeneral = async (): Promise<SupportTicket[]> => {
  const res = await axiosInstance.get('/support/general');
  return res.data;
};

export const getTicketBySerialNumberForGeneral = async (serialNumber: number): Promise<SupportTicket> => {
  const res = await axiosInstance.get(`/support/general/ticket/${serialNumber}`);
  return res.data;
};

export const getAllSupportTicketsForGeneral = async (): Promise<SupportTicket[]> => {
  const res = await axiosInstance.get("/support/general/allTickets");
  return res.data;
};

export const updateTicketStatusForGeneral = async (id: string, status: string) => {
  const res = await axiosInstance.put(`/support/general/tickets/${id}`, { status });
  return res.data;
};


export const createSupportTicketForHealth = async (data: {
  subject: string;
  message: string;
}): Promise<{ message: string; ticket: SupportTicket }> => {
  const res = await axiosInstance.post('/support/health', data);
  return res.data;
};

export const getMyTicketsForHealth = async (): Promise<SupportTicket[]> => {
  const res = await axiosInstance.get('/support/health');
  return res.data;
};

export const getTicketBySerialNumberForHealth = async (serialNumber: number): Promise<SupportTicket> => {
  const res = await axiosInstance.get(`/support/health/ticket/${serialNumber}`);
  return res.data;
};

export const getAllSupportTicketsForHealth = async (): Promise<SupportTicket[]> => {
  const res = await axiosInstance.get("/support/health/allTickets");
  return res.data;
};
export const updateTicketStatusForHealth = async (id: string, status: string) => {
  const res = await axiosInstance.put(`/support/health/tickets/${id}`, { status });
  return res.data;
};
