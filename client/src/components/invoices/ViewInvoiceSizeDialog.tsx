import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InvoicePreview from "./InvoicePreview";
import POSReceipt58mm from "./POSReceipt58mm";
import POSReceipt80mm from "./POSReceipt80mm";
import type { Invoice } from "@/types/invoice.types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { File } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  previewType?: "A4" | "58mm" | "80mm";
}

export default function ViewInvoiceSizeDialog({ open, onClose, invoice, previewType }: Props) {
  const [viewType, setViewType] = useState<"select" | "A4" | "58mm" | "80mm">("select");

  const resetAndClose = () => {
    setViewType("select");
    onClose();
  };

  useEffect(() => {
    if (open && previewType) {
      setViewType(previewType);
    }
  }, [open, previewType]);

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">View Invoice</DialogTitle>
        </DialogHeader>

        {viewType === "select" && (
          <div className="flex flex-col gap-4 mt-4">
            <Button onClick={() => setViewType("A4")} className="bg-blue-600 hover:bg-blue-700">
              <File /> View A4 Invoice
            </Button>
            <Button onClick={() => setViewType("58mm")} className="bg-green-600 hover:bg-green-700">
              <File /> View 58mm POS Receipt
            </Button>
            <Button onClick={() => setViewType("80mm")} className="bg-emerald-600 hover:bg-emerald-700">
              <File /> View 80mm POS Receipt
            </Button>
          </div>
        )}

        {viewType !== "select" && invoice && (
          <div className="mt-4">
            {viewType === "A4" && <InvoicePreview invoice={invoice} />}
            {viewType === "58mm" && (
              <POSReceipt58mm
                business={{ businessName: "BillRest", address: "Your Business Address Line" }}
                invoice={invoice}
              />
            )}
            {viewType === "80mm" && (
              <POSReceipt80mm
                business={{ businessName: "BillRest", address: "Your Business Address Line" }}
                invoice={invoice}
              />
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

