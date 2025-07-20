import { axiosInstance } from "@/lib/axiosInstance";
import type { Appointment, CreateAppointmentPayload, UpdateAppointmentPayload } from "@/types/appointment.types";


export const createAppointment = async (data: CreateAppointmentPayload): Promise<Appointment> => {
  const res = await axiosInstance.post("/appointments", data);
  return res.data.appointment;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  const res = await axiosInstance.get("/appointments");
  return res.data;
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const res = await axiosInstance.get(`/appointments/${id}`);
  return res.data;
};

export const updateAppointment = async (id: string, data: UpdateAppointmentPayload): Promise<Appointment> => {
  const res = await axiosInstance.put(`/appointments/${id}`, data);
  return res.data.appointment;
};

export const deleteAppointment = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/appointments/${id}`);
  return res.data;
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const res = await axiosInstance.get("/appointments/allAppointments");
  return res.data;
}