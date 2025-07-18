import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useIPDStore } from "@/store/ipd.store";
import { useAuthStore } from "@/store/auth.store";
import { FileText, IndianRupee, Clock, Calendar, Eye, Download, PenLine, Trash, Loader2, Printer, Share } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IPDResponse } from "@/types/ipd.types";
import CreateIPDDialog from "@/components/ipd/createIPD"; // Adjust path as needed
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import InvoicePreview from "@/components/invoices/InvoicePreview"; // Adjust for IPD preview
import POSReceipt58mm from "@/components/invoices/POSReceipt58mm"; // Adjust for IPD
import POSReceipt80mm from "@/components/invoices/POSReceipt80mm"; // Adjust for IPD
import InvoiceActionsDialog from "@/components/invoices/InvoiceActionsDialog"; // Adjust for IPD actions
import ProtectedPinDialog from "@/components/invoices/ProtectedPinDialog";
import ViewInvoiceSizeDialog from "@/components/invoices/ViewInvoiceSizeDialog"; // Adjust for IPD
import DownloadInvoiceDialog from "@/components/invoices/DownloadInvoiceDialog"; // Adjust for IPD
import { updateIPD, dischargeIPD } from "@/services/ipd.service"; // Import IPD services
import { sendInvoiceOnWhatsApp } from "@/services/invoice.service"; // Reused for sharing IPD
import { DialogHeader } from "@/components/ui/dialog";
import UpdateIPD from "@/components/ipd/updateIPD";
import IPDPreview from "@/components/ipd/previewIPD"

