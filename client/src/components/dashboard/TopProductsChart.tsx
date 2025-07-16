import { useEffect } from "react";
import { useReportStore } from "@/store/report.store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function TopProductsChart() {
  const { generalReport: data, fetchGeneralReport: fetchReport } = useReportStore();

  useEffect(() => {
    fetchReport("monthly", new Date().toISOString().split("T")[0]);
  }, [fetchReport]);

  const COLORS = ["#34d399", "#60a5fa", "#f87171", "#facc15", "#a78bfa"];

  const productData = data?.topProducts || [];

  const chartData = {
    labels: productData.map((item) => item.name),
    datasets: [
      {
        label: "Sales",
        data: productData.map((item) => item.totalSales),
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
          Top Products Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
