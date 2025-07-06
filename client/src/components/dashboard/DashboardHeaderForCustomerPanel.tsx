import { useAuthStore } from "@/store/auth.store";
import { Calendar } from "lucide-react";

export default function DashboardHeaderForCustomerPanel() {

  const { user } = useAuthStore();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p>
          Here's what's happening with your business today.
        </p>
        {/* {
          user?.role === "support" && <p>
            Check the detailings for the listed businesses. 
          </p>
        }
        {
          user?.role === "master" && <p>
            Check the detailings for the listed businesses and customers.
          </p>
        } */}
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <Calendar className="w-4 h-4" />
        <span>{new Date().toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</span>
      </div>
    </div>
  );
}