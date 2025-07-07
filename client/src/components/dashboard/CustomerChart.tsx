import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useReportStore } from "@/store/report.store";
import { useCustomerStore } from "@/store/customers.store";
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

export default function CustomerChart() {
  const { user } = useAuthStore();
  const role = user?.role;

  const { data, fetchReport } = useReportStore();
  const { allCustomers, fetchAllCustomers } = useCustomerStore();

  useEffect(() => {
    if (role === "support" || role === "master") {
      fetchAllCustomers();
    } else {
      fetchReport("weekly", new Date().toISOString().split("T")[0]);
    }
  }, [role, fetchAllCustomers, fetchReport]);

  // ✅ Determine source
  const invoices = role === "customer" ? (data?.invoices || []) : [];
  const customers = role === "support" || role === "master" ? (allCustomers || []) : [];

  // ✅ Prepare data for chart
  const dataByDay = (role === "customer" ? invoices : customers).reduce((acc, item) => {
    const day = new Date(item.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    if (!acc[day]) acc[day] = 0;
    acc[day] += 1;
    return acc;
  }, {} as Record<string, number>);

  // ✅ Sort days
  const sortedDays = Object.keys(dataByDay).sort((a, b) => {
    const [dayA, monthA] = a.split(" ");
    const [dayB, monthB] = b.split(" ");
    const dateA = new Date(`${dayA} ${monthA} 2025`);
    const dateB = new Date(`${dayB} ${monthB} 2025`);
    return dateA.getTime() - dateB.getTime();
  });

  const chartLabels = sortedDays;
  const chartValues = sortedDays.map(day => dataByDay[day]);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: role === "customer" ? "Customers" : "New Customers",
        data: chartValues,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
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
        ticks: { color: "#6b7280" },
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
        <CardTitle className="text-lg font-semibold ">
          {role === "customer" ? "Customers Over Time (Weekly)" : "New Customers Over Time"}
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
