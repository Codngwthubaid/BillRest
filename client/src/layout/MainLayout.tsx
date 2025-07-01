import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ModeToggle } from "@/components/mode-toggle";
import WhatsAppButton from "@/components/whatsappButton";

const MainLayout = () => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <AppSidebar />
                <main className="flex-1 p-4">
                    <div className="flex justify-between items-center">
                        <SidebarTrigger />
                        <div className="flex gap-x-5">
                            <WhatsAppButton />
                            <ModeToggle />
                        </div>
                    </div>
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;
