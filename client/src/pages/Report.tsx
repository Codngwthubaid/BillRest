import ReportsForGeneral from "@/components/reports/ReportsForGeneral";
import ReportsForHealth from "@/components/reports/ReportsForHealth";
import { useAuthStore } from "@/store/auth.store";
export default function ReportPage() {
    const { user } = useAuthStore()
    return (
        <>
            {user?.role === "customer" && <ReportsForGeneral/>}
            {user?.role === "clinic" && <ReportsForHealth />}
        </>
    )
};
