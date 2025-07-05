import InvoicePageForAdminPanel from "@/components/invoices/InvoicePageForAdminPanel";
import InvoicePageForCustomerPanel from "@/components/invoices/InvoicePageForCustomerPanel";
import { useAuthStore } from "@/store/auth.store";

export default function InvoicesPage() {

  const { user } = useAuthStore()

  return (
    <>
      {user?.role === "customer" && <InvoicePageForCustomerPanel />}
      {user?.role === "support" && <InvoicePageForAdminPanel />}
      {user?.role === "master" && <InvoicePageForAdminPanel />}
    </>
  )

}