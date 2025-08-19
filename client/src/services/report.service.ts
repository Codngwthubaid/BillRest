import { axiosInstance } from "@/lib/axiosInstance";
import type { HealthSalesReport, SalesReportResponse } from "@/types/report.types";

export type ReportFilterType =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "financial"
  | "custom";

// General Sales Report (for user/customer)
export const getSalesReportForGeneral = async (
  filterType: ReportFilterType,
  startDate: string,
  endDate?: string
): Promise<SalesReportResponse> => {
  const queryParams = new URLSearchParams({
    filterType,
    startDate,
    ...(endDate ? { endDate } : {}),
  });

  const res = await axiosInstance.get(`/report/sales/general/?${queryParams}`);
  return res.data;
};

// Health Sales Report (for user/clinic)
export const getSalesReportForHealth = async (
  filterType: ReportFilterType,
  startDate: string,
  endDate?: string
): Promise<HealthSalesReport> => {
  const queryParams = new URLSearchParams({
    filterType,
    startDate,
    ...(endDate ? { endDate } : {}),
  });

  const res = await axiosInstance.get(`/report/sales/health/?${queryParams}`);
  return res.data;
};

// General Sales Report (for Admin)
export const getAdminSalesReportForGeneral = async (
  filterType: ReportFilterType,
  startDate: string,
  endDate?: string
): Promise<SalesReportResponse> => {
  const queryParams = new URLSearchParams({
    filterType,
    startDate,
    ...(endDate ? { endDate } : {}),
  });

  const res = await axiosInstance.get(`/admin/reports/general/?${queryParams}`);
  return res.data;
};

// Health Sales Report (for Admin)
export const getAdminSalesReportForHealth = async (
  filterType: ReportFilterType,
  startDate: string,
  endDate?: string
): Promise<HealthSalesReport> => {
  const queryParams = new URLSearchParams({
    filterType,
    startDate,
    ...(endDate ? { endDate } : {}),
  });

  const res = await axiosInstance.get(`/admin/reports/health/?${queryParams}`);
  return res.data;
};
