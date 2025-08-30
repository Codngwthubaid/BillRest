import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PlusCircle, Trash2, Info } from "lucide-react";
import { useIPDStore } from "@/store/ipd.store";
import { useAppointmentStore } from "@/store/appointment.store";
import { useServiceStore } from "@/store/service.store";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultForm = {
  appointmentId: "",
  note: "",
  grantsOrDiscounts: 0,
  paymentStatus: "pending",
  treatments: [] as { service: string; quantity: number }[],
  otherCharges: [] as { name: string; amount: number; quantity: number }[],
};

export default function CreateOPDDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(false);

  const { createOPDRecord } = useIPDStore();
  const { appointments, fetchAppointments, loading: apptLoading } =
    useAppointmentStore();
  const { services, fetchServices, loading: serviceLoading } = useServiceStore();

  const selectedAppointment = appointments.find(
    (a) => a._id === form.appointmentId
  );

  useEffect(() => {
    if (open) {
      fetchAppointments();
      fetchServices();
    }
  }, [open]);

  const handleAddService = () => {
    setForm({
      ...form,
      treatments: [...form.treatments, { service: "", quantity: 1 }],
    });
  };

  const handleAddOtherCharge = () => {
    setForm({
      ...form,
      otherCharges: [
        ...form.otherCharges,
        { name: "", amount: 0, quantity: 1 },
      ],
    });
  };

  const calculateTotal = () => {
    let serviceTotal = form.treatments.reduce((sum, t) => {
      const s = services.find((srv) => srv._id === t.service);
      return sum + (s ? s.price * t.quantity : 0);
    }, 0);
    let otherTotal = form.otherCharges.reduce(
      (sum, oc) => sum + oc.amount * oc.quantity,
      0
    );
  return serviceTotal + otherTotal - form.grantsOrDiscounts;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOPDRecord(form);
      onOpenChange(false);
      setForm({ ...defaultForm });
    } finally {
      setLoading(false);
    }
  };

  console.log(selectedAppointment);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[70vw] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create OPD Record
          </DialogTitle>
        </DialogHeader>

        {apptLoading || serviceLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appointment Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={form.appointmentId}
                  onValueChange={(value) =>
                    setForm({ ...form, appointmentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    {(appointments ?? []).map((a) => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedAppointment && (
                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <h4 className="text-lg font-semibold mb-2">Patient Info</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {selectedAppointment.patient.name}
                      </p>
                      <p>
                        <span className="font-semibold">Age:</span>{" "}
                        {selectedAppointment.patient.age}
                      </p>
                      <p>
                        <span className="font-semibold">Gender:</span>{" "}
                        {selectedAppointment.patient.gender}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {selectedAppointment.patient.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Services</CardTitle>
                <Button type="button" variant="outline" onClick={handleAddService}>
                  <PlusCircle className="mr-2" /> Add Service
                </Button>
              </CardHeader>
              <CardContent>
                {form.treatments.length === 0 && (
                  <p className="text-gray-500">No services added yet.</p>
                )}
                {form.treatments.map((t, idx) => {
                  const selectedService = services.find((s) => s._id === t.service);
                  return (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-3 mb-4 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <Select
                          value={t.service}
                          onValueChange={(value) => {
                            const updated = [...form.treatments];
                            updated[idx].service = value;
                            setForm({ ...form, treatments: updated });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((s) => (
                              <SelectItem key={s._id} value={s._id}>
                                {s.name} (₹{s.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedService && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {selectedService.description || "No description"}
                          </div>
                        )}
                        {selectedService && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {selectedService.category || "No category"}
                          </div>
                        )}
                        {selectedService && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {selectedService.unit || "No unit"}
                          </div>
                        )}
                        {selectedService && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {selectedService.gstRate || "No GST Rate"}
                          </div>
                        )}
                      </div>
                      <Input
                        type="number"
                        value={t.quantity}
                        min={1}
                        className="w-24"
                        onChange={(e) => {
                          const updated = [...form.treatments];
                          updated[idx].quantity = parseInt(e.target.value);
                          setForm({ ...form, treatments: updated });
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const updated = form.treatments.filter((_, i) => i !== idx);
                          setForm({ ...form, treatments: updated });
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Other Charges */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Other Charges</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddOtherCharge}
                >
                  <PlusCircle className="mr-2" /> Add Charge
                </Button>
              </CardHeader>
              <CardContent>
                {form.otherCharges.length === 0 && (
                  <p className="text-gray-500">No extra charges added yet.</p>
                )}
                {form.otherCharges.map((oc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-3 mb-4 p-3 border rounded-lg"
                  >
                    <Input
                      placeholder="Name"
                      value={oc.name}
                      onChange={(e) => {
                        const updated = [...form.otherCharges];
                        updated[idx].name = e.target.value;
                        setForm({ ...form, otherCharges: updated });
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={oc.amount}
                      onChange={(e) => {
                        const updated = [...form.otherCharges];
                        updated[idx].amount = parseFloat(e.target.value);
                        setForm({ ...form, otherCharges: updated });
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={oc.quantity}
                      min={1}
                      onChange={(e) => {
                        const updated = [...form.otherCharges];
                        updated[idx].quantity = parseInt(e.target.value);
                        setForm({ ...form, otherCharges: updated });
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const updated = form.otherCharges.filter((_, i) => i !== idx);
                        setForm({ ...form, otherCharges: updated });
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Note & Discount */}
            <Card>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add Note"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Grants or Discounts"
                  value={form.grantsOrDiscounts}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      grantsOrDiscounts: parseFloat(e.target.value),
                    })
                  }
                />
                <Select
                  value={form.paymentStatus}
                  onValueChange={(value) =>
                    setForm({ ...form, paymentStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Total Summary */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-semibold">
                Total: ₹{calculateTotal().toFixed(2)}
              </h4>
              <Badge
                variant={form.paymentStatus === "paid" ? "default" : "secondary"}
              >
                {form.paymentStatus.toUpperCase()}
              </Badge>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Create OPD"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
