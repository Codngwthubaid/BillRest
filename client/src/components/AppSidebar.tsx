import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useSubscriptionStore } from "@/store/subscription.store";
import { useEffect } from "react";
import { items } from "@/constants/index";
import { LogOut } from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { currentSubscription, fetchUserSubscription } = useSubscriptionStore();

  useEffect(() => {
    fetchUserSubscription();
  }, [fetchUserSubscription]);

  const isSubscribed = currentSubscription?.status === "active";

  let menuItems = [];
  if (user?.role === "customer") {
    menuItems = items.sidebarOfCustomer;
  } else if (user?.role === "clinic" && currentSubscription?.plan?.role === "Hospital") {
    menuItems = items.sidebarOfHealthForHospital;
  } else if (user?.role === "clinic" && currentSubscription?.plan?.role === "Clinic") {
    menuItems = items.sidebarOfHealthForClinic;
  } else if (user?.role === "support") {
    menuItems = items.sidebarOfSupport;
  } else if (user?.role === "master") {
    menuItems = items.sidebarOfAdmin;
  } else {
    menuItems = items.sidebarOfCustomer;
  }

  return (
    <Sidebar className="w-64 h-screen fixed top-0 left-0 border-r bg-white shadow-lg">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold my-6 flex items-center">
            <img src="/Billrest_20250626_235033_0006.png" className="bg-transparent" alt="Billrest Logo" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isDisabled =
                  user?.role === "customer" && !isSubscribed && item.href !== "/plans";

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                        location.pathname === item.href && "bg-blue-100 text-blue-600",
                        isDisabled && "opacity-50 pointer-events-none cursor-not-allowed"
                      )}
                    >
                      <Link to={item.href}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 py-2 border-t mt-auto">
          <Link to="/profile">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                {user?.name?.charAt(0) || "?"}
              </span>
              <div>
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
            </div>
          </Link>
          <div
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
