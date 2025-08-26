import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useBedStore } from "@/store/bed.store";

interface Props {
  open: boolean;
  onClose: () => void;
  bedId: string | undefined;
  onAdmitSuccess: () => void;
}

export function AdminPatientDialog({ open, onClose, bedId, onAdmitSuccess }: Props) {
  const { patients, fetchPatients, updateBed } = useBedStore();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isAdmitted, setIsAdmitted] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPatients();
      setSelectedPatientId("");
      setIsAdmitted(false);
    }
  }, [open, fetchPatients]);

  const selectedPatient = patients.find((p) => p._id === selectedPatientId);

  const handleAdmit = async () => {
    if (!bedId || !selectedPatientId) return;
    setLoading(true);
    try {
      await updateBed(bedId, {
        status: "Occupied",
        patient: selectedPatientId,
      });
      setIsAdmitted(true);
      onAdmitSuccess();
    } catch (err) {
      console.error("Admit patient error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Admit Patient</DialogTitle>
          </DialogHeader>

          {!isAdmitted ? (
            <div className="space-y-4">
              {/* Patient Dropdown */}
              <select
                className="w-full border rounded-lg p-2"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} ({patient.age} yrs)
                  </option>
                ))}
              </select>

              {/* Patient Preview */}
              {selectedPatient && (
                <div className="border rounded-lg p-3 bg-gray-50 space-y-1">
                  <p><strong>Name:</strong> {selectedPatient.name}</p>
                  <p><strong>Age:</strong> {selectedPatient.age}</p>
                  <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                  <p><strong>Phone:</strong> {selectedPatient.phoneNumber}</p>
                  <p><strong>Address:</strong> {selectedPatient.address}</p>
                </div>
              )}

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleAdmit}
                disabled={!selectedPatientId || loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Admitting..." : "Admit Patient"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-green-600 font-semibold">Patient admitted successfully!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
