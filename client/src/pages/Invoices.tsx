import { useEffect, useState } from "react";
import {
  getInvoices,
  downloadInvoicePDF,
  sendInvoiceOnWhatsApp,
} from "@/services/invoice.service";
import { useInvoiceStore } from "@/store/invoice.store";
import { FileText, DollarSign, Clock, Calendar, Eye, Send, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getInvoiceById } from "@/services/invoice.service";
import type { Invoice } from "@/types/invoice.types";

export default function InvoicesPage() {
  const { invoices, setInvoices } = useInvoiceStore();
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleViewInvoice = async (id: string) => {
    const data = await getInvoiceById(id);
    setSelectedInvoice(data);
    setShowDialog(true);
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await getInvoices();
      setInvoices(data);
    };
    fetch();
  }, [setInvoices]);

  const filtered = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const summary = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "pending").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    draft: invoices.filter((i) => i.status === "draft").length,
    totalAmount: invoices.reduce((acc, i) => acc + i.totalAmount, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-gray-500">Manage your invoices and billing</p>
        </div>
        <Link to="/invoices/create">
          <Button className="bg-green-600 hover:bg-green-700">+ Create Invoice</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-blue-600">
              <FileText className="w-4 h-4" />
              <span>Total Invoices</span>
            </div>
            <span className="font-bold text-base">{summary.total}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>Paid</span>
            </div>
            <span className="font-bold text-base">{summary.paid}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-yellow-600">
              <Clock className="w-4 h-4" />
              <span>Pending</span>
            </div>
            <span className="font-bold text-base">{summary.pending}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-red-600">
              <Calendar className="w-4 h-4" />
              <span>Overdue</span>
            </div>
            <span className="font-bold text-base">{summary.overdue}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Draft</span>
            </div>
            <span className="font-bold text-base">{summary.draft}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-primary">
              <DollarSign className="w-4 h-4" />
              <span>Total Amount</span>
            </div>
            <span className="font-bold text-base">₹{summary.totalAmount.toLocaleString()}</span>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Input
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-gray-600 text-left">
            <tr>
              <th className="p-4">Invoice</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((invoice) => (
              <tr key={invoice._id} className="border-t hover:bg-muted/30">
                <td className="p-4">
                  <div className="font-medium text-blue-600">{invoice.invoiceNumber}</div>
                  <div className="text-xs text-muted-foreground">{invoice.createdAt?.slice(0, 10)}</div>
                </td>
                <td>
                  <div>{invoice.customerName}</div>
                  <div className="text-xs text-muted-foreground">{invoice.phoneNumber}</div>
                </td>
                <td>
                  ₹{invoice.totalAmount.toLocaleString()}<br />
                  <span className="text-xs text-muted-foreground">Tax: ₹{invoice.gstAmount}</span>
                </td>
                <td>{getStatusBadge(invoice.status)}</td>
                <td>{invoice.createdAt?.slice(0, 10)}</td>
                <td className="flex gap-2 p-2 mt-5">
                  <button onClick={() => handleViewInvoice(invoice._id!)}>
                    <Eye className="w-4 h-4 text-primary hover:scale-110 cursor-pointer" />
                  </button>
                  <button
                    onClick={async () => {
                      const blob = await downloadInvoicePDF(invoice._id!);
                      if (!blob) return;

                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${invoice.invoiceNumber}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-4 h-4 text-green-600 hover:scale-110" />
                  </button>
                  {/* this feature is pending */}
                  <button onClick={() => sendInvoiceOnWhatsApp(invoice._id!)}>
                    <Send className="w-4 h-4 text-purple-600 hover:scale-110" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-muted-foreground">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>

          {selectedInvoice ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="text-lg font-semibold">{selectedInvoice.invoiceNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedInvoice.customerName}</p>
                  <p className="text-sm">{selectedInvoice.phoneNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p>{selectedInvoice.paymentMethod}</p>
                  <p>Status: {getStatusBadge(selectedInvoice.status)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Products</p>
                <ul className="space-y-2">
                  {selectedInvoice.products.map((p, idx) => (
                    <li key={idx} className="text-sm border rounded p-2 flex justify-between items-center">
                      <span>{typeof p.product === "string" ? p.product : p.product.name}</span>
                      <span>{p.quantity} x ₹{p.price} + {p.gstRate}% GST</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4">
                <p>Subtotal: ₹{selectedInvoice.subTotal.toFixed(2)}</p>
                <p>GST: ₹{selectedInvoice.gstAmount.toFixed(2)}</p>
                <p className="font-bold">Total: ₹{selectedInvoice.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
