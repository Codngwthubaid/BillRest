import { useBusinessStore } from "@/store/business.store";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import type { Business } from "@/types/business.types";
import { useAuthStore } from "@/store/auth.store";
import { Switch } from "@/components/ui/switch"

type BusinessWithUser = Business & {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    features: {
      backup: boolean;
      barcode: boolean;
      pwa: boolean;
      whatsappInvoice: boolean;
    };
  };
};

export default function Businesses() {
  const { user } = useAuthStore()
  const { businesses, fetchAllBusinesses , updateBusinessFeaturesInStore} = useBusinessStore();
  const [search, setSearch] = useState("");

  console.log(businesses)

  useEffect(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  const filteredBusinesses = (businesses as BusinessWithUser[]).filter((b) =>
    b.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Businesses</h1>
      <p className="mb-6">Manage your business database</p>

      {/* Search bar */}
      <div className="mb-6">
        <Input
          placeholder="Search by business name..."
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
              <TableHead>Business Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Protected PIN</TableHead>
              <TableHead>PWA Status</TableHead>
              {user?.role === "master" && <TableHead>PWA Enabled</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.map((b, index) => (
              <TableRow key={b._id}>
                <TableCell className="text-blue-600 font-semibold">{index + 1}</TableCell>
                <TableCell>{b.businessName}</TableCell>
                <TableCell>{b.user?.name || "N/A"}</TableCell>
                <TableCell>{b.address || "N/A"}</TableCell>
                <TableCell>{b.protectedPin || "N/A"}</TableCell>
                <TableCell>
                  {b.user?.features?.pwa ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </TableCell>
                {
                  user?.role === "master" && (
                    <TableCell>
                      <Switch
                        checked={b.user?.features?.pwa}
                        onCheckedChange={(checked) => {
                          updateBusinessFeaturesInStore(b.user._id, { pwa: checked });
                        }}
                      />
                    </TableCell>
                  )
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
