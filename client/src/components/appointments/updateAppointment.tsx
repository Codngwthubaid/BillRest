import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppointmentStore } from "@/store/appointment.store";
import type { Appointment, UpdateAppointmentPayload } from "@/types/appointment.types";

interface Props {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

export default function UpdateAppointmentDialog({
  open,
  appointment,
  onClose,
}: Props) {
  const [form, setForm] = useState<UpdateAppointmentPayload>({});
  const { updateAppointment, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    if (appointment) {
      setForm({
        appointmentNumber: appointment.appointmentNumber,
        name: appointment.name,
        phoneNumber: appointment.phoneNumber,
        address: appointment.address,
        age: appointment.age,
        gender: appointment.gender,
        description: appointment.description,
        status: appointment.status,
        admitted: appointment.admitted,
      });
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment?._id) return;
    await updateAppointment(appointment._id, form);
    await fetchAppointments();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[600px] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Patient Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Phone Number"
                value={form.phoneNumber ?? ""}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={form.address ?? ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Age"
                value={form.age ?? ""}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              />
              <Select
                value={form.gender ?? ""}
                onValueChange={(value) => setForm({ ...form, gender: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Appointment Details</h3>
            <Input
              placeholder="Description / Symptoms"
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-base font-medium">Status</label>
                <Select
                  value={form.status ?? "Pending"}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value as "Pending" | "Completed" | "Canceled" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Admitted">Admitted</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-base font-medium">Admitted</label>
                <Select
                  value={form.admitted ? "Yes" : "No"}
                  onValueChange={(value) =>
                    setForm({ ...form, admitted: value === "Yes" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Admitted?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Update Appointment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
