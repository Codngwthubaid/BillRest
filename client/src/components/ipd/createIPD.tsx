import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIPDStore } from "@/store/ipd.store";
import { usePatientStore } from "@/store/patient.store"; // ✅ new
import { useServiceStore } from "@/store/service.store";
import { useBedStore } from "@/store/bed.store"; // ✅ new
import type { IPDInput } from "@/types/ipd.types";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultForm: IPDInput = {
  patientId: "",
  isNewPatient: false,
  admissionDate: new Date().toISOString().split("T")[0],
  bedId: "",
  grantsOrDiscounts: 0,
  treatments: [],
  note: "",
};

export default function CreateIPDDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState<IPDInput>({ ...defaultForm });
  const [loading, setLoading] = useState(false);

  const { createIPDRecord } = useIPDStore();
  const { patients, fetchPatients } = usePatientStore(); // ✅ get patients
  const { services, fetchServices } = useServiceStore();
  const { beds, fetchBeds } = useBedStore(); // ✅ get beds

  useEffect(() => {
    if (open) {
      fetchPatients();
      fetchServices();
      fetchBeds();
    }
  }, [open, fetchPatients, fetchServices, fetchBeds]);

  const handleAddTreatment = () => {
    setForm({
      ...form,
      treatments: [...(form.treatments || []), { service: "", quantity: 1, category: "", gstRate: 0, price: 0 }],
    });
  };

  // const handleServiceSelect = (idx: number, serviceId: string) => {
  //   const updatedTreatments = [...(form.treatments || [])];
  //   updatedTreatments[idx] = {
  //     ...updatedTreatments[idx],
  //     service: serviceId,
  //   };
  //   setForm({ ...form, treatments: updatedTreatments });
  // };

  const handleChangeTreatmentField = (idx: number, field: string, value: any) => {
    const updatedTreatments = [...(form.treatments || [])];
    updatedTreatments[idx] = {
      ...updatedTreatments[idx],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setForm({ ...form, treatments: updatedTreatments });
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
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[60vw] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create IPD Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient and Admission Details */}
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Patient & Admission Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Patient Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Patient</label>
                <Select
                  onValueChange={(patientId) => setForm({ ...form, patientId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.length > 0 &&
                      patients.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name} ({p.phoneNumber})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Admission Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Admission Date</label>
                <Input
                  placeholder="Admission Date"
                  type="date"
                  value={form.admissionDate}
                  onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                  required
                />
              </div>

              {/* Bed Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Bed</label>
                <Select
                  onValueChange={(bedId) => setForm({ ...form, bedId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select available bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {beds.length > 0 &&
                      beds
                        .filter((b) => b.status === "Available")
                        .map((b) => (
                          <SelectItem key={b._id} value={b._id}>
                            Room {b.roomNumber} - Bed {b.bedNumber} (₹{b.bedCharges}/night)
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Discount */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Discount</label>
                <Input
                  placeholder="Grants/Discounts"
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
              {(form.treatments || []).map((t, idx) => {
                const selectedService = services.find((svc) => svc._id === t.service);
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start bg-white p-3 rounded-lg shadow-sm"
                  >
                    {/* Service Selection */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Service
                      </label>
                      <Select
                        value={t.service}
                        onValueChange={(value) => {
                          const svc = services.find((s) => s._id === value);
                          const updatedTreatments = [...(form.treatments || [])];
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

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Quantity */}
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
                        <Input
                          type="number"
                          min={1}
                          value={t.quantity}
                          onChange={(e) =>
                            handleChangeTreatmentField(idx, "quantity", e.target.value)
                          }
                        />
                      </div>
                      {/* Price */}
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Price</label>
                        <Input
                          type="number"
                          value={selectedService?.price || t.price || 0}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      {/* GST */}
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">GST (%)</label>
                        <Input
                          type="number"
                          value={selectedService?.gstRate || t.gstRate || 0}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      {/* Category */}
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Category</label>
                        <Input
                          type="text"
                          value={selectedService?.category || t.category || ""}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const updated = [...form.treatments || []];
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

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
