import { useEffect } from "react";
import { useReportStore } from "@/store/report.store";
import { useServiceStore } from "@/store/service.store";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TopServicesChart() {
  const { healthReport, fetchHealthReport } = useReportStore();
  const { allServices, fetchAllServices } = useServiceStore();
  const { user } = useAuthStore();
  const role = user?.role;

  useEffect(() => {
    if (role === "support" || role === "master") {
      fetchAllServices();
    } else {
      fetchHealthReport("monthly", new Date().toISOString().split("T")[0]);
    }
  }, [role, fetchAllServices, fetchHealthReport]);

  const COLORS = ["#34d399", "#60a5fa", "#f87171", "#facc15", "#a78bfa"];

  // Determine source of chart data
  const serviceData =
    role === "support" || role === "master"
      ? allServices?.services?.slice(0, 5) || []
      : healthReport?.topServices?.slice(0, 5) || [];

  const chartData = {
    labels: serviceData.map((item) => item.name),
    datasets: [
      {
        label: "Sales",
        data: serviceData.map((item) => item.totalSales),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `₹${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <Card className="rounded-lg shadow-sm border">
      <CardHeader className="border-b pt-6">
        <CardTitle className="text-lg font-semibold">
          Top Services Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          {serviceData.length > 0 ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <p className="text-sm text-gray-500">No data available for chart.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
