import ReportsForGeneral from "@/components/reports/ReportsForGeneral";
import ReportsForHealth from "@/components/reports/ReportsForHealth";
import { useAuthStore } from "@/store/auth.store";
export default function ReportPage() {
    const { user } = useAuthStore()
    console.log(user?.email)
    return (
        <>
            {(user?.role === "customer" || user?.role === "support" || user?.role === "master") && <ReportsForGeneral/>}
            {user?.role === "clinic" && <ReportsForHealth />}
        </>
    )
};
