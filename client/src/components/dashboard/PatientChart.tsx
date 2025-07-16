import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useReportStore } from "@/store/report.store";
import { usePatientStore } from "@/store/patient.store";
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

export default function PatientChart() {
  const { user } = useAuthStore();
  const role = user?.role;

  const { healthReport, fetchHealthReport } = useReportStore();
  const { patients, fetchPatients } = usePatientStore();

  useEffect(() => {
    if (role === "support" || role === "master") {
      fetchPatients();
    } else {
      fetchHealthReport("weekly", new Date().toISOString().split("T")[0]);
    }
  }, [role, fetchPatients, fetchHealthReport]);

  let chartLabels: string[] = [];
  let chartValues: number[] = [];

  if (role === "support" || role === "master") {
    // 📈 Use patients with dates
    const dataByDay = patients.reduce((acc, item) => {
      const dateStr = item.createdAt;
      if (!dateStr) return acc;

      const day = new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      if (!acc[day]) acc[day] = 0;
      acc[day] += 1;

      return acc;
    }, {} as Record<string, number>);

    const sortedDays = Object.keys(dataByDay).sort((a, b) => {
      const [dayA, monthA] = a.split(" ");
      const [dayB, monthB] = b.split(" ");
      const dateA = new Date(`${dayA} ${monthA} 2025`);
      const dateB = new Date(`${dayB} ${monthB} 2025`);
      return dateA.getTime() - dateB.getTime();
    });

    chartLabels = sortedDays;
    chartValues = sortedDays.map(day => dataByDay[day]);
  } else {
    // 🏥 Use healthReport topPatients
    const topPatients = healthReport?.topPatients || [];
    chartLabels = topPatients.map((p) => p.name || "Unknown");
    chartValues = topPatients.map((p) => p.visits || 0);
  }

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: role === "support" || role === "master" ? "New Patients" : "Patient Visits",
        data: chartValues,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
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
        <CardTitle className="text-lg font-semibold">
          {role === "support" || role === "master"
            ? "New Patients Over Time"
            : "Top Patients by Visits"}
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
