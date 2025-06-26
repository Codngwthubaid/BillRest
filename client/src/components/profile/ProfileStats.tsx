import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductStore } from "@/store/product.store";
import { useReportStore } from "@/store/report.store";
import { format } from "date-fns";
import { currencySymbolMap } from "@/lib/currencyMap";

export default function ProfileStats() {
    const { products, fetchProducts } = useProductStore();
    const { data: reportData, fetchReport, loading } = useReportStore();
    const [currency, setCurrency] = useState("INR");

    useEffect(() => {
        fetchProducts();
        fetchReport("monthly", new Date().toISOString().split("T")[0]);
    }, []);

    useEffect(() => {
        if (reportData?.invoices?.[0]) {
            const firstInvoice = reportData.invoices[0];
            setCurrency(firstInvoice.currency || "INR");
        }
    }, [reportData]);

    const symbol = currencySymbolMap[currency] || "";

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* QUICK STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="flex flex-row items-center justify-between w-[90vw] sm:w-full">
                    <CardHeader>
                        <CardTitle>Total Invoices</CardTitle>
                    </CardHeader>
                    <CardContent className="text-base font-bold">
                        {reportData?.count || 0}
                    </CardContent>
                </Card>
                <Card className="flex flex-row items-center justify-between w-[90vw] sm:w-full">
                    <CardHeader>
                        <CardTitle>Total Products</CardTitle>
                    </CardHeader>
                    <CardContent className="text-base font-bold">
                        {products.length}
                    </CardContent>
                </Card>
                <Card className="flex flex-row items-center justify-between w-[90vw] sm:w-full">
                    <CardHeader>
                        <CardTitle>Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="text-base font-bold">
                        {symbol} {reportData?.totalSales?.toFixed(2) || "0.00"}
                    </CardContent>
                </Card>
            </div>

            {/* RECENT INVOICES */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Recent Invoices</h2>
                <div className="grid gap-4">
                    {reportData?.invoices?.slice(0, 3).map((invoice) => (
                        <Card key={invoice._id}>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-md font-semibold">{invoice.invoiceNumber}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(invoice.createdAt), "dd MMM yyyy")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-md font-semibold">
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
                            </CardContent>
                        </Card>
                    ))}

                    {!reportData?.invoices?.length && (
                        <p className="text-muted-foreground text-sm">
                            No invoices found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
