import type { Product } from "./product.types";

export interface ReportProduct {
  name: string;
  quantity: number;
  totalSales: number;
}

export interface ReportInvoiceProduct {
  product: Product | string;
  quantity: number;
  price: number;
  gstRate: number;
}

export interface ReportInvoice {
  _id: string;
  invoiceNumber: string;
  products: ReportInvoiceProduct[];
  subTotal: number;
  gstAmount: number;
  totalAmount: number;
  currency: string;
  status: "paid" | "pending" | "overdue" | "draft";
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  customerName: string;
  phoneNumber: string;
  createdAt: string;
}

export interface SalesReportResponse {
  totalSales: number;
  count: number;
  topProducts: ReportProduct[];
  invoices: ReportInvoice[];
}

// -------- NEW: for health report --------
export interface ReportTreatment {
  service: string;
  quantity: number;
  totalSales: number;
}

export interface IPDBilling {
  roomCharges: number;
  serviceCharges: number;
  medicineCharges: number;
  otherCharges: { itemName: string; amount: number }[];
  total: number;
}

export interface ReportIPD {
  _id: string;
  ipdNumber: string;
  admissionDate: string;
  dischargeDate?: string;
  billing: IPDBilling;
  status: "Admitted" | "Discharged";
  patient: Patient;
  createdAt: string;
}

// New type for top patients
export interface TopPatient {
  _id: string;
  name: string;
  phoneNumber: string;
  visits: number;
}

// New type for top appointments
export interface TopAppointment {
  description: string;
  count: number;
}

export interface Patient {
  _id: string;
  name: string;
  phoneNumber: string;
  age: number;
  gender: string;
  address: string;
  clinic: string;
  visits: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Appointment {
  _id: string;
  time: string;
  date: string;
  appointmentNumber: string;
  clinic: string;
  status: "Pending" | "Completed" | "Canceled";
  createdAt: string;
  description: string;
  admitted: boolean;
  patient: Patient;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  gstRate: number;
  unit: string;
  category: string;
  clinic: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HealthSalesReport {
  totalRevenue: number;
  count: number;
  topServices: ReportTreatment[];
  ipds: ReportIPD[];
  totalAppointments: number;
  totalPatients: number;
  totalServices: number;
  topPatients: TopPatient[];
  topAppointments: TopAppointment[];
  appointments: Appointment[]
  services: Service[]
  patients: Patient[]
}
