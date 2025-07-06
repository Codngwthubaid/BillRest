import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import DashboardHeaderForCustomerPanel from "@/components/dashboard/DashboardHeader";
import DashboardStatsForCustomerPanel from "@/components/dashboard/DashboardStats";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import CustomerChart from "@/components/dashboard/CustomerChart";
import TopProducts from "@/components/dashboard/TopProducts";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import QuickActions from "@/components/dashboard/QuickActions";


export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold animate-pulse text-blue-600">
          <Loader2 className="animate-spin size-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-10 mx-auto max-w-7xl">
      <DashboardHeaderForCustomerPanel />
      <DashboardStatsForCustomerPanel />
      <QuickActions />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInvoices />
        <TopProducts />
        <CustomerChart />
        <TopProductsChart />
      </div>
    </div>
  );
}
