import { useClinicStore } from "@/store/clinic.store";
import { useBusinessStore } from "@/store/business.store"; // ✅ Only for updateBusinessFeaturesInStore
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


export default function ClinicsPage() {
  const { user } = useAuthStore();
  const { clinic, fetchClinic } = useClinicStore(); // ✅ use clinics and fetchAllClinics
  const { updateBusinessFeaturesInStore } = useBusinessStore(); // ✅ only importing this one function
  const [search, setSearch] = useState("");

  console.log("ClinicsPage ", clinic);

  useEffect(() => {
    fetchClinic();
  }, [fetchClinic]);

  const clinicsArray: Clinic[] = Array.isArray(clinic) ? clinic : clinic ? [clinic] : [];
  const filteredClinics = clinicsArray.filter((c: Clinic) =>
    c.businessName.toLowerCase().includes(search.toLowerCase())
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
              <TableHead>PWA Status</TableHead>
              {user?.role === "master" && <TableHead>PWA Enabled</TableHead>}
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
                  {c.user?.features?.pwa ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </TableCell>
                {user?.role === "master" && (
                  <TableCell>
                    <Switch
                      checked={c.user?.features?.pwa}
                      onCheckedChange={(checked) => {
                        updateBusinessFeaturesInStore(c.user._id, {
                          pwa: checked,
                        });
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
