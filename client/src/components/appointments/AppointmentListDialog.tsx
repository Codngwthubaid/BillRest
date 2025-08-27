import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Trash2, Search } from "lucide-react";
import { useAppointmentStore } from "@/store/appointment.store";
import { Loader2 } from "lucide-react";

interface AppointmentListDialogProps {
  open: boolean;
  onClose: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentListDialog({
  open,
  onClose,
  onEdit,
  onDelete,
}: AppointmentListDialogProps) {
  const { appointments, fetchAppointments, loading } = useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState("");


    console.log("Appointments in Dialog:", appointments);

  useEffect(() => {
    if (open) {
      fetchAppointments();
    }
  }, [open, fetchAppointments]);

  // Filter & Search Logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesSearch =
        appt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.patient?.phoneNumber?.includes(searchTerm) ||
        appt.appointmentNumber?.includes(searchTerm);

      return matchesSearch;
    });
  }, [appointments, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Appointments List
          </DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, phone, or number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Appointment Table */}
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appt. No</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <TableRow key={appt._id}>
                      <TableCell>{appt.appointmentNumber}</TableCell>
                      <TableCell>{appt?.patient?.name}</TableCell>
                      <TableCell>{appt?.patient?.phoneNumber}</TableCell>
                      <TableCell>{appt?.patient?.gender}</TableCell>
                      <TableCell>{appt?.patient?.age}</TableCell>
                      <TableCell>
                        {appt?.date ? new Date(appt.date).toLocaleDateString() : ""}
                        </TableCell>
                      <TableCell>{appt?.time}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(appt._id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => onDelete(appt._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
