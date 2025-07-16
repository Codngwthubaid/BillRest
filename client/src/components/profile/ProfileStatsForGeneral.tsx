import { currencySymbolMap } from "@/lib/currencyMap";
import { useProductStore } from "@/store/product.store";
import { useReportStore } from "@/store/report.store";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { IndianRupee , FileText, Package } from "lucide-react";

export default function ProfileStatsForGeneral() {
    const { products, fetchProducts } = useProductStore();
    const {  generalReport: reportData , fetchGeneralReport : fetchReport, loading } = useReportStore();
    const [currency, setCurrency] = useState("INR");

    useEffect(() => {
        fetchProducts();
        fetchReport("monthly", new Date().toISOString().split("T")[0]);
    }, [fetchProducts, fetchReport]);

    useEffect(() => {
        if (reportData?.invoices?.[0]) {
            const firstInvoice = reportData.invoices[0];
            setCurrency(firstInvoice.currency || "INR");
        }
    }, [reportData]);

    const symbol = currencySymbolMap[currency] || "";

    if (loading) {
        return (
            <div className="space-y-6">
                <Card className="rounded-lg shadow-sm ">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold ">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full rounded-lg" />
                        ))}
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-lg shadow-sm ">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold ">Recent Invoices</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stats = [
        {
            label: "Total Invoices",
            value: reportData?.count || 0,
            icon: FileText,
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Total Products",
            value: products.length,
            icon: Package,
            color: "bg-green-100 text-green-600",
        },
        {
            label: "Total Sales",
            value: `${symbol} ${reportData?.totalSales?.toFixed(2) || "0.00"}`,
            icon: IndianRupee ,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <div className="space-y-6">
            <Card className="pt-6 rounded-lg shadow-sm ">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold ">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                    <div className="space-y-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{stat.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold ">{stat.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
            <Card className="pt-6 rounded-lg shadow-sm ">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold ">Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                    <div className="space-y-4">
                        {reportData?.invoices?.slice(0, 5).map((invoice) => (
                            <div key={invoice._id} className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium ">
                                        Created invoice {invoice.invoiceNumber}
                                    </p>
                                    <p className="text-sm">
                                        {format(new Date(invoice.createdAt), "dd MMM yyyy, HH:mm")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold ">
                                        {symbol} {invoice.totalAmount.toFixed(2)}
                                    </p>
                                    <p
                                        className={`text-xs font-medium ${invoice.status === "paid"
                                            ? "text-green-600"
                                            : invoice.status === "pending"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {invoice.status.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {!reportData?.invoices?.length && (
                            <p className="text-sm">No invoices found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}