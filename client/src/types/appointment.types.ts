export type AppointmentStatus = "Pending" | "Admitted" | "Discharged";

export interface Patient {
  _id: string;
  name: string;
  phoneNumber: string;
  address?: string;
  age?: number;
  gender?: string;
}

export interface Appointment {
  _id: string;
  name: string;
  phoneNumber: string;
  address?: string;
  age?: number;
  gender?: string;
  clinic: string;
  patient: Patient;
  appointmentNumber: string;
  description?: string;
  status: AppointmentStatus;
  admitted: boolean;
  createdAt: string;
  updatedAt: string;
  count: number;
}


export interface CreateAppointmentPayload {
  name: string;
  phoneNumber: string;
  address?: string;
  age?: number;
  gender?: string;
  description?: string;
  status?: AppointmentStatus;
  admitted?: boolean;
  appointmentNumber?: string;
}

export interface UpdateAppointmentPayload {
  appointmentNumber?: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  age?: number;
  gender?: string;
  description?: string;
  status?: AppointmentStatus;
  admitted?: boolean;
}