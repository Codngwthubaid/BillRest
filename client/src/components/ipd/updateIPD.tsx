import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIPDStore } from "@/store/ipd.store";
import { useAppointmentStore } from "@/store/appointment.store";
import { useServiceStore } from "@/store/service.store";
import type { IPDInput, IPDResponse, TreatmentInput } from "@/types/ipd.types";
import InvoicePreview from "@/components/invoices/InvoicePreview"; // Adjust for IPD preview
import POSReceipt58mm from "@/components/invoices/POSReceipt58mm"; // Adjust for IPD
import POSReceipt80mm from "@/components/invoices/POSReceipt80mm"; // Adjust for IPD
import InvoiceActionsDialog from "@/components/invoices/InvoiceActionsDialog"; // Adjust for IPD actions
import { updateIPD, dischargeIPD } from "@/services/ipd.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ipd: IPDResponse | null;
  onUpdate: (id: string, updatedFields: Partial<IPDInput>) => Promise<void>;
}

interface FormTreatmentInput extends TreatmentInput {
  price: number;
  gstRate: number;
  category: string;
}

export default function UpdateIPD({ open, onOpenChange, ipd, onUpdate }: Props) {
  const [form, setForm] = useState<IPDInput>({
    patientId: "",
    appointmentId: "",
    isNewPatient: false,
    admissionDate: new Date().toISOString().split("T")[0],
    bedNumber: "",
    bedCharges: 0,
    otherCharges: [],
    grantsOrDiscounts: 0,
    treatments: [],
  });
  const [previewType, setPreviewType] = useState<"A4" | "58mm" | "80mm">("A4");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: previewRef });

  const { fetchIPDs } = useIPDStore();
  const { appointments, fetchAppointments } = useAppointmentStore();
  const { services, fetchServices } = useServiceStore();

  useEffect(() => {
    if (open && ipd) {
      fetchAppointments();
      fetchServices();
      // Initialize form with existing IPD data
      setForm({
        patientId: ipd.patient._id,
        appointmentId: ipd.appointment || "",
        isNewPatient: ipd.isNewPatient || false,
        admissionDate: ipd.admissionDate?.split("T")[0] || new Date().toISOString().split("T")[0],
        bedNumber: ipd.bedNumber,
        bedCharges: ipd.billing.bedCharges,
        otherCharges: ipd.billing.otherCharges || [],
        grantsOrDiscounts: ipd.billing.grantsOrDiscounts || 0,
        treatments: ipd.treatments.map((t) => ({
          service: t.service._id,
          quantity: t.quantity,
          price: t.service.price,
          gstRate: t.service.gstRate,
          category: t.service.category || "",
        })),
      });
    }
  }, [open, ipd, fetchAppointments, fetchServices]);

  const handleAppointmentSelect = (appointmentId: string) => {
    const selectedAppointment = appointments.find((appt) => appt._id === appointmentId);
    if (selectedAppointment) {
      setForm({
        ...form,
        patientId: selectedAppointment.patient._id,
        appointmentId,
        isNewPatient: false,
      });
    }
  };

  const handleAddTreatment = () => {
    setForm({
      ...form,
      treatments: [...(form.treatments || []), { service: "", quantity: 0, price: 0, gstRate: 0, category: "" }],
    });
  };

  const handleAddOtherCharge = () => {
    setForm({
      ...form,
      otherCharges: [...(form.otherCharges || []), { itemName: "", amount: 0 }],
    });
  };

  const handleServiceSelect = (idx: number, serviceId: string) => {
    const selectedService = services.find((s) => s._id === serviceId);
    if (selectedService) {
      const updatedTreatments = [...(form.treatments || [])] as FormTreatmentInput[];
      updatedTreatments[idx] = {
        ...updatedTreatments[idx],
        service: serviceId,
        price: selectedService.price,
        gstRate: selectedService.gstRate,
        category: selectedService.category || "",
      };
      setForm({ ...form, treatments: updatedTreatments });
    }
  };

  const handleChangeTreatmentField = (idx: number, field: string, value: any) => {
    const updatedTreatments = [...(form.treatments || [])] as FormTreatmentInput[];
    updatedTreatments[idx] = {
      ...updatedTreatments[idx],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setForm({ ...form, treatments: updatedTreatments });
  };

  const handleChangeOtherChargeField = (idx: number, field: string, value: any) => {
    const updatedOtherCharges = [...(form.otherCharges || [])];
    updatedOtherCharges[idx] = {
      ...updatedOtherCharges[idx],
      [field]: field === "itemName" ? value : Number(value),
    };
    setForm({ ...form, otherCharges: updatedOtherCharges });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipd?._id) return;
    const updatedFields: Partial<IPDInput> = {
      patientId: form.patientId,
      appointmentId: form.appointmentId,
      isNewPatient: form.isNewPatient,
      admissionDate: form.admissionDate,
      bedNumber: form.bedNumber,
      bedCharges: form.bedCharges,
      otherCharges: form.otherCharges,
      grantsOrDiscounts: form.grantsOrDiscounts,
      treatments: (form.treatments || []).map((t) => ({
        service: t.service,
        quantity: t.quantity,
        price: t.price,
        gstRate: t.gstRate,
        category: t.category,
      })),
    };
    await onUpdate(ipd._id, updatedFields);
    onOpenChange(false);
    setActionDialogOpen(true);
  };

  const handleDischarge = async () => {
    if (!ipd?._id) return;
    await dischargeIPD(ipd._id, new Date().toISOString());
    await fetchIPDs();
    onOpenChange(false);
  };

  const safePrint = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => handlePrint());
    });
  };

  const handlePrintA4 = () => {
    setPreviewType("A4");
    safePrint();
  };

  const handlePrint58mm = () => {
    setPreviewType("58mm");
    safePrint();
  };

  const handlePrint80mm = () => {
    setPreviewType("80mm");
    safePrint();
  };

  const previewIPD: IPDResponse = {
    _id: ipd?._id || "",
    ipdNumber: ipd?.ipdNumber || "PREVIEW",
    patient: {
      _id: form.patientId,
      name: appointments.find((appt) => appt._id === form.appointmentId)?.patient.name || ipd?.patient.name || "",
      phoneNumber:
        appointments.find((appt) => appt._id === form.appointmentId)?.patient.phoneNumber ||
        ipd?.patient.phoneNumber ||
        "",
      age: appointments.find((appt) => appt._id === form.appointmentId)?.patient.age || ipd?.patient.age || 0,
      gender: appointments.find((appt) => appt._id === form.appointmentId)?.patient.gender || ipd?.patient.gender || "",
      address: appointments.find((appt) => appt._id === form.appointmentId)?.patient.address || ipd?.patient.address || "",
    },
    clinic: ipd?.clinic || "",
    appointment: form.appointmentId,
    isNewPatient: form.isNewPatient || false,
    admissionDate: form.admissionDate || new Date().toISOString(),
    bedNumber: form.bedNumber,
    treatments: (form.treatments || []).map((t: FormTreatmentInput) => ({
      service: {
        _id: t.service,
        name: services.find((s) => s._id === t.service)?.name || "",
        price: t.price,
        gstRate: t.gstRate,
        category: t.category,
      },
      quantity: t.quantity,
      totalCharges: t.price * t.quantity,
    })),
    billing: {
      bedCharges: form.bedCharges || 0,
      serviceCharges: (form.treatments || []).reduce(
        (sum, t: FormTreatmentInput) => sum + t.price * t.quantity,
        0
      ),
      otherCharges: form.otherCharges || [],
      grantsOrDiscounts: form.grantsOrDiscounts || 0,
      totalBeforeDiscount:
        (form.bedCharges || 0) +
        (form.treatments || []).reduce((sum, t: FormTreatmentInput) => sum + t.price * t.quantity, 0) +
        (form.otherCharges || []).reduce((sum, oc) => sum + oc.amount, 0),
      finalAmount:
        (form.bedCharges || 0) +
        (form.treatments || []).reduce((sum, t: FormTreatmentInput) => sum + t.price * t.quantity, 0) +
        (form.otherCharges || []).reduce((sum, oc) => sum + oc.amount, 0) -
        (form.grantsOrDiscounts || 0),
      paidAmount: ipd?.billing.paidAmount || 0,
      paymentStatus: ipd?.billing.paymentStatus || "pending",
    },
    paymentStatus: ipd?.paymentStatus || "pending",
    status: ipd?.status || "Admitted",
    createdAt: ipd?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[60vw] p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update IPD Record</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient and Admission Details */}
            <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
              <h3 className="text-lg font-medium mb-2">Patient & Admission Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Appointment</label>
                  <Select onValueChange={handleAppointmentSelect} value={form.appointmentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment by patient name" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointments.map((appt) => (
                        <SelectItem key={appt._id} value={appt._id}>
                          {appt.patient.name} / {appt.appointmentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Patient ID</label>
                  <Input placeholder="Patient ID" value={form.patientId} readOnly className="bg-gray-100" />
                </div>
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
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Bed Number</label>
                  <Input
                    placeholder="Bed Number"
                    value={form.bedNumber}
                    onChange={(e) => setForm({ ...form, bedNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Bed Charges</label>
                  <Input
                    placeholder="Bed Charges"
                    type="number"
                    value={form.bedCharges}
                    onChange={(e) => setForm({ ...form, bedCharges: Number(e.target.value) })}
                  />
                </div>
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
                {(form.treatments || []).map((t: FormTreatmentInput, idx: number) => (
                  <div key={idx} className="grid grid-cols-2 gap-4 items-start bg-white p-3 rounded-lg shadow-sm">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Service</label>
                      <Select onValueChange={(value) => handleServiceSelect(idx, value)} value={t.service}>
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
                          value={t.quantity}
                          onChange={(e) => handleChangeTreatmentField(idx, "quantity", e.target.value)}
                        />
                        <label className="text-xs text-gray-500 mb-1 block">Price</label>
                        <Input type="number" value={t.price} readOnly className="bg-gray-100" />
                        <label className="text-xs text-gray-500 mb-1 block">Category</label>
                        <Input type="text" value={t.category} readOnly className="bg-gray-100" />
                        <label className="text-xs text-gray-500 mb-1 block">GST Rate (%)</label>
                        <Input type="number" value={t.gstRate} readOnly className="bg-gray-100" />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const updated = [...(form.treatments || [])];
                            updated.splice(idx, 1);
                            setForm({ ...form, treatments: updated });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={handleAddTreatment}>
                + Add Treatment
              </Button>
            </div>

            {/* Other Charges */}
            <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
              <h3 className="text-lg font-medium mb-2">Other Charges</h3>
              <div className="space-y-4">
                {(form.otherCharges || []).map((oc, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-4 items-start bg-white p-3 rounded-lg shadow-sm">
                    <div>
                      <label className="text-sm font-medium Gaspar-700 mb-1 block">Item Name</label>
                      <Input
                        value={oc.itemName}
                        onChange={(e) => handleChangeOtherChargeField(idx, "itemName", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Amount</label>
                        <Input
                          type="number"
                          value={oc.amount}
                          onChange={(e) => handleChangeOtherChargeField(idx, "amount", e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const updated = [...(form.otherCharges || [])];
                            updated.splice(idx, 1);
                            setForm({ ...form, otherCharges: updated });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={handleAddOtherCharge}>
                + Add Other Charge
              </Button>
            </div>

            <div className="flex gap-4 w-full">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Update Bill
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleDischarge}
              >
                Discharge
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <InvoiceActionsDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        onPrintA4={handlePrintA4}
        onPrint58mm={handlePrint58mm}
        onPrint80mm={handlePrint80mm}
      />

      {/* <div style={{ display: "none" }}>
        <div ref={previewRef}>
          {previewType === "A4" && <InvoicePreview invoice={previewIPD} />}
          {previewType === "58mm" && <POSReceipt58mm business={{}} invoice={previewIPD} />}
          {previewType === "80mm" && <POSReceipt80mm business={{}} invoice={previewIPD} />}
        </div>
      </div> */}
    </>
  );
}