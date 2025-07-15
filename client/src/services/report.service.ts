import { axiosInstance } from "@/lib/axiosInstance";
import type { SalesReportResponse } from "@/types/report.types";

export type ReportFilterType =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "financial"
  | "custom";

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

export const getSalesReportForHealth = async (
  filterType: ReportFilterType,
  startDate: string,
  endDate?: string
): Promise<SalesReportResponse> => {
  const queryParams = new URLSearchParams({
    filterType,
    startDate,
    ...(endDate ? { endDate } : {}),
  });

  const res = await axiosInstance.get(`/report/sales/health/?${queryParams}`);
  return res.data;
};
