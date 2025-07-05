import { useAuthStore } from "@/store/auth.store"
import ReportPageForAdminPanel from "@/components/reports/ReportPageForAdminPanel"
import ReportPageForCustomerPanel from "@/components/reports/ReportPageForCustomerPanel"

export default function ReportPage() {

    const { user } = useAuthStore()

    return (
        <>
            {user?.role === "customer" && <ReportPageForCustomerPanel />}
            {user?.role === "master" && <ReportPageForAdminPanel />}
        </>
    )
}