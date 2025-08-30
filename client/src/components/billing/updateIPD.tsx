import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIPDStore } from "@/store/ipd.store";
import { useBedStore } from "@/store/bed.store";
import type { IPDInput, IPDResponse } from "@/types/ipd.types";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ipd: IPDResponse | null;
  onUpdate: (id: string, updatedFields: Partial<IPDInput>) => Promise<void>;
}

export default function UpdateIPD({ open, onOpenChange, ipd, onUpdate }: Props) {
  const [form, setForm] = useState<IPDInput>({
    patientId: "",
    admissionDate: new Date().toISOString().split("T")[0],
    bedId: "",
    bedCharges: 0,
    grantsOrDiscounts: 0,
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [selectedBedDetails, setSelectedBedDetails] = useState<any>(null);

  const { fetchIPDs } = useIPDStore();
  const { beds, fetchBeds, fetchBedById } = useBedStore();

  useEffect(() => {
    if (open) {
      fetchBeds();
      if (ipd) {
        setForm({
          patientId: ipd.patient?._id || "",
          admissionDate: ipd.admissionDate?.split("T")[0] || "",
          bedId: (ipd as any).bed?._id || "",
          bedCharges: ipd.billing?.bedCharges || 0,
          grantsOrDiscounts: ipd.billing?.grantsOrDiscounts || 0,
          note: (ipd as any).note || "",
        });
        if ((ipd as any).bed?._id) fetchBedById((ipd as any).bed._id).then(setSelectedBedDetails);
      }
    }
  }, [open, ipd, fetchBeds, fetchBedById]);

  const handleBedSelect = async (bedId: string) => {
    setForm({ ...form, bedId });
    if (bedId) {
      const bedData = await fetchBedById(bedId);
      setSelectedBedDetails(bedData);
      setForm((prev) => ({ ...prev, bedCharges: bedData?.bedCharges || 0 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipd?._id) return;
    setLoading(true);
    try {
      await onUpdate(ipd._id, form);
      await fetchIPDs();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = async () => {
    if (!ipd?._id) return;
    setLoading(true);
    try {
      await onUpdate(ipd._id, {
        dischargeDate: new Date().toISOString(),
        status: "Discharged",
      });
      await fetchIPDs();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const combinedItems = [
    ...(selectedBedDetails?.treatments || []).map((t: any) => ({
      type: "Treatment",
      name: t.name,
      details: t.description || "N/A",
      qty: 1,
      price: t.price,
    })),
    ...(selectedBedDetails?.services || []).map((s: any) => ({
      type: "Service",
      name: s.name,
      details: s.unit || "N/A",
      qty: s.quantity,
      price: s.price,
    })),
    ...(selectedBedDetails?.medicines || []).map((m: any) => ({
      type: "Medicine",
      name: m.name,
      details: `${m.dosage} (Freq: ${m.frequency})`,
      qty: 1,
      price: m.price,
    })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[65vw] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Update IPD Record</DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bed Selection */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <Label className="text-sm font-medium">Select Bed</Label>
              <Select onValueChange={handleBedSelect} value={form.bedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bed" />
                </SelectTrigger>
                <SelectContent>
                  {beds.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.roomNumber} - {b.bedNumber} (₹{b.bedCharges}/night) [{b.status}]
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.bedCharges > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected Bed Charges: ₹{form.bedCharges}/night
                </p>
              )}
            </CardContent>
          </Card>

          {/* Show Auto Details */}
          {selectedBedDetails && (
            <Card>
              <CardContent className="p-4 space-y-6">
                <h3 className="font-semibold text-lg">Bed & Patient Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Room:</strong> {selectedBedDetails.roomNumber}</p>
                    <p><strong>Bed No:</strong> {selectedBedDetails.bedNumber}</p>
                    <p><strong>Charges:</strong> ₹{selectedBedDetails.bedCharges}/night</p>
                  </div>
                  {selectedBedDetails.patient && (
                    <div>
                      <p><strong>Name:</strong> {selectedBedDetails.patient.name}</p>
                      <p><strong>Phone:</strong> {selectedBedDetails.patient.phoneNumber}</p>
                      <p><strong>Age:</strong> {selectedBedDetails.patient.age}</p>
                      <p><strong>Gender:</strong> {selectedBedDetails.patient.gender}</p>
                    </div>
                  )}
                </div>

                {/* Unified Table for Treatments, Services, Medicines */}
                {combinedItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Items</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {combinedItems.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.details}</TableCell>
                            <TableCell>{item.qty}</TableCell>
                            <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">₹{(item.qty * item.price).toFixed(2)}</TableCell>
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
            <CardContent className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={form.paymentStatus || "pending"}
                onValueChange={(value) => setForm({ ...form, paymentStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>



          {/* Discount */}
          <Card className="py-4">
            <CardContent className="space-y-2">
              <Label>Grants/Discounts</Label>
              <Input
                type="number"
                placeholder="Enter discount amount"
                value={form.grantsOrDiscounts}
                onChange={(e) => setForm({ ...form, grantsOrDiscounts: Number(e.target.value) })}
              />
            </CardContent>
          </Card>

          {/* Note */}
          <Card className="py-4">
            <CardContent className="space-y-2">
              <Label>Additional Note</Label>
              <Textarea
                placeholder="Write any note for this IPD admission..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleDischarge} disabled={loading}>
              Discharge
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