export default function Billing() {
    const { ipds, fetchIPDs } = useIPDStore();
    const { user } = useAuthStore();

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [showPrintDialog, setShowPrintDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [printIPD, setPrintIPD] = useState<IPDResponse | null>(null);
    const [shareIPD, setShareIPD] = useState<IPDResponse | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedIPD, setSelectedIPD] = useState<IPDResponse | null>(null);
    const [showPinDialog, setShowPinDialog] = useState(false);
    const [showDownloadDialog, setShowDownloadDialog] = useState(false);
    const [pinCallback, setPinCallback] = useState<() => void>(() => () => { });
    const [previewType, setPreviewType] = useState<"A4" | "58mm" | "80mm">("A4");

    const previewRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: previewRef });

    const data = ipds; // Assuming all users see all IPDs; adjust if role-based filtering is needed

    const summary = {
        total: data.length,
        admitted: data.filter((i) => i.status === "Admitted").length,
        discharged: data.filter((i) => i.status === "Discharged").length,
        pending: data.filter((i) => i.paymentStatus === "pending").length,
        paid: data.filter((i) => i.paymentStatus === "paid").length,
        partial: data.filter((i) => i.paymentStatus === "partial").length,
        totalAmount: data.reduce((acc, i) => acc + i.billing.finalAmount, 0),
    };

    const filtered = data.filter(
        (ipd) =>
            ipd.ipdNumber.toLowerCase().includes(search.toLowerCase()) ||
            ipd.patient.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const fetch = async () => {
            await fetchIPDs();
            setLoading(false);
        };
        fetch();
    }, [fetchIPDs]);

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
            case "Admitted":
                return <Badge className="bg-yellow-100 text-yellow-800">Admitted</Badge>;
            case "Discharged":
                return <Badge className="bg-green-100 text-green-800">Discharged</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case "partial":
                return <Badge className="bg-blue-100 text-blue-800">Partial</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
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
                    <h1 className="text-2xl font-bold">Billings Record</h1>
                    <p className="text-gray-500">Manage your in-patient department records</p>
                </div>
                {user?.role === "clinic" && (
                    <>
                        <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                            + Create Bill
                        </Button>
                        <CreateIPDDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
                    </>
                )}
            </div>

            {user?.role === "clinic" && (
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
                            <div className="flex items-center gap-2 text-yellow-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Admitted</span>
                            </div>
                            <span className="font-bold text-lg">{summary.admitted}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Discharged</span>
                            </div>
                            <span className="font-bold text-lg">{summary.discharged}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-yellow-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Pending Payment</span>
                            </div>
                            <span className="font-bold text-lg">{summary.pending}</span>
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
                            <div className="flex items-center gap-2 text-primary">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-sm">Total Amount</span>
                            </div>
                            <span className="font-bold text-lg">₹{summary.totalAmount.toLocaleString()}</span>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <Input
                    placeholder="Search IPD records by IPD number or patient name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted text-gray-600 text-left">
                        <tr>
                            <th className="p-4">IPD Record</th>
                            <th>Patient</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Payment Status</th>
                            <th>Admission Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((ipd) => (
                            <tr key={ipd._id} className="border-t hover:bg-muted/30">
                                <td className="p-4">
                                    <div className="font-medium text-blue-600">{ipd.ipdNumber}</div>
                                    <div className="text-xs text-muted-foreground">{ipd.createdAt?.slice(0, 10)}</div>
                                </td>
                                <td>
                                    <div>{ipd.patient.name}</div>
                                    <div className="text-xs text-muted-foreground">{ipd.patient.phoneNumber}</div>
                                </td>
                                <td>
                                    ₹{ipd.billing.finalAmount.toLocaleString()}
                                    <br />
                                    <span className="text-xs text-muted-foreground">
                                        Bed: ₹{ipd.billing.bedCharges.toLocaleString()}
                                    </span>
                                </td>
                                <td>{getStatusBadge(ipd.status)}</td>
                                <td>{getPaymentStatusBadge(ipd.paymentStatus)}</td>
                                <td>{ipd.admissionDate?.slice(0, 10)}</td>
                                <td className="flex gap-2 p-2 mt-5 flex-wrap">
                                    <button onClick={() => { setSelectedIPD(ipd); setShowDialog(true); }}>
                                        <Eye className="w-4 h-4 text-primary hover:scale-110 cursor-pointer" />
                                    </button>
                                    {user?.role === "clinic" && (
                                        <>
                                            <button onClick={() => { setSelectedIPD(ipd); setShowDownloadDialog(true); }}>
                                                <Download className="w-4 h-4 text-green-600 hover:scale-110" />
                                            </button>
                                            <button onClick={() => { setSelectedIPD(ipd); setShowPrintDialog(true); }}>
                                                <Printer className="w-4 h-4 text-orange-600 hover:scale-110" />
                                            </button>
                                            <button onClick={() => { setShareIPD(ipd); setShowShareDialog(true); }}>
                                                <Share className="w-4 h-4 text-teal-600 hover:scale-110" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedIPD(ipd);
                                                    setShowUpdateDialog(true)
                                                }}
                                            >
                                                <PenLine className="w-4 h-4 text-emerald-600 hover:scale-110" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    askForPin(() => {
                                                        setSelectedIPD(ipd);
                                                        setShowDeleteDialog(true);
                                                    })
                                                }
                                            >
                                                <Trash className="w-4 h-4 text-red-600 hover:scale-110" />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center p-4 text-muted-foreground">
                                    No IPD records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete IPD Record</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <p>Are you sure you want to delete IPD record {selectedIPD?.ipdNumber}?</p>
                        <Button
                            onClick={async () => {
                                if (!selectedIPD?._id) return;
                                await dischargeIPD(selectedIPD._id); // Using discharge as delete equivalent
                                await fetchIPDs();
                                setShowDeleteDialog(false);
                            }}
                            variant="destructive"
                        >
                            Confirm Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <UpdateIPD
                open={showUpdateDialog}
                onOpenChange={setShowUpdateDialog}
                ipd={selectedIPD}
                onUpdate={async (id, updatedFields) => {
                    await updateIPD(id, updatedFields);
                    await fetchIPDs();
                }}
            />

            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share IPD Record</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={() => {
                                sendInvoiceOnWhatsApp(shareIPD?._id ?? ""); // Adjust for IPD sharing
                                setShowShareDialog(false);
                            }}
                            className="bg-green-600 hover:bg-green-700 w-full"
                        >
                            Share on WhatsApp
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div style={{ display: "none" }}>
        <div ref={previewRef} className="m-10">
          {previewType === "A4" && <IPDPreview invoice={printIPD!} />}
        </div>
      </div>
        </div>
    );
}