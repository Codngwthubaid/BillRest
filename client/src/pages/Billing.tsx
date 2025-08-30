import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { FileText, IndianRupee, Download, PenLine, Trash, Printer, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IPDResponse } from "@/types/ipd.types";
import CreateIPDDialog from "@/components/billing/createIPD";
import CreateOPDDialog from "@/components/billing/createOPD";
import { updateIPD } from "@/services/ipd.service";
import UpdateIPD from "@/components/billing/updateIPD";
import IPDPreview from "@/components/billing/previewIPD";
import { DeleteIPD } from "@/components/billing/deleteIPD";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useIPDStore } from "@/store/ipd.store";
import PreviewOPDDialog from "@/components/billing/previewOPD";
import UpdateOPDDialog from "@/components/billing/updateOPD";

export default function Billing() {
  const {
    ipds,
    allIPDs,
    fetchAllIPDs,
    fetchIPDs,
    deleteIPDRecord,
    printIPDPDF,
    downloadIPDPDFById,
    printOPDPDF,
    downloadOPDPDFById,
    updateOPDRecord
  } = useIPDStore();
  const { user } = useAuthStore();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateIPDDialog, setShowCreateIPDDialog] = useState(false);
  const [showCreateOPDDialog, setShowCreateOPDDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedOPD, setSelectedOPD] = useState<IPDResponse | null>(null);
  const [showPreviewOPDDialog, setShowPreviewOPDDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IPDResponse | null>(null);
  const [selectedBill, setSelectedBill] = useState<string>("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showUpdateOPDDialog, setShowUpdateOPDDialog] = useState(false);
  const [selectedOPDForUpdate, setSelectedOPDForUpdate] = useState<IPDResponse | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"IPD" | "OPD">("IPD");

  const isClinic = user?.role === "clinic";
  const isSupportOrMaster = user?.role === "support" || user?.role === "master";

  useEffect(() => {
    const fetchData = async () => {
      if (isClinic) await fetchIPDs();
      else if (isSupportOrMaster) await fetchAllIPDs();
      setLoading(false);
    };
    fetchData();
  }, [user?.role]);

  const data = isClinic ? ipds : allIPDs?.ipds ?? [];
  const ipdData = data.filter((record) => record.bed);
  const opdData = data.filter((record) => !record.bed);
  const currentData = activeTab === "IPD" ? ipdData : opdData;

  const uniqueClinicEmails = Array.from(new Set(data.map((d) => d.clinic?.email).filter(Boolean)));

  const summary = {
    total: currentData.length,
    pending: currentData.filter((i) => i.paymentStatus === "pending").length,
    paid: currentData.filter((i) => i.paymentStatus === "paid").length,
    totalAmount: currentData.reduce((acc, i) => acc + (i.billing?.finalAmount ?? 0), 0),
  };

  const filtered = currentData.filter((record) => {
    const recordNum = record.ipdNumber?.toLowerCase() ?? "";
    const patientName = record.patient?.name?.toLowerCase() ?? "";
    const matchesSearch = recordNum.includes(search.toLowerCase()) || patientName.includes(search.toLowerCase());
    const matchesEmail = !selectedEmail || record.clinic?.email === selectedEmail;
    const matchesStatus = !selectedStatus || record.paymentStatus?.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesEmail && matchesStatus;
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending": return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecord?._id) return;
    await deleteIPDRecord(selectedRecord._id);
    isClinic ? await fetchIPDs() : await fetchAllIPDs();
    setShowDeleteDialog(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billings Record</h1>
          <p className="text-gray-500">Manage your in-patient (IPD) and out-patient (OPD) records</p>
        </div>
        {isClinic && <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">+ Create Bill</Button>}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button variant={activeTab === "IPD" ? "default" : "outline"} onClick={() => setActiveTab("IPD")}>IPD ({ipdData.length})</Button>
        <Button variant={activeTab === "OPD" ? "default" : "outline"} onClick={() => setActiveTab("OPD")}>OPD ({opdData.length})</Button>
      </div>

      {/* Summary */}
      {isClinic && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {Object.entries(summary).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-4 flex justify-between">
                <div className="flex items-center gap-2 capitalize text-muted-foreground">
                  {key === "totalAmount" ? <IndianRupee className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                </div>
                <span className="font-bold text-lg">{key === "totalAmount" ? `₹${value.toLocaleString()}` : value}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input placeholder="Search by number or patient name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {user?.role !== "clinic" && (
          <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)} className="px-4 border border-gray-300 rounded-md">
            <option value="">All Clinics</option>
            {uniqueClinicEmails.map((email) => <option key={email} value={email}>{email}</option>)}
          </select>
        )}
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-4 border border-gray-300 rounded-md">
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-gray-600 text-left">
            <tr>
              {!isClinic && <th className="p-4">Clinic Email</th>}
              <th className="p-4">Billing ID</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Admission Date</th>
              {activeTab === "IPD" && <th className="p-4">Discharge Date</th>}
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => (
              <tr key={record._id} className="border-t hover:bg-muted/30">
                {!isClinic && <td className="p-4">{record.clinic?.email}</td>}
                <td className="p-4">{record.ipdNumber}<br /><span className="text-xs text-muted-foreground">{record.createdAt?.slice(0, 10)}</span></td>
                <td>{record.patient?.name || "N/A"}<br /><span className="text-xs text-muted-foreground">{record.patient?.phoneNumber || "N/A"}</span></td>
                <td>
                  ₹{record.billing?.finalAmount?.toLocaleString() ?? 0}
                  {activeTab === "IPD" && <span className="text-xs text-muted-foreground">Bed: ₹{record.billing?.bedCharges?.toLocaleString() ?? 0}</span>}
                </td>
                <td>{getPaymentStatusBadge(record.paymentStatus || "")}</td>
                <td>{record.admissionDate?.slice(0, 10)}</td>
                {activeTab === "IPD" && <td>{record.dischargeDate?.slice(0, 10)}</td>}
                <td className="flex gap-1">
                  {activeTab === "IPD" ? (
                    <>
                      <button onClick={() => { setSelectedRecord(record); setShowPreviewDialog(true); }}><Eye className="w-4 h-4 text-blue-500 hover:scale-110" /></button>
                      <button onClick={() => downloadIPDPDFById(record._id)}><Download className="w-4 h-4 text-green-600 hover:scale-110" /></button>
                      <button onClick={() => printIPDPDF(record._id)}><Printer className="w-4 h-4 text-orange-600 hover:scale-110" /></button>
                      <button onClick={() => { setSelectedRecord(record); setShowUpdateDialog(true); }}><PenLine className="w-4 h-4 text-emerald-600 hover:scale-110" /></button>
                      <button onClick={() => { setSelectedRecord(record); setSelectedBill(record.ipdNumber); setShowDeleteDialog(true); }}><Trash className="w-4 h-4 text-red-600 hover:scale-110" /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setSelectedOPD(record); setShowPreviewOPDDialog(true); }}><Eye className="w-4 h-4 text-blue-500 hover:scale-110" /></button>
                      <button onClick={() => downloadOPDPDFById(record._id)}><Download className="w-4 h-4 text-green-600 hover:scale-110" /></button>
                      <button onClick={() => printOPDPDF(record._id)}><Printer className="w-4 h-4 text-orange-600 hover:scale-110" /></button>
                      <button onClick={() => { setSelectedOPDForUpdate(record); setShowUpdateOPDDialog(true); }}>
                        <PenLine className="w-4 h-4 text-emerald-600 hover:scale-110" />
                      </button>
                      <button onClick={() => { setSelectedRecord(record); setSelectedBill(record.ipdNumber); setShowDeleteDialog(true); }}><Trash className="w-4 h-4 text-red-600 hover:scale-110" /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center p-4 text-muted-foreground">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Select Bill Type</DialogTitle></DialogHeader>
          <div className="flex justify-center gap-4 mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setShowCreateDialog(false); setShowCreateIPDDialog(true); }}>Create IPD</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setShowCreateDialog(false); setShowCreateOPDDialog(true); }}>Create OPD</Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateIPDDialog open={showCreateIPDDialog} onOpenChange={setShowCreateIPDDialog} />
      <CreateOPDDialog open={showCreateOPDDialog} onOpenChange={setShowCreateOPDDialog} />
      <UpdateIPD
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        ipd={selectedRecord}
        onUpdate={async (id, fields) => { await updateIPD(id, fields); isClinic ? await fetchIPDs() : await fetchAllIPDs(); }}
      />
      <DeleteIPD open={showDeleteDialog} billNumber={selectedBill} onClose={() => setShowDeleteDialog(false)} onConfirmDelete={handleConfirmDelete} />

      <div style={{ display: "none" }}><div ref={previewRef} className="m-10">{selectedRecord && <IPDPreview IPD={selectedRecord} />}</div></div>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white max-w-fit max-h-[80vh] p-5 overflow-y-auto border-2 rounded-md">
          <DialogHeader><DialogTitle>Preview Bill</DialogTitle></DialogHeader>
          {selectedRecord && <IPDPreview IPD={selectedRecord} />}
          <DialogFooter><Button variant="secondary" onClick={() => setShowPreviewDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <PreviewOPDDialog
        open={showPreviewOPDDialog}
        onOpenChange={setShowPreviewOPDDialog}
        opd={selectedOPD}
        onDownloadPDF={() => selectedOPD && downloadOPDPDFById(selectedOPD._id)}
        onPrintPDF={() => selectedOPD && printOPDPDF(selectedOPD._id)}
      />
      <UpdateOPDDialog
        open={showUpdateOPDDialog}
        onOpenChange={setShowUpdateOPDDialog}
        opd={selectedOPDForUpdate}
        services={[]}
        onUpdate={async (id, fields) => {
          if (!id) return;
          await updateOPDRecord(id, fields);
          isClinic ? await fetchIPDs() : await fetchAllIPDs();
        }}
      />

    </div>
  );
}
