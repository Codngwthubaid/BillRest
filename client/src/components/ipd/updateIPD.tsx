import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIPDStore } from "@/store/ipd.store";
import { useServiceStore } from "@/store/service.store";
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
    bedCharges: 0, // ✅ added
    grantsOrDiscounts: 0,
    treatments: [],
    note: "",
  });

  const [loading, setLoading] = useState(false);

  const { fetchIPDs } = useIPDStore();
  const { services, fetchServices } = useServiceStore();
  const { beds, fetchBeds } = useBedStore();

  useEffect(() => {
    if (open && ipd) {
      fetchServices();
      fetchBeds();

      setForm({
        patientId: ipd.patient?._id || "",
        admissionDate: ipd.admissionDate?.split("T")[0] || "",
        bedId: (ipd as any).bed?._id || "",
        bedCharges: ipd.billing?.bedCharges || 0,
        grantsOrDiscounts: ipd.billing.grantsOrDiscounts || 0,
        treatments: ipd.treatments.map((t) => ({
          service: t.service._id,
          quantity: t.quantity,
          price: t.service.price,
          gstRate: t.service.gstRate,
          category: t.service.category || "",
        })),
        note: (ipd as any).note || "",
      });
    }
  }, [open, ipd, fetchServices, fetchBeds]);

  const handleAddTreatment = () => {
    setForm({
      ...form,
      treatments: [
        ...(form.treatments || []),
        { service: "", quantity: 1, price: 0, gstRate: 0, category: "" },
      ],
    });
  };

  const handleChangeTreatmentField = (idx: number, field: string, value: any) => {
    const updatedTreatments = [...form.treatments];
    updatedTreatments[idx] = {
      ...updatedTreatments[idx],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setForm({ ...form, treatments: updatedTreatments });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipd?._id) return;
    setLoading(true);
    try {
      const updatedFields: Partial<IPDInput> = {
        admissionDate: form.admissionDate,
        bedId: form.bedId,
        bedCharges: form.bedCharges,
        grantsOrDiscounts: form.grantsOrDiscounts,
        treatments: form.treatments,
        note: form.note,
      };
      await onUpdate(ipd._id, updatedFields);
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
        treatments: form.treatments
      });
      await fetchIPDs();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[60vw] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update IPD Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Patient & Admission Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Patient</label>
                <Input value={ipd?.patient?.name || ""} readOnly className="bg-gray-100" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Admission Date</label>
                <Input
                  type="date"
                  value={form.admissionDate}
                  onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Bed</label>
                <Select
                  value={form.bedId}
                  onValueChange={(bedId) => {
                    const selectedBed = beds.find((b) => b._id === bedId);
                    setForm({
                      ...form,
                      bedId,
                      bedCharges: selectedBed ? selectedBed.bedCharges : form.bedCharges, // ✅ preserve old if not found
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {beds.length > 0 &&
                      beds
                        .filter((b) => b.status === "Available" || b._id === form.bedId) // Include current bed even if not available
                        .map((b) => (
                          <SelectItem key={b._id} value={b._id}>
                            Room {b.roomNumber} - Bed {b.bedNumber} (₹{b.bedCharges}/night)
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>

                {form.bedCharges > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected Bed Charges: ₹{form.bedCharges}/night
                  </p>
                )}


              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Discount</label>
                <Input
                  type="number"
                  value={form.grantsOrDiscounts}
                  onChange={(e) => setForm({ ...form, grantsOrDiscounts: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Treatments */}
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Treatments</h3>
            <div className="space-y-4">
              {form.treatments.map((t, idx) => {
                const selectedService = services.find((svc) => svc._id === t.service);
                return (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 rounded-lg shadow-sm">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Service</label>
                      <Select
                        value={t.service}
                        onValueChange={(value) => {
                          const svc = services.find((s) => s._id === value);
                          const updatedTreatments = [...form.treatments];
                          updatedTreatments[idx] = {
                            ...updatedTreatments[idx],
                            service: value,
                            price: svc?.price || 0,
                            gstRate: svc?.gstRate || 0,
                            category: svc?.category || "",
                          };
                          setForm({ ...form, treatments: updatedTreatments });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((svc) => (
                            <SelectItem key={svc._id} value={svc._id}>
                              {svc.name} / {svc.category || "N/A"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
                        <Input
                          type="number"
                          min={1}
                          value={t.quantity}
                          onChange={(e) => handleChangeTreatmentField(idx, "quantity", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Price</label>
                        <Input
                          type="number"
                          value={selectedService?.price || t.price}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">GST (%)</label>
                        <Input
                          type="number"
                          value={selectedService?.gstRate || t.gstRate}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Category</label>
                        <Input
                          type="text"
                          value={selectedService?.category || t.category}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const updated = [...form.treatments];
                          updated.splice(idx, 1);
                          setForm({ ...form, treatments: updated });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button type="button" variant="outline" onClick={handleAddTreatment}>
              + Add Treatment
            </Button>
          </div>

          {/* Note */}
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Additional Note</h3>
            <Textarea
              placeholder="Write any note for this IPD admission..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update"}
            </Button>
            <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleDischarge} disabled={loading}>
              Discharge
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
