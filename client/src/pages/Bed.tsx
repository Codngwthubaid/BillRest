import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Edit, Trash2, BedDouble, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { useBedStore } from "@/store/bed.store";
import type { Bed } from "@/types/bed.types";
import CreateBedDialog from "@/components/bed/CreateBedDialog";
import UpdateBedDialog from "@/components/bed/UpdateBedDialog";
import DeleteBedDialog from "@/components/bed/DeleteBedDialog";
import { AdminPatientDialog } from "@/components/bed/AdmitPatientDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Bed() {
  const { user } = useAuthStore();
  const { beds, fetchBeds, updateBed, deleteBed } = useBedStore();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAdmitDialog, setShowAdmitDialog] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [loading, setLoading] = useState(true);

  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    fetchBeds().finally(() => setLoading(false));
  }, []);

  const statuses = ["Available", "Occupied"];

  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      const matchesSearch = (bed.bedNumber ?? "").toString().toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !selectedStatus || bed.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [beds, search, selectedStatus]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-12 text-blue-600" />
      </div>
    );
  }


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Beds</h1>
          <p>Manage hospital beds</p>
        </div>
        {user?.role === "clinic" && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bed</span>
          </Button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search by bed number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2"
          />
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeds.map((bed) => (
          <Card key={bed._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BedDouble className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Bed #{bed.bedNumber}</h3>
                    <p className="text-sm text-gray-500">Room: {bed.roomNumber}</p>
                  </div>
                </div>
                {user?.role === "clinic" && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedBed(bed); setShowUpdateDialog(true); }}
                      className="hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedBed(bed); setShowDeleteDialog(true); }}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Charges:</span>
                  <span className="font-medium">₹{bed.bedCharges}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-semibold ${bed.status === "Available" ? "text-green-600" :
                    bed.status === "Occupied" ? "text-red-600" :
                      "text-yellow-600"
                    }`}>
                    {bed.status}
                  </span>
                </div>
              </div>

              {/* ✅ Admit Patient Button */}
              {bed.status === "Available" && user?.role === "clinic" && (
                <div className="mt-4">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => { setSelectedBed(bed); setShowAdmitDialog(true); }}
                  >
                    Admit Patient
                  </Button>
                </div>
              )}

              {bed.status === "Occupied" && bed.patient && (
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedPatient(bed.patient);
                      setShowPatientDetails(true);
                    }}
                  >
                    View Patient Details
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBeds.length === 0 && (
        <div className="text-center py-12">
          <BedDouble className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No beds found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Dialogs */}
      <CreateBedDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <UpdateBedDialog
        open={showUpdateDialog}
        bed={selectedBed}
        onClose={() => setShowUpdateDialog(false)}
        onUpdate={async (id, payload) => {
          await updateBed(id, payload);
          setShowUpdateDialog(false);
        }}
      />
      <DeleteBedDialog
        open={showDeleteDialog}
        bedNumber={selectedBed?.bedNumber ?? ""}
        onClose={() => setShowDeleteDialog(false)}
        onConfirmDelete={async () => {
          if (!selectedBed?._id) return;
          await deleteBed(selectedBed._id);
          setShowDeleteDialog(false);
        }}
      />

      <AdminPatientDialog
        open={showAdmitDialog}
        onClose={() => setShowAdmitDialog(false)}
        bedId={selectedBed?._id}
        onAdmitSuccess={fetchBeds}
      />

      {/* ✅ Patient Details Dialog */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient ? (
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Phone:</strong> {selectedPatient.phoneNumber}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
            </div>
          ) : (
            <p>No patient details available.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
