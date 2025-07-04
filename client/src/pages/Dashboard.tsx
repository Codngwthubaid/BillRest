import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";
import DashboardPageForCustomerPanel from "@/components/dashboard/DashboardPageForCustomerPanel";
import DashboardPageForSupportPanel from "@/components/dashboard/DashboardPageForSupportPanel";
import DashboardPageForAdminPanel from "@/components/dashboard/DashboardPageForAdminPanel";


export default function Dashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold animate-pulse text-blue-600">
          <Loader2 className="animate-spin size-12" />
        </div>
      </div>
    );
  }

  return (
    <>
      {user?.role === "customer" && <DashboardPageForCustomerPanel />}
      {user?.role === "support" && <DashboardPageForSupportPanel />}
      {user?.role === "master" && <DashboardPageForAdminPanel />}
    </>
  );
}
