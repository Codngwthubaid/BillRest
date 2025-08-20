import { useAuthStore } from "@/store/auth.store";
import { ChartSplineIcon, FileTerminal, FileText, ListOrdered, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuickActions() {

    const { user } = useAuthStore();

    return (
        <div className="rounded-lg shadow-sm border bg-card p-6">
            <h2 className="text-lg font-semibold  mb-4">Quick Actions</h2>
            <div className="flex justify-between items-center flex-wrap gap-4">
                <Link to={`${user?.role === "clinic" ? "/appointments" : "/invoices"}`}>
                    <button className="flex items-center justify-center space-x-3 p-4 rounded-lg transition-colors border hover:bg-white w-full cursor-pointer">
                        {user?.role === "customer" && (
                            <>
                                <FileText className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-700">Create Invoice</span>

                            </>
                        )}
                        {user?.role === "clinic" && (
                            <>
                                <FileTerminal className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-700">Create Appointment</span>
                            </>
                        )}
                    </button>
                </Link>
                <Link to={`${user?.role === "clinic" ? "/services" : "/products"}`}>
                    <button className="flex items-center justify-center space-x-3 p-4 rounded-lg transition-colors border hover:bg-white w-full cursor-pointer">
                        {user?.role === "customer" && (
                            <>
                                <Package className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-blue-700">Create Product</span>

                            </>
                        )}
                        {user?.role === "clinic" && (
                            <>
                                <ListOrdered className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-blue-700">Create Services</span>
                            </>
                        )}
                    </button>
                </Link>
                <Link to={"/reports"}>
                    <button className="flex items-center justify-center space-x-3 p-4 rounded-lg transition-colors border hover:bg-white w-full cursor-pointer">
                        <ChartSplineIcon className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-700">View Reports</span>
                    </button>
                </Link>
            </div>
        </div>
    )
}