import DashboardHeaderForCustomerPanel from "@/components/dashboard/DashboardHeaderForCustomerPanel";
import DashboardStatsForCustomerPanel from "@/components/dashboard/DashboardStatsForCustomerPanel";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import CustomerChart from "@/components/dashboard/CustomerChart";
import TopProducts from "@/components/dashboard/TopProducts";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import QuickActions from "./QuickActions";

export default function DashboardPageForCustomerPanel() {
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
    )
}