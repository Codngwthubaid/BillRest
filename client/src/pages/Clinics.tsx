import { useClinicStore } from "@/store/clinic.store";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth.store";
import { Switch } from "@/components/ui/switch";
import type { Clinic } from "@/types/clinic.types";
import { toast } from "sonner";

export default function ClinicsPage() {
  const { user } = useAuthStore();
  const {
    clinic,
    allClinics,
    fetchAllClinics,
    fetchClinic,
  } = useClinicStore();

  console.log("allClinics", allClinics);

  const { updateClinicFeaturesInStore } = useClinicStore()
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedWAIStatus, setSelectedWAIStatus] = useState("");
  const [selectedIPDStatus, setSelectedIPDStatus] = useState("");


  // Conditionally fetch clinics based on role
  useEffect(() => {
    if (user?.role === "support" || user?.role === "master") {
      fetchAllClinics();
    } else if (user?.role === "clinic") {
      fetchClinic();
    }
  }, [user?.role, fetchAllClinics, fetchClinic]);

  // Conditionally choose clinics array
  const clinicsArray: Clinic[] =
    user?.role === "support" || user?.role === "master"
      ? Array.isArray(allClinics?.clinics)
        ? allClinics.clinics
        : []
      : clinic
        ? [clinic]
        : [];
  const uniqueEmails = Array.from(
    new Set(clinicsArray.map(c => c.user?.email).filter(Boolean))
  );

  const filteredClinics = clinicsArray.filter((c: Clinic) => {
    const matchesSearch = c.businessName?.toLowerCase().includes(search.toLowerCase());
    const matchesEmail = !selectedEmail || c.user?.email === selectedEmail;
    const matchesWAI = selectedWAIStatus === ""
      || (selectedWAIStatus === "enabled" && c.user?.features?.whatsappInvoice)
      || (selectedWAIStatus === "disabled" && !c.user?.features?.whatsappInvoice);
    const matchesIPD = selectedIPDStatus === ""
      || (selectedIPDStatus === "enabled" && c.user?.features?.IPD)
      || (selectedIPDStatus === "disabled" && !c.user?.features?.IPD);

    return matchesSearch && matchesEmail && matchesWAI && matchesIPD;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Clinics</h1>
      <p className="mb-6">Manage your clinic database</p>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by clinic name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />

        <select
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          className="w-full sm:w-[200px] p-2 border rounded-md"
        >
          <option value="">All Emails</option>
          {uniqueEmails.map(email => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>

        <select
          value={selectedWAIStatus}
          onChange={(e) => setSelectedWAIStatus(e.target.value)}
          className="w-full sm:w-[160px] p-2 border rounded-md"
        >
          <option value="">All WAI</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>

        <select
          value={selectedIPDStatus}
          onChange={(e) => setSelectedIPDStatus(e.target.value)}
          className="w-full sm:w-[160px] p-2 border rounded-md"
        >
          <option value="">All IPD</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>


      {/* Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 font-semibold">
              <TableHead>S.No.</TableHead>
              <TableHead>Clinic Email</TableHead>
              <TableHead>Clinic Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Protected PIN</TableHead>
              <TableHead>WAI Status</TableHead>
              <TableHead>IPD Status</TableHead>
              {user?.role === "master" && <TableHead>WAI Enabled</TableHead>}
              {user?.role === "master" && <TableHead>IPD Enabled</TableHead>}
              {/* <TableHead>View Report</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClinics.map((c, index) => (
              <TableRow key={c._id}>
                <TableCell className="text-blue-600 font-semibold">
                  {index + 1}
                </TableCell>
                <TableCell>{c.user?.email || "N/A"}</TableCell>
                <TableCell>{c.businessName}</TableCell>
                <TableCell>{c.user?.name || "N/A"}</TableCell>
                <TableCell>{c.address || "N/A"}</TableCell>
                <TableCell>{c.protectedPin || "N/A"}</TableCell>
                <TableCell>
                  {c.user?.features?.whatsappInvoice ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </TableCell>
                <TableCell>
                  {c.user?.features?.IPD ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </TableCell>
                {user?.role === "master" && (
                  <TableCell>
                    <Switch
                      checked={c.user?.features?.whatsappInvoice}
                      onCheckedChange={(checked) => {
                        updateClinicFeaturesInStore(c.user._id, { whatsappInvoice: checked });
                        toast.success("Feature updated!");
                      }}
                    />
                  </TableCell>
                )}
                {user?.role === "master" && (
                  <TableCell>
                    <Switch
                      checked={c.user?.features?.IPD}
                      onCheckedChange={(checked) => {
                        updateClinicFeaturesInStore(c.user._id, { IPD: checked });
                        toast.success("Feature updated!");
                      }}
                    />
                  </TableCell>
                )}
                {/* <TableCell>
                  <Button className="bg-green-500 hover:bg-green-600 cursor-pointer">View Report</Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
