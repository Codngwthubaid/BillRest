import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useIPDStore } from "@/store/ipd.store";
import { useServiceStore } from "@/store/service.store";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opd: any; // Existing OPD record
}

export default function UpdateOPDDialog({ open, onOpenChange, opd }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    note: "",
    grantsOrDiscounts: 0,
    paymentStatus: "pending",
    services: [],
    otherCharges: []
  });

  const { updateOPDRecord } = useIPDStore();
  const { services, fetchServices } = useServiceStore();

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Prefill form when OPD is loaded
  useEffect(() => {
    if (opd) {
      setForm({
        note: opd.note || "",
        grantsOrDiscounts: opd.billing?.grantsOrDiscounts || 0,
        paymentStatus: opd.paymentStatus || "pending",
        services: opd.treatments?.map((t: any) => ({
          serviceId: t.service?._id || t.service,
          quantity: t.quantity || 1,
        })) || [],
        otherCharges: opd.otherCharges?.map((oc: any) => ({
          name: oc.name || "",
          amount: oc.amount || 0,
          quantity: oc.quantity || 1,
        })) || []
      });
    }
  }, [opd]);

  // --- Service handlers ---
  const handleAddService = () => {
    if (services.length === 0) return;
    setForm(prev => ({
      ...prev,
      services: [...prev.services, { serviceId: services[0]._id, quantity: 1 }]
    }));
  };

  const handleServiceChange = (idx: number, serviceId: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.map((s, i) => i === idx ? { ...s, serviceId } : s)
    }));
  };

  const handleServiceQtyChange = (idx: number, quantity: number) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.map((s, i) => i === idx ? { ...s, quantity } : s)
    }));
  };

  const handleDeleteService = (idx: number) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== idx)
    }));
  };

  // --- Other Charges handlers ---
  const handleAddOtherCharge = () => {
    setForm(prev => ({
      ...prev,
      otherCharges: [...prev.otherCharges, { name: "", amount: 0, quantity: 1 }]
    }));
  };

  const handleOtherChargeChange = (idx: number, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      otherCharges: prev.otherCharges.map((oc, i) => i === idx ? { ...oc, [field]: value } : oc)
    }));
  };

  const handleDeleteOtherCharge = (idx: number) => {
    setForm(prev => ({
      ...prev,
      otherCharges: prev.otherCharges.filter((_, i) => i !== idx)
    }));
  };

  // --- Submit handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        note: form.note,
        grantsOrDiscounts: form.grantsOrDiscounts,
        paymentStatus: form.paymentStatus,
        treatments: form.services.map((s: any) => ({
          service: s.serviceId,
          quantity: s.quantity
        })),
        otherCharges: form.otherCharges
      };


      await updateOPDRecord(opd._id, payload);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[65vw] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Update OPD Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">Patient: {opd?.patient?.name}</p>
              <p className="text-sm text-gray-700">Consultation Date: {opd?.consultationDate}</p>
              <p className="text-sm text-gray-700">Current Total: ₹{opd?.billing?.finalAmount}</p>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Add Services</CardTitle>
              <Button type="button" variant="outline" onClick={handleAddService}>
                <PlusCircle className="mr-2" /> Add Service
              </Button>
            </CardHeader>
            <CardContent>
              {form.services.map((s: any, idx: number) => (
                <div key={idx} className="flex gap-2 mb-3">
                  <Select
                    value={s.serviceId}
                    onValueChange={(value) => handleServiceChange(idx, value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((srv) => (
                        <SelectItem key={srv._id} value={srv._id}>
                          {srv.name} (₹{srv.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={s.quantity}
                    min={1}
                    onChange={(e) => handleServiceQtyChange(idx, parseInt(e.target.value) || 1)}
                  />
                  <Button variant="destructive" type="button" onClick={() => handleDeleteService(idx)}>
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Other Charges */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Add Other Charges</CardTitle>
              <Button type="button" variant="outline" onClick={handleAddOtherCharge}>
                <PlusCircle className="mr-2" /> Add Charge
              </Button>
            </CardHeader>
            <CardContent>
              {form.otherCharges.map((oc: any, idx: number) => (
                <div key={idx} className="flex gap-2 mb-3">
                  <Input
                    placeholder="Name"
                    value={oc.name}
                    onChange={(e) => handleOtherChargeChange(idx, "name", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={oc.amount}
                    onChange={(e) => handleOtherChargeChange(idx, "amount", parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={oc.quantity}
                    min={1}
                    onChange={(e) => handleOtherChargeChange(idx, "quantity", parseInt(e.target.value) || 1)}
                  />
                  <Button variant="destructive" type="button" onClick={() => handleDeleteOtherCharge(idx)}>
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Note & Discounts */}
          <Card>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Update Note"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Grants or Discounts"
                value={form.grantsOrDiscounts}
                onChange={(e) => setForm({ ...form, grantsOrDiscounts: parseFloat(e.target.value) || 0 })}
              />
              <Select
                value={form.paymentStatus}
                onValueChange={(value) => setForm({ ...form, paymentStatus: value })}
              >
                <SelectTrigger><SelectValue placeholder="Payment Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Update OPD"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
