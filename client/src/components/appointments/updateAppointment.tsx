// import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAppointmentStore } from "@/store/appointment.store";
// import type { Appointment, UpdateAppointmentPayload } from "@/types/appointment.types";
// import { Loader2 } from "lucide-react"; // 👈 spinner icon

// interface Props {
//   open: boolean;
//   appointment: Appointment | null;
//   onClose: () => void;
// }

// export default function UpdateAppointmentDialog({
//   open,
//   appointment,
//   onClose,
// }: Props) {
//   const [form, setForm] = useState<UpdateAppointmentPayload>({});
//   const [loading, setLoading] = useState(false); // 👈 loader state
//   const { updateAppointment, fetchAppointments } = useAppointmentStore();

//   useEffect(() => {
//     if (appointment) {
//       const patient = appointment.patient ?? {};

//       setForm({
//         appointmentNumber: appointment.appointmentNumber,
//         name: patient.name ?? "",
//         phoneNumber: patient.phoneNumber ?? "",
//         address: patient.address ?? "",
//         age: patient.age ?? 0,
//         gender: patient.gender ?? "",
//         description: appointment.description ?? "",
//         status: appointment.status ?? "Pending",
//         admitted: appointment.admitted ?? false,
//       });
//     }
//   }, [appointment]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!appointment?._id) return;
//     setLoading(true);
//     try {
//       await updateAppointment(appointment._id, form);
//       await fetchAppointments();
//       onClose();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[600px] p-6 overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Update Appointment</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Patient Details */}
//           <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
//             <h3 className="text-lg font-medium mb-2">Patient Details</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 placeholder="Name"
//                 value={form.name ?? ""}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />
//               <Input
//                 placeholder="Phone Number"
//                 value={form.phoneNumber ?? ""}
//                 onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//               />
//               <Input
//                 placeholder="Address"
//                 value={form.address ?? ""}
//                 onChange={(e) => setForm({ ...form, address: e.target.value })}
//               />
//               <Input
//                 type="number"
//                 placeholder="Age"
//                 value={form.age ?? ""}
//                 onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
//               />
//               <Select
//                 value={form.gender ?? ""}
//                 onValueChange={(value) => setForm({ ...form, gender: value })}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Gender" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Male">Male</SelectItem>
//                   <SelectItem value="Female">Female</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Appointment Details */}
//           <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
//             <h3 className="text-lg font-medium mb-2">Appointment Details</h3>
//             <Input
//               placeholder="Description / Symptoms"
//               value={form.description ?? ""}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-base font-medium">Status</label>
//                 <Select
//                   value={form.status ?? "Pending"}
//                   onValueChange={(value) =>
//                     setForm({ ...form, status: value as "Pending" | "Admitted" | "Discharged" })
//                   }
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Pending">Pending</SelectItem>
//                     <SelectItem value="Admitted">Admitted</SelectItem>
//                     <SelectItem value="Discharged">Discharged</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <label className="text-base font-medium">Admitted</label>
//                 <Select
//                   value={form.admitted ? "Yes" : "No"}
//                   onValueChange={(value) =>
//                     setForm({ ...form, admitted: value === "Yes" })
//                   }
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Admitted?" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Yes">Yes</SelectItem>
//                     <SelectItem value="No">No</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {/* Submit Button with Loader */}
//           <Button
//             type="submit"
//             className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
//             disabled={loading}
//           >
//             {loading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Updating...
//               </div>
//             ) : (
//               "Update Appointment"
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }



import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useAppointmentStore } from "@/store/appointment.store";
import type { Appointment } from "@/types/appointment.types";

interface Props {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

export default function UpdateAppointmentDialog({ open, appointment, onClose }: Props) {
  const { updateAppointment, fetchAppointments } = useAppointmentStore();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots("09:00", "18:00", 30);

  useEffect(() => {
    if (appointment) {
      setSelectedDate(appointment.date ? new Date(appointment.date) : null);
      setSelectedTime(appointment.time ?? null);
    }
  }, [appointment]);

  function generateTimeSlots(start: string, end: string, interval: number) {
    const slots: string[] = [];
    let [hour, minute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    while (hour < endHour || (hour === endHour && minute < endMinute)) {
      slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
      minute += interval;
      if (minute >= 60) {
        hour++;
        minute -= 60;
      }
    }
    return slots;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment?._id) return;

    if (!selectedDate) return alert("Please select an appointment date.");
    if (!selectedTime) return alert("Please select an appointment time.");

    setLoading(true);
    try {
      await updateAppointment(appointment._id, {
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
      });

      await fetchAppointments();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[600px] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Appointment Date & Time</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Calendar & Time Slots */}
          <div className="flex flex-col md:flex-row gap-6">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            {selectedDate && (
              <div className="w-full">
                <h3 className="font-semibold mb-2">Available Time Slots</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            ) : (
              "Update Appointment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
