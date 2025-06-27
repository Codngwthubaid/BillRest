import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteInvoiceDialogProps {
  open: boolean;
  invoiceNumber: string;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function DeleteInvoiceDialog({ open, invoiceNumber, onClose, onConfirmDelete }: DeleteInvoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Invoice</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete invoice <strong>{invoiceNumber}</strong>?</p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirmDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
