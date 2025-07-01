import { create } from "zustand";
import type { SalesReportResponse } from "@/types/report.types";
import { getSalesReport, type ReportFilterType } from "@/services/report.service";

interface ReportState {
  data: SalesReportResponse | null;
  loading: boolean;
  fetchReport: (
    filterType: ReportFilterType,
    startDate: string,
    endDate?: string
  ) => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  data: null,
  loading: false,

  fetchReport: async (filterType, startDate, endDate) => {
    set({ loading: true });
    try {
      const response = await getSalesReport(filterType, startDate, endDate);
      set({ data: response });
    } catch (err) {
      console.error("Report fetching failed:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
