import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import CustomerChart from "@/components/dashboard/CustomerChart";
import TopProducts from "@/components/dashboard/TopProducts";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import QuickActions from "@/components/dashboard/QuickActions";
import { useAuthStore } from "@/store/auth.store";


export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

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
      <DashboardHeader />
      <DashboardStats />
      {user?.role === "support" || user?.role === "master" ? null : <QuickActions />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInvoices />
        {user?.role === "support" || user?.role === "master" ? null : <TopProducts />}
        <CustomerChart />
        {user?.role === "support" || user?.role === "master" ? null : <TopProductsChart />}
      </div>
    </div>
  );
}
