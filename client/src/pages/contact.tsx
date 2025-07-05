import { useAuthStore } from "@/store/auth.store"
import ContactPageForAdminPanel from "@/components/contact/ContactPageForAdminPanel"
import ContactPageForSupportPanel from "@/components/contact/ContactPageForSupportPanel"
import ContactPageForCustomerPanel from "@/components/contact/ContactPageForCustomerPanel"

export default function ContactPage() {
    const { user } = useAuthStore();
    return (
        <>
            {user?.role === "customer" && <ContactPageForCustomerPanel />}
            {user?.role === "support" && <ContactPageForSupportPanel />}
            {user?.role === "master" && <ContactPageForAdminPanel />}
        </>
    )
}