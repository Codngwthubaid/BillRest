import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [status, setStatus] = useState<string>("Scheduled");
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots("09:00", "18:00", 30);

  useEffect(() => {
    if (appointment) {
      setSelectedDate(appointment.date ? new Date(appointment.date) : null);
      setSelectedTime(appointment.time ?? null);
      setStatus(appointment.status || "Scheduled"); // ✅ Pre-fill with current status
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
        status // ✅ Include status in payload
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
          <DialogTitle>Update Appointment</DialogTitle>
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

          {/* ✅ Status Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2">Appointment Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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
