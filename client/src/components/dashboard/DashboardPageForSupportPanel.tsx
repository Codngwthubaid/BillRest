import DashboardHeaderForSupportPanel from "./DashboardHeaderForsupportPanel";
import DashboardStatsForSupportPanel from "./DashboardStatsForSupportPanel";

export default function DashboardPageForSupportPanel() {
    return (
        <div className="space-y-6 px-4 py-10 mx-auto max-w-7xl">
            <DashboardHeaderForSupportPanel />
            <DashboardStatsForSupportPanel />
        </div>
    )
}