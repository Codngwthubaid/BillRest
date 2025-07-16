import CustomerPage from "@/components/contact/customerPage";
import SupportAndMasterContactPage from "@/components/contact/supportAndMasterPage";
import { useAuthStore } from "@/store/auth.store";

export default function ContactPage() {

    const { user } = useAuthStore();
    return (
        <>
            {(user?.role === "customer" || user?.role === "clinic") && <CustomerPage />}
            {(user?.role === "support" || user?.role === "master") && <SupportAndMasterContactPage />}
        </>
    )
}