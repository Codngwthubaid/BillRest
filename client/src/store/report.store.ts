import { create } from "zustand";
import type { SalesReportResponse, HealthSalesReport } from "@/types/report.types";
import {
  getSalesReportForGeneral,
  getSalesReportForHealth,
  type ReportFilterType
} from "@/services/report.service";

interface ReportState {
  generalReport: SalesReportResponse | null;
  healthReport: HealthSalesReport | null;
  loading: boolean;
  error: string | null;

  fetchGeneralReport: (filterType: ReportFilterType, startDate: string, endDate?: string) => Promise<void>;
  fetchHealthReport: (filterType: ReportFilterType, startDate: string, endDate?: string) => Promise<void>;

  clearReports: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  generalReport: null,
  healthReport: null,
  loading: false,
  error: null,

  fetchGeneralReport: async (filterType, startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const data = await getSalesReportForGeneral(filterType, startDate, endDate);
      set({ generalReport: data, loading: false });
    } catch (err: any) {
      console.error("Fetch general report error:", err);
      set({
        error: err.message || "Failed to fetch general sales report",
        loading: false
      });
    }
  },

  fetchHealthReport: async (filterType, startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const data = await getSalesReportForHealth(filterType, startDate, endDate);
      set({ healthReport: data, loading: false });
    } catch (err: any) {
      console.error("Fetch health report error:", err);
      set({
        error: err.message || "Failed to fetch health sales report",
        loading: false
      });
    }
  },

  clearReports: () => set({ generalReport: null, healthReport: null })
}));
