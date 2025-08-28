import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { FileText, IndianRupee, Download, PenLine, Trash, Printer, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IPDResponse } from "@/types/ipd.types";
import CreateIPDDialog from "@/components/ipd/createIPD";
import { updateIPD } from "@/services/ipd.service";
import UpdateIPD from "@/components/ipd/updateIPD";
import IPDPreview from "@/components/ipd/previewIPD";
import { DeleteIPD } from "@/components/ipd/deleteIPD";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { downloadIPDPDF } from "@/services/ipd.service";
import { useIPDStore } from "@/store/ipd.store";

export default function Billing() {
  const { ipds, allIPDs, fetchAllIPDs, fetchIPDs, deleteIPDRecord, printIPDPDF } = useIPDStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIPD, setSelectedIPD] = useState<IPDResponse | null>(null);
  const [selectedBill, setSelectedBill] = useState<string>("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");


  const previewRef = useRef<HTMLDivElement>(null);

  const isClinic = user?.role === "clinic";
  const isSupportOrMaster = user?.role === "support" || user?.role === "master";

  useEffect(() => {
    const fetchData = async () => {
      if (isClinic) {
        await fetchIPDs();
      } else if (isSupportOrMaster) {
        await fetchAllIPDs();
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.role]);

  const data = isClinic ? ipds : allIPDs?.ipds ?? [];
  const uniqueClinicEmails = Array.from(
    new Set(data.map((ipd) => ipd.clinic?.email).filter(Boolean))
  );


  const summary = {
    total: Array.isArray(data) ? data.length : 0,
    pending: Array.isArray(data) ? data.filter((i) => i.paymentStatus === "pending").length : 0,
    paid: Array.isArray(data) ? data.filter((i) => i.paymentStatus === "paid").length : 0,
    totalAmount: Array.isArray(data) ? data.reduce((acc, i) => acc + i.billing.finalAmount, 0) : 0,
  };

  const filtered = Array.isArray(data)
    ? data.filter((ipd) => {
      const ipdNum = ipd.ipdNumber?.toLowerCase() ?? "";
      const patientName = ipd.patient?.name?.toLowerCase() ?? "";
      const matchesSearch =
        ipdNum.includes(search.toLowerCase()) || patientName.includes(search.toLowerCase());
      const matchesEmail = !selectedEmail || ipd.clinic?.email === selectedEmail;
      const matchesStatus = !selectedStatus || ipd.status === selectedStatus;
      return matchesSearch && matchesEmail && matchesStatus;
    })
    : [];


  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedIPD?._id) return;
    await deleteIPDRecord(selectedIPD._id);
    isClinic ? await fetchIPDs() : await fetchAllIPDs();
    setShowDeleteDialog(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billings Record</h1>
          <p className="text-gray-500">Manage your in-patient department records</p>
        </div>
        {isClinic && (
          <>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              + Create Bill
            </Button>
            <CreateIPDDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
          </>
        )}
      </div>

      {isClinic && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Summary cards */}
          {Object.entries(summary).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-4 flex justify-between">
                <div className="flex items-center gap-2 capitalize text-muted-foreground">
                  {key === "totalAmount" ? <IndianRupee className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                </div>
                <span className="font-bold text-lg">
                  {key === "totalAmount" ? `₹${value.toLocaleString()}` : value}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search IPD records by IPD number or patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {user?.role !== "clinic" && (
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            className="px-4 border border-gray-300 rounded-md"
          >
            <option value="">All Clinics</option>
            {uniqueClinicEmails.map((email) => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        )}

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 border border-gray-300 rounded-md"
        >
          <option value="">All Status</option>
          <option value="Admitted">Admitted</option>
          <option value="Discharged">Discharged</option>
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
              <th className="p-4">Discharge Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ipd) => (
              <tr key={ipd._id} className="border-t hover:bg-muted/30">
                {!isClinic && (
                  <td className="p-4">
                    <div className="font-medium text-blue-600">{ipd.clinic?.email}</div>
                  </td>
                )}
                <td className="p-4">
                  <div className="font-medium text-blue-600">{ipd.ipdNumber}</div>
                  <div className="text-xs text-muted-foreground">{ipd.createdAt?.slice(0, 10)}</div>
                </td>
                <td>
                  <div>{ipd.patient?.name || "N/A"}</div>
                  <div className="text-xs text-muted-foreground">{ipd.patient?.phoneNumber || "N/A"}</div>
                </td>
                <td>
                  ₹{ipd.billing.finalAmount.toLocaleString()}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    Bed: ₹{ipd.billing.bedCharges.toLocaleString()}
                  </span>
                </td>
                <td>{getPaymentStatusBadge(ipd.paymentStatus)}</td>
                <td>{ipd.admissionDate?.slice(0, 10)}</td>
                <td>{ipd.dischargeDate?.slice(0, 10)}</td>
                <td>
                  <button onClick={() => { setSelectedIPD(ipd); setShowPreviewDialog(true); }}>
                    <Eye className="w-4 h-4 mr-2 text-blue-500 hover:scale-110" />
                  </button>
                  {user?.role === "clinic" && (
                    <>
                      <button onClick={async () => {
                        try {
                          const blob = await downloadIPDPDF(ipd._id);
                          const url = window.URL.createObjectURL(new Blob([blob]));
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", `${ipd.ipdNumber}_bill.pdf`);
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error("Download failed", err);
                        }
                      }}>
                        <Download className="w-4 h-4 mr-2 text-green-600 hover:scale-110" />
                      </button>
                      <button onClick={() => printIPDPDF(ipd._id)}>
                        <Printer className="w-4 h-4 mr-2 text-orange-600 hover:scale-110" />
                      </button>
                      <button onClick={() => { setSelectedIPD(ipd); setShowUpdateDialog(true); }}>
                        <PenLine className="w-4 h-4 mr-2 text-emerald-600 hover:scale-110" />
                      </button>
                      <button onClick={() => {
                        setSelectedIPD(ipd);
                        setSelectedBill(ipd.ipdNumber);
                        setShowDeleteDialog(true);
                      }}>
                        <Trash className="w-4 h-4 text-red-600 hover:scale-110" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center p-4 text-muted-foreground">
                  No Bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <UpdateIPD
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        ipd={selectedIPD}
        onUpdate={async (id, fields) => {
          await updateIPD(id, fields);
          isClinic ? await fetchIPDs() : await fetchAllIPDs();
        }}
      />

      <DeleteIPD
        open={showDeleteDialog}
        billNumber={selectedBill}
        onClose={() => setShowDeleteDialog(false)}
        onConfirmDelete={handleConfirmDelete}
      />

      <div style={{ display: "none" }}>
        <div ref={previewRef} className="m-10">
          {selectedIPD && <IPDPreview IPD={selectedIPD} />}
        </div>
      </div>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white max-w-fit max-h-[80vh] p-5 overflow-y-auto border-2 rounded-md">
          <DialogHeader>
            <DialogTitle>Preview IPD Bill</DialogTitle>
          </DialogHeader>
          {selectedIPD && <IPDPreview IPD={selectedIPD} />}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
