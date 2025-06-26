import { useEffect, useState } from "react";
import {
  getInvoices,
  downloadInvoicePDF,
  sendInvoiceOnWhatsApp,
} from "@/services/invoice.service";
import { useInvoiceStore } from "@/store/invoice.store";
import { FileText, DollarSign, Clock, Calendar, Trash2, Eye, Send, Download, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function InvoicesPage() {
  const { invoices, setInvoices } = useInvoiceStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const data = await getInvoices();
      setInvoices(data);
    };
    fetch();
  }, [setInvoices]);

  const filtered = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  const summary = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "pending").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
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
          <Button>+ Create Invoice</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        <Card><CardContent className="p-4"><FileText /> Total: {summary.total}</CardContent></Card>
        <Card><CardContent className="p-4 text-green-600"><DollarSign /> Paid: {summary.paid}</CardContent></Card>
        <Card><CardContent className="p-4 text-yellow-600"><Clock /> Pending: {summary.pending}</CardContent></Card>
        <Card><CardContent className="p-4 text-red-600"><Calendar /> Overdue: {summary.overdue}</CardContent></Card>
        <Card><CardContent className="p-4"><DollarSign /> ₹{summary.totalAmount.toLocaleString()}</CardContent></Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Input
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-md"
        />
      </div>

      {/* Invoices Table */}
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
                <td className="flex gap-2 p-2">
                  <Link to={`/invoices/view/${invoice._id}`}>
                    <Eye className="w-4 h-4 text-primary hover:scale-110 cursor-pointer" />
                  </Link>
                  <button onClick={() => downloadInvoicePDF(invoice._id!)}>
                    <Download className="w-4 h-4 text-green-600 hover:scale-110" />
                  </button>
                  <button onClick={() => sendInvoiceOnWhatsApp(invoice._id!)}>
                    <Send className="w-4 h-4 text-purple-600 hover:scale-110" />
                  </button>
                  <Link to={`/invoices/edit/${invoice._id}`}>
                    <Edit className="w-4 h-4 text-blue-600 hover:scale-110" />
                  </Link>
                  <button>
                    <Trash2 className="w-4 h-4 text-red-600 hover:scale-110" />
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
    </div>
  );
}
