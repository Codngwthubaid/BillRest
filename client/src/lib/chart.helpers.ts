import type { ReportFilterType } from "@/services/report.service";

interface RevenueDataPoint {
  period: string;
  revenue: number;
  profit: number;
  color: string;
}

export const transformRevenueChartData = (
  invoices: any[],
  filterType: ReportFilterType
): RevenueDataPoint[] => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  return invoices.map((invoice, index) => {
    const date = new Date(invoice.createdAt);
    let period = '';

    switch (filterType) {
      case 'daily':
        period = date.toLocaleDateString('en-US', { weekday: 'short' });
        break;
      case 'weekly':
        period = `W${Math.ceil(date.getDate() / 7)}`;
        break;
      case 'monthly':
        period = date.toLocaleDateString('en-US', { month: 'short' });
        break;
      default:
        period = date.toLocaleDateString();
    }

    return {
      period,
      revenue: invoice.totalAmount,
      profit: Math.floor(invoice.totalAmount * 0.2), // assume 20% profit for now
      color: colors[index % colors.length],
    };
  });
};
