import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import { useAuthStore } from "@/store/auth.store";

export default function Dashboard() {
  const { user } = useAuthStore();

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
      <QuickActions />
    </div>
  );
}




