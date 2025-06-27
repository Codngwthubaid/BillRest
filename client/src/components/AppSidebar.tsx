import {
  ChartColumn,
  FileText,
  Home,
  ShoppingBag,
  User,
  LogOut,
  HelpCircle,
  Mail
} from "lucide-react";
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

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "Products",
    href: "/products",
    icon: ShoppingBag,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: ChartColumn,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore()

  return (
    <Sidebar className="w-64 h-screen fixed top-0 left-0 border-r bg-white shadow-lg">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold my-6 flex items-center">
            <span className="rounded p-1 mr-2 text-3xl text-blue-500">BillRest</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                      location.pathname === item.href && "bg-blue-100 text-blue-600"
                    )}
                  >
                    <Link to={item.href} className="flex items-center w-full py-5">
                      <item.icon className="w-5 h-5" />
                      <span className="text-base">{item.title}</span>
                      <span className="ml-auto text-xs text-gray-400">{item.title[0]}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
          <div onClick={logout} className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}