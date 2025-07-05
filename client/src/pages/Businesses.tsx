import { useAuthStore } from "@/store/auth.store"
import BusinessesPageForAdminPanel from "@/components/businesses/BusinessesPageForAdminPanel"
import BusinessesPageForCustomerPane from "@/components/businesses/BusinessesPageForCustomerPanel"
import BusinessesPageForSupportPanel from "@/components/businesses/BusinessesPageForSupportPanel"

export default function Businesses() {
    const { user } = useAuthStore()
    return (
        <>
            {user?.role === "customer" && <BusinessesPageForCustomerPane />}
            {user?.role === "support" && <BusinessesPageForSupportPanel />}
            {user?.role === "master" && <BusinessesPageForAdminPanel />}
        </>
    )
}