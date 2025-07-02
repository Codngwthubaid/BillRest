import { useEffect, useState } from "react";
import {
  getInvoices,
  sendInvoiceOnWhatsApp,
  updateInvoice,
  deleteInvoice,
} from "@/services/invoice.service";
import { useInvoiceStore } from "@/store/invoice.store";
import { FileText, DollarSign, Clock, Calendar, Eye, Download, PenLine, Trash, Loader2, Printer, Share } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/types/invoice.types";
import CreateInvoiceDialog from "@/components/invoices/CreateInvoiceDialog";
import { DeleteInvoiceDialog } from "@/components/invoices/DeleteInvoiceDialog";
import { UpdateInvoiceDialog } from "@/components/invoices/UpdateInvoiceDialog";
import ProtectedPinDialog from "@/components/invoices/ProtectedPinDialog";
import ViewInvoiceSizeDialog from "@/components/invoices/ViewInvoiceSizeDialog";
import DownloadInvoiceDialog from "@/components/invoices/DownloadInvoiceDialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";


export default function InvoicesPage() {
  const { invoices, setInvoices } = useInvoiceStore();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [shareInvoice, setShareInvoice] = useState<Invoice | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [pinCallback, setPinCallback] = useState<() => void>(() => () => { });


  const askForPin = (callback: () => void) => {
    setPinCallback(() => callback);
    setShowPinDialog(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDialog(true);
  };

  const handleUpdateInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowUpdateDialog(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteDialog(true);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold animate-pulse text-blue-600">
          <Loader2 className="animate-spin size-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-gray-500">Manage your invoices and billing</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Create Invoice
        </Button>
        <CreateInvoiceDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
        <Card className="py-0">
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-blue-600">
              <FileText className="w-4 h-4" />
              <span>Total Invoices</span>
            </div>
            <span className="font-bold text-lg">{summary.total}</span>
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>Paid</span>
            </div>
            <span className="font-bold text-lg">{summary.paid}</span>
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-yellow-600">
              <Clock className="w-4 h-4" />
              <span>Pending</span>
            </div>
            <span className="font-bold text-lg">{summary.pending}</span>
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-red-600">
              <Calendar className="w-4 h-4" />
              <span>Overdue</span>
            </div>
            <span className="font-bold text-lg">{summary.overdue}</span>
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Draft</span>
            </div>
            <span className="font-bold text-lg">{summary.draft}</span>
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="p-4 text-sm flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-primary">
              <DollarSign className="w-4 h-4" />
              <span>Total Amount</span>
            </div>
            <span className="font-bold text-lg">₹{summary.totalAmount.toLocaleString()}</span>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Input
          placeholder="Search invoices by invoice ID orr customer name..."
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
                {/* <td className="flex gap-2 p-2 mt-5 flex-wrap">
                  <button onClick={() => handleViewInvoice(invoice)}>
                    <Eye className="w-4 h-4 text-primary hover:scale-110 cursor-pointer" />
                  </button>

                  <button onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowDownloadDialog(true);
                  }}>
                    <Download className="w-4 h-4 text-green-600 hover:scale-110" />
                  </button>

                  <button onClick={() => sendInvoiceOnWhatsApp(invoice._id!)}>
                    <Send className="w-4 h-4 text-purple-600 hover:scale-110" />
                  </button>

                  <button onClick={() => {
                    setPrintInvoice(invoice);
                    setShowPrintDialog(true);
                  }}>
                    <Printer className="w-4 h-4 text-orange-600 hover:scale-110" />
                  </button>

                  <button onClick={() =>
                    askForPin(() => handleUpdateInvoice(invoice))
                  }>
                    <PenLine className="w-4 h-4 text-emerald-600 hover:scale-110" />
                  </button>

                  <button onClick={() =>
                    askForPin(() => handleDeleteInvoice(invoice))
                  }>
                    <Trash className="w-4 h-4 text-red-600 hover:scale-110" />
                  </button>


                </td> */}

                <td className="flex gap-2 p-2 mt-5 flex-wrap">
                  <button onClick={() => handleViewInvoice(invoice)}>
                    <Eye className="w-4 h-4 text-primary hover:scale-110 cursor-pointer" />
                  </button>

                  <button onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowDownloadDialog(true);
                  }}>
                    <Download className="w-4 h-4 text-green-600 hover:scale-110" />
                  </button>

                  <button onClick={() => {
                    setPrintInvoice(invoice);
                    setShowPrintDialog(true);
                  }}>
                    <Printer className="w-4 h-4 text-orange-600 hover:scale-110" />
                  </button>

                  <button onClick={() => {
                    setShareInvoice(invoice);
                    setShowShareDialog(true);
                  }}>
                    <Share className="w-4 h-4 text-teal-600 hover:scale-110" />
                  </button>

                  <button onClick={() => askForPin(() => handleUpdateInvoice(invoice))}>
                    <PenLine className="w-4 h-4 text-emerald-600 hover:scale-110" />
                  </button>

                  <button onClick={() => askForPin(() => handleDeleteInvoice(invoice))}>
                    <Trash className="w-4 h-4 text-red-600 hover:scale-110" />
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

      <UpdateInvoiceDialog
        open={showUpdateDialog}
        invoice={selectedInvoice}
        onClose={() => setShowUpdateDialog(false)}
        onUpdate={async (id, updatedFields) => {
          console.log(id, updatedFields)
          // Map products to include 'name' if missing
          const mappedFields = {
            ...updatedFields,
            products: updatedFields.products?.map((p: any) => ({
              name: p.name ?? "",
              quantity: p.quantity,
              price: p.price,
              gstRate: p.gstRate,
              ...p,
            })),
          };
          await updateInvoice(id, mappedFields);
          const data = await getInvoices();
          setInvoices(data);
        }}
      />

      <DeleteInvoiceDialog
        open={showDeleteDialog}
        invoiceNumber={selectedInvoice?.invoiceNumber || ""}
        onClose={() => setShowDeleteDialog(false)}
        onConfirmDelete={async () => {
          if (!selectedInvoice || !selectedInvoice._id) return;
          await deleteInvoice(selectedInvoice._id);
          const data = await getInvoices();
          setInvoices(data);
          setShowDeleteDialog(false);
        }}
      />

      <ProtectedPinDialog
        open={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onVerified={() => {
          pinCallback();
        }}
      />

      <DownloadInvoiceDialog
        open={showDownloadDialog}
        invoice={selectedInvoice}
        onClose={() => setShowDownloadDialog(false)}
      />

      <ViewInvoiceSizeDialog
        open={showPrintDialog}
        invoice={printInvoice}
        onClose={() => setShowPrintDialog(false)}
      />

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button onClick={() => {
              sendInvoiceOnWhatsApp(shareInvoice?._id ?? "");
              setShowShareDialog(false);
            }} className="bg-green-600 hover:bg-green-700 w-full">
              Share on WhatsApp
            </Button>
            <Button onClick={() => alert("Email feature coming soon")} className="w-full">
              Share via Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
