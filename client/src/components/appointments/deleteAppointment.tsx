import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAppointmentDialogProps {
  open: boolean;
  patientName: string;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function DeleteAppointmentDialog({
  open,
  patientName,
  onClose,
  onConfirmDelete,
}: DeleteAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Delete Appointment</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete appointment for <strong>{patientName}</strong>?
        </p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirmDelete} className="cursor-pointer">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
