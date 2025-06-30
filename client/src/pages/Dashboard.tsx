import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
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
          <Loader2 className="animate-spin size-12"/>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-10 mx-auto max-w-7xl">
      <DashboardHeader />
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInvoices />
        {(user?.role === 'master' || user?.role === 'customer') && <TopProducts />}
        <SalesChart />
        <TopProductsChart />
      </div>
    </div>
  );
}
