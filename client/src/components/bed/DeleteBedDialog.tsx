import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  bedNumber: string;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
}

export default function DeleteBedDialog({
  open,
  bedNumber,
  onClose,
  onConfirmDelete
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirmDelete();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-fit max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delete Bed</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>Bed #{bedNumber}</strong>?
        </p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
