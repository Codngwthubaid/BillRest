import { useAuthStore } from "@/store/auth.store";
import { useReportStore } from "@/store/report.store";
import { IndianRupee , FileText, Package } from "lucide-react";
import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";

export default function DashboardStats() {
  const { data, fetchReport } = useReportStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchReport("monthly", new Date().toISOString().split("T")[0]);
  }, [fetchReport]);

  const dashboardStats = [
    {
      title: "Total Sales",
      value: `₹${data?.totalSales?.toFixed(2) || "0.00"}`,
      icon: IndianRupee ,
      color: "bg-green-500",
      roles: ["master", "customer"],
    },
    {
      title: "Invoices",
      value: data?.count || 0,
      icon: FileText,
      color: "bg-blue-500",
      roles: ["master", "customer", "support"],
    },
    {
      title: "Top Products",
      value: data?.topProducts?.length || 0,
      icon: Package,
      color: "bg-purple-500",
      roles: ["master", "customer"],
    },
  ];

  const filteredStats = dashboardStats.filter((stat) =>
    user?.role && stat.roles.includes(user.role)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="rounded-lg shadow-sm"
          >
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
