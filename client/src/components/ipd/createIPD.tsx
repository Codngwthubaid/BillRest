import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useIPDStore } from "@/store/ipd.store";
import { useBedStore } from "@/store/bed.store";
import type { IPDInput } from "@/types/ipd.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultForm: IPDInput = {
  bedId: "",
  dischargeDate: "",
  grantsOrDiscounts: 0,
  note: "",
  patientId: ""
};

export default function CreateIPDDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState<IPDInput>({ ...defaultForm });
  const [loading, setLoading] = useState(false);
  const [selectedBedDetails, setSelectedBedDetails] = useState<any>(null);

  const { createIPDRecord } = useIPDStore();
  const { beds, fetchBeds, fetchBedById } = useBedStore();

  useEffect(() => {
    if (open) {
      fetchBeds();
      setSelectedBedDetails(null);
    }
  }, [open, fetchBeds]);

  const handleBedSelect = async (bedId: string) => {
    setForm({ ...form, bedId });
    if (bedId) {
      const bedData = await fetchBedById(bedId);
      setSelectedBedDetails(bedData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createIPDRecord(form);
      onOpenChange(false);
      setForm({ ...defaultForm });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[65vw] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create IPD Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bed Selection */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="text-lg">Select Bed</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleBedSelect} value={form.bedId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an available bed" />
                </SelectTrigger>
                <SelectContent>
                  {beds.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.roomNumber} - {b.bedNumber} (₹{b.bedCharges}/night) [
                      {b.status}]
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Auto Details */}
          {selectedBedDetails && (
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="text-lg">Bed & Patient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bed Info */}
                <div>
                  <h4 className="font-semibold mb-2">Bed Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <p><strong>Room:</strong> {selectedBedDetails.roomNumber}</p>
                    <p><strong>Bed No:</strong> {selectedBedDetails.bedNumber}</p>
                    <p><strong>Charges:</strong> ₹{selectedBedDetails.bedCharges}/night</p>
                    <p><strong>Status:</strong> {selectedBedDetails.status}</p>
                  </div>
                </div>

                {/* Patient Info */}
                {selectedBedDetails.patient && (
                  <div>
                    <h4 className="font-semibold mb-2">Patient Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <p><strong>Name:</strong> {selectedBedDetails.patient.name}</p>
                      <p><strong>Phone:</strong> {selectedBedDetails.patient.phoneNumber}</p>
                      <p><strong>Age:</strong> {selectedBedDetails.patient.age}</p>
                      <p><strong>Gender:</strong> {selectedBedDetails.patient.gender}</p>
                      <p className="col-span-2"><strong>Address:</strong> {selectedBedDetails.patient.address}</p>
                    </div>
                  </div>
                )}

                {/* Services */}
                {selectedBedDetails.services?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Services</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Unit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBedDetails.services.map((s: any) => (
                          <TableRow key={s._id}>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>₹{s.price}</TableCell>
                            <TableCell>{s.quantity}</TableCell>
                            <TableCell>{s.unit || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Treatments */}
                {selectedBedDetails.treatments?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Treatments</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBedDetails.treatments.map((t: any) => (
                          <TableRow key={t._id}>
                            <TableCell>{t.name}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell>₹{t.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Medicines */}
                {selectedBedDetails.medicines?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Medicines</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBedDetails.medicines.map((m: any) => (
                          <TableRow key={m._id}>
                            <TableCell>{m.name}</TableCell>
                            <TableCell>{m.dosage}</TableCell>
                            <TableCell>{m.frequency}</TableCell>
                            <TableCell>₹{m.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Status */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.paymentStatus || "pending"}
                onValueChange={(value) => setForm({ ...form, paymentStatus: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>


          {/* Discharge Date */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Discharge Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={form.dischargeDate}
                onChange={(e) => setForm({ ...form, dischargeDate: e.target.value })}
                required
              />
            </CardContent>
          </Card>

          {/* Discount */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Discount</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter Grants/Discounts"
                type="number"
                value={form.grantsOrDiscounts}
                onChange={(e) =>
                  setForm({ ...form, grantsOrDiscounts: Number(e.target.value) })
                }
              />
            </CardContent>
          </Card>

          {/* Note */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Additional Note</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write any note for this IPD admission..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            disabled={loading || !form.bedId}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create IPD Record"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
