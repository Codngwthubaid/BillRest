import { useAuthStore } from "@/store/auth.store";
import { useReportStore } from "@/store/report.store";
import { useCustomerStore } from "@/store/customers.store";
import { useInvoiceStore } from "@/store/invoice.store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

export default function RecentInvoices() {
  const { user } = useAuthStore();
  const role = user?.role;

  const { generalReport: customerInvoices } = useReportStore();
  const { fetchAllCustomers } = useCustomerStore();
  const { allInvoices, fetchAllInvoices } = useInvoiceStore();

  // Fetch for support / master on mount
  useEffect(() => {
    if (role === "support" || role === "master") {
      fetchAllCustomers();
      fetchAllInvoices();
    }
  }, [role, fetchAllCustomers, fetchAllInvoices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // decide data source
  const invoicesToShow =
    role === "support" || role === "master"
      ? allInvoices?.invoices?.slice(0, 4)
      : customerInvoices?.invoices?.slice(0, 4);

  return (
    <Card className="rounded-lg shadow-sm border">
      <CardHeader className="border-b pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
          <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          {invoicesToShow?.map((invoice) => (
            <div key={invoice._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{invoice.invoiceNumber}</p>
                  <p className="text-sm">
                    {format(new Date(invoice.createdAt ?? ""), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{invoice.totalAmount.toFixed(2)}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}
                >
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
          {!invoicesToShow?.length && (
            <p className="text-sm">No invoices found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

