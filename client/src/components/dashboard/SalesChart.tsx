import { useEffect } from "react";
import { useReportStore } from "@/store/report.store";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function SalesChart() {
  const { data, fetchReport } = useReportStore();

  useEffect(() => {
    fetchReport("daily", new Date().toISOString().split("T")[0]);
  }, [fetchReport]);

  // Group invoices by day
  const salesByDay = (data?.invoices || []).reduce((acc, invoice) => {
    const day = new Date(invoice.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    if (!acc[day]) acc[day] = 0;
    acc[day] += invoice.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const chartLabels = Object.keys(salesByDay);
  const chartValues = Object.values(salesByDay);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Sales",
        data: chartValues,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value:any) => `₹${value}`,
          color: "#6b7280",
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#6b7280" },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  return (
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader className="border-b pt-6 pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Sales Over Time (Daily)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-72 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
