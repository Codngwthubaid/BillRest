import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCustomerStore } from "@/store/customers.store";
import { useBusinessStore } from "@/store/business.store";
import { useInvoiceStore } from "@/store/invoice.store";
import { useSupportStore } from "@/store/support.store";
import { useReportStore } from "@/store/report.store";
import { IndianRupee, FileText, Package, StoreIcon, UserRoundCheck, HelpCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function DashboardStats() {
  const { user } = useAuthStore();
  const { data, fetchReport } = useReportStore();
  const { allCustomers, fetchAllCustomers } = useCustomerStore();
  const { businesses, fetchAllBusinesses } = useBusinessStore();
  const { allInvoices, fetchAllInvoices } = useInvoiceStore();
  const { tickets, fetchTickets } = useSupportStore();

  console.log("All Invoices :", allInvoices);

  useEffect(() => {
    fetchReport("monthly", new Date().toISOString().split("T")[0]);
    fetchAllCustomers();
    fetchAllBusinesses();
    fetchAllInvoices();
    fetchTickets();
  }, [fetchReport, fetchAllCustomers, fetchAllBusinesses, fetchAllInvoices, fetchTickets]);

  let dashboardStats = [];

  if (user?.role === "support") {
    dashboardStats = [
      {
        title: "Total Invoices",
        value: allInvoices?.count || 0,
        icon: FileText,
        color: "bg-blue-500",
      },
      {
        title: "Total Businesses",
        value: businesses.length || 0,
        icon: StoreIcon,
        color: "bg-green-500",
      },
      {
        title: "Total Customers",
        value: allCustomers?.length || 0,
        icon: UserRoundCheck,
        color: "bg-purple-500",
      },
    ];
  } else if (user?.role === "master") {
    dashboardStats = [
      {
        title: "Total Businesses",
        value: businesses ? 1 : 0,
        icon: StoreIcon,
        color: "bg-green-500",
      },
      {
        title: "Total Queries",
        value: tickets?.length || 0,
        icon: HelpCircle,
        color: "bg-red-500",
      },
      {
        title: "Total Customers",
        value: allCustomers?.length || 0,
        icon: UserRoundCheck,
        color: "bg-purple-500",
      },
    ];
  } else {
    // customer by default
    dashboardStats = [
      {
        title: "Total Sales",
        value: `₹${data?.totalSales?.toFixed(2) || "0.00"}`,
        icon: IndianRupee,
        color: "bg-green-500",
        roles: ["customer"],
      },
      {
        title: "Invoices",
        value: data?.count || 0,
        icon: FileText,
        color: "bg-blue-500",
        roles: ["customer"],
      },
      {
        title: "Top Products",
        value: data?.topProducts?.length || 0,
        icon: Package,
        color: "bg-purple-500",
        roles: ["customer"],
      },
    ];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboardStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="rounded-lg shadow-sm">
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
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
