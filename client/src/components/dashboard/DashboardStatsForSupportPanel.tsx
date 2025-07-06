import { useEffect } from "react";
import { useCustomerStore } from "@/store/customers.store";
import { useBusinessStore } from "@/store/business.store";
import { useAuthStore } from "@/store/auth.store";
import { FileText, UserRoundCheck, StoreIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useInvoiceStore } from "@/store/invoice.store";

export default function DashboardStatsForSupportPanel() {
    const { invoices, fetchInvoices } = useInvoiceStore();
    const { customers, fetchCustomers } = useCustomerStore();
    const { business, fetchBusiness } = useBusinessStore();
    const { user } = useAuthStore();

    console

    useEffect(() => {
        fetchInvoices();
        fetchCustomers();
        fetchBusiness();
    }, [fetchInvoices, fetchCustomers, fetchBusiness]);

    const dashboardStats = [
        {
            title: "Invoices",
            value: Array.isArray(invoices) ? invoices.length : 0,
            icon: FileText,
            color: "bg-blue-500",
            roles: ["master", "customer", "support"],
        },
        {
            title: "Customers",
            value: Array.isArray(customers) ? customers.length : 0,
            icon: UserRoundCheck,
            color: "bg-pink-500",
            roles: ["master", "customer", "support"],
        },
        {
            title: "Businesses",
            value: Array.isArray(business) ? business.length : 0,
            icon: StoreIcon,
            color: "bg-yellow-500",
            roles: ["master", "support"],
        },
    ];

    const filteredStats = dashboardStats.filter((stat) =>
        user?.role && stat.roles.includes(user.role)
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="rounded-lg shadow-sm">
                        <CardContent>
                            <div className="flex items-center justify-between py-4">
                                <div>
                                    <p className="text-sm font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
