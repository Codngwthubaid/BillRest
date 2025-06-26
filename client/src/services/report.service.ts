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

export const getSalesReport = async (
  filterType: ReportFilterType,
  startDate: string,
  endDate?: string
): Promise<SalesReportResponse> => {
  const queryParams = new URLSearchParams({
    filterType,
    startDate,
    ...(endDate ? { endDate } : {}),
  });

  const res = await axiosInstance.get(`/report/sales?${queryParams}`);
  return res.data;
};
