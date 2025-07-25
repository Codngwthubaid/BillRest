import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getInvoices, sendInvoiceOnWhatsApp, updateInvoice, deleteInvoice } from "@/services/invoice.service";
import { useInvoiceStore } from "@/store/invoice.store";
import { FileText, IndianRupee, Clock, Calendar, Eye, Download, PenLine, Trash, Loader2, Printer, Share } from "lucide-react";
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
import InvoiceActionsDialog from "@/components/invoices/InvoiceActionsDialog";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import POSReceipt58mm from "@/components/invoices/POSReceipt58mm";
import POSReceipt80mm from "@/components/invoices/POSReceipt80mm";
import { useAuthStore } from "@/store/auth.store";

export default function InvoicesPage() {
    const { invoices, setInvoices, allInvoices, fetchAllInvoices } = useInvoiceStore();
    const { user } = useAuthStore();

    console.log("InvoicesPage rendered", allInvoices);

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
    const [previewType, setPreviewType] = useState<"A4" | "58mm" | "80mm">("A4");
    const [statusFilter, setStatusFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");



    const previewRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: previewRef });

    const data = user?.role === "customer" ? invoices : allInvoices?.invoices ?? [];
    const uniqueEmails = Array.from(new Set(data.map(inv => inv.user?.email).filter(Boolean)));


    console.log("Invoices data", allInvoices);

    const summary = {
        total: data.length,
        paid: data.filter(i => i.status === "paid").length,
        pending: data.filter(i => i.status === "pending").length,
        overdue: data.filter(i => i.status === "overdue").length,
        draft: data.filter(i => i.status === "draft").length,
        totalAmount: data.reduce((acc, i) => acc + i.totalAmount, 0),
    };

    const filtered = data.filter((inv) => {
        const matchesSearch =
            inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
            inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
            inv.user?.email.toLowerCase().includes(search.toLowerCase());

        const matchesEmail = emailFilter === "" || inv.user?.email.toLowerCase().includes(emailFilter.toLowerCase());
        const matchesStatus = statusFilter === "" || inv.status === statusFilter;

        return matchesSearch && matchesEmail && matchesStatus;
    });

    useEffect(() => {
        const fetch = async () => {
            if (user?.role === "customer") {
                const data = await getInvoices();
                setInvoices(data);
            } else {
                await fetchAllInvoices();
            }
        };
        fetch();
    }, [setInvoices, fetchAllInvoices, user?.role]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const askForPin = (callback: () => void) => {
        setPinCallback(() => callback);
        setShowPinDialog(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid": return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
            case "pending": return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case "overdue": return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
            default: return <Badge variant="outline">Draft</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin size-12 text-blue-600" />
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
                {user?.role === "customer" && (
                    <>
                        <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                            + Create Invoice
                        </Button>
                        <CreateInvoiceDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
                    </>
                )}
            </div>

            {user?.role === "customer" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-blue-600">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">Total</span>
                            </div>
                            <span className="font-bold text-lg">{summary.total}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-sm">Paid</span>
                            </div>
                            <span className="font-bold text-lg">{summary.paid}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-yellow-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Pending</span>
                            </div>
                            <span className="font-bold text-lg">{summary.pending}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-red-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Overdue</span>
                            </div>
                            <span className="font-bold text-lg">{summary.overdue}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Draft</span>
                            </div>
                            <span className="font-bold text-lg">{summary.draft}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-primary">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-sm">Total Amount</span>
                            </div>
                            <span className="font-bold text-lg">₹{summary.totalAmount.toLocaleString()}</span>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <Input
                    placeholder="Search by invoice ID or customer name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />

                {
                    user?.role !== "customer" && (
                        <select
                            value={emailFilter}
                            onChange={(e) => setEmailFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm "
                        >
                            <option value="">All Emails</option>
                            {uniqueEmails.map((email) => (
                                <option key={email} value={email}>
                                    {email}
                                </option>
                            ))}
                        </select>
                    )
                }

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm "
                >
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted text-gray-600 text-left">
                        <tr>
                            {user?.role !== "customer" && <th className="p-4">Business Email</th>}
                            <th className="p-4">Invoice</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((invoice) => (
                            <tr key={invoice._id} className="border-t hover:bg-muted/30">
                                {user?.role !== "customer" && (
                                    <td className="p-4">
                                        <div className="font-medium text-blue-600">{invoice?.user?.email}</div>
                                    </td>
                                )}
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
                                <td className="flex gap-2 p-2 mt-5 flex-wrap">
                                    <button onClick={() => { setSelectedInvoice(invoice); setShowDialog(true); }}>
                                        <Eye className="w-4 h-4 text-primary hover:scale-110 cursor-pointer" />
                                    </button>
                                    {user?.role === "customer" && <>
                                        <button onClick={() => { setSelectedInvoice(invoice); setShowDownloadDialog(true); }}>
                                            <Download className="w-4 h-4 text-green-600 hover:scale-110" />
                                        </button>
                                        <button onClick={() => { setSelectedInvoice(invoice); setShowPrintDialog(true); }}>
                                            <Printer className="w-4 h-4 text-orange-600 hover:scale-110" />
                                        </button>
                                        <button onClick={() => { setShareInvoice(invoice); setShowShareDialog(true); }}>
                                            <Share className="w-4 h-4 text-teal-600 hover:scale-110" />
                                        </button>
                                        <button onClick={() => askForPin(() => { setSelectedInvoice(invoice); setShowUpdateDialog(true); })}>
                                            <PenLine className="w-4 h-4 text-emerald-600 hover:scale-110" />
                                        </button>
                                        <button onClick={() => askForPin(() => { setSelectedInvoice(invoice); setShowDeleteDialog(true); })}>
                                            <Trash className="w-4 h-4 text-red-600 hover:scale-110" />
                                        </button>
                                    </>}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={6} className="text-center p-4 text-muted-foreground">No invoices found.</td></tr>}
                    </tbody>
                </table>
            </div>

            <UpdateInvoiceDialog open={showUpdateDialog} invoice={selectedInvoice} onClose={() => setShowUpdateDialog(false)}
                onUpdate={async (id, updatedFields) => {
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

            <DeleteInvoiceDialog open={showDeleteDialog} invoiceNumber={selectedInvoice?.invoiceNumber || ""} onClose={() => setShowDeleteDialog(false)}
                onConfirmDelete={async () => {
                    if (!selectedInvoice?._id) return;
                    await deleteInvoice(selectedInvoice._id);
                    const data = await getInvoices();
                    setInvoices(data);
                    setShowDeleteDialog(false);
                }}
            />

            <ProtectedPinDialog
                open={showPinDialog}
                onClose={() => setShowPinDialog(false)}
                onVerified={() => pinCallback()} />
            <DownloadInvoiceDialog
                open={showDownloadDialog}
                invoice={selectedInvoice}
                onClose={() => setShowDownloadDialog(false)} />
            <ViewInvoiceSizeDialog
                open={showDialog}
                invoice={selectedInvoice}
                previewType={previewType}
                onClose={() => setShowDialog(false)} />
            <InvoiceActionsDialog
                open={showPrintDialog}
                onOpenChange={setShowPrintDialog}
                onPrintA4={() => {
                    setPreviewType("A4");
                    setPrintInvoice(selectedInvoice);
                    setTimeout(() => handlePrint(), 50);
                    setShowPrintDialog(false);
                }}
                onPrint58mm={() => {
                    setPreviewType("58mm");
                    setPrintInvoice(selectedInvoice);
                    setTimeout(() => handlePrint(), 50);
                    setShowPrintDialog(false);
                }}
                onPrint80mm={() => {
                    setPreviewType("80mm");
                    setPrintInvoice(selectedInvoice);
                    setTimeout(() => handlePrint(), 50);
                    setShowPrintDialog(false);
                }}
            />

            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Share Invoice</DialogTitle></DialogHeader>
                    <div className="flex flex-col gap-4">
                        <Button onClick={() => { sendInvoiceOnWhatsApp(shareInvoice?._id ?? ""); setShowShareDialog(false); }} className="bg-green-600 hover:bg-green-700 w-full">
                            Share on WhatsApp
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div style={{ display: "none" }}>
                <div ref={previewRef} className="m-10">
                    {previewType === "A4" && <InvoicePreview invoice={printInvoice!} />}
                    {previewType === "58mm" && <POSReceipt58mm business={{ businessName: "Your Biz" }} invoice={printInvoice!} />}
                    {previewType === "80mm" && <POSReceipt80mm business={{ businessName: "Your Biz" }} invoice={printInvoice!} />}
                </div>
            </div>
        </div>
    );
}

