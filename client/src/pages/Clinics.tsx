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

  const { updateClinicFeaturesInStore } = useClinicStore()
  const [search, setSearch] = useState("");

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


  const filteredClinics = clinicsArray.filter((c: Clinic) =>
    c.businessName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Clinics</h1>
      <p className="mb-6">Manage your clinic database</p>

      {/* Search bar */}
      <div className="mb-6">
        <Input
          placeholder="Search by clinic name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 font-semibold">
              <TableHead>S.No.</TableHead>
              <TableHead>Clinic Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Protected PIN</TableHead>
              <TableHead>WAI Status</TableHead>
              <TableHead>IPD Status</TableHead>
              {user?.role === "master" && <TableHead>WAI Enabled</TableHead>}
              {user?.role === "master" && <TableHead>IPD Enabled</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClinics.map((c, index) => (
              <TableRow key={c._id}>
                <TableCell className="text-blue-600 font-semibold">
                  {index + 1}
                </TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
