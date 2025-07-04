import CustomerPageForAdminPanel from "@/components/customer/CustomerPageForAdminPanel";
import CustomerPageForCustomerPanel from "@/components/customer/CustomerPageForCustomerPanel";
import CustomerPageForSupportPanel from "@/components/customer/CustomerPageForSupportPanel";
import { useAuthStore } from "@/store/auth.store";

export default function CustomerPage() {

  const { user } = useAuthStore()

  return (
    <>
      {user?.role === "customer" && <CustomerPageForCustomerPanel />}
      {user?.role === "support" && <CustomerPageForSupportPanel />}
      {user?.role === "master" && <CustomerPageForAdminPanel />}
    </>
  )
}
