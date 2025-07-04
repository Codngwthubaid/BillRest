import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import TopProductsChart from "@/components/dashboard/TopProductsChart";

export default function DashboardPageForCustomerPanel() {
    return (
        <div className="space-y-6 px-4 py-10 mx-auto max-w-7xl">
            <DashboardHeader />
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentInvoices />
                <TopProducts />
                <SalesChart />
                <TopProductsChart />
            </div>
        </div>
    )
}