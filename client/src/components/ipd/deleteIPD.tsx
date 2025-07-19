import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteBillDialogProps {
  open: boolean;
  billNumber: string;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function DeleteIPD({ open, billNumber, onClose, onConfirmDelete }: DeleteBillDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Delete Bill</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete bill <strong>{billNumber}</strong>?</p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirmDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
