import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/types/invoice.types";
import { downloadInvoicePDF, downloadPOSReceiptPDF } from "@/services/invoice.service";
import { Download } from "lucide-react";

type DownloadInvoiceDialogProps = {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
};

export default function DownloadInvoiceDialog({
  open,
  onClose,
  invoice
}: DownloadInvoiceDialogProps) {

  const handleDownloadA4 = async () => {
    if (!invoice?._id) return;
    const blob = await downloadInvoicePDF(invoice._id);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}-A4.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPOS = async (size: "58mm" | "80mm") => {
    if (!invoice?._id) return;
    try {
      const blob = await downloadPOSReceiptPDF(invoice._id, size);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.invoiceNumber}-${size}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Download POS PDF failed:", err);
      alert(err.response?.data || "Failed to download POS PDF.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Invoice</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Button onClick={handleDownloadA4} className="bg-blue-600 hover:bg-blue-700">
            <Download/> Download A4 PDF
          </Button>
          <Button onClick={() => handleDownloadPOS("58mm")} className="bg-emerald-600 hover:bg-emerald-700">
            <Download/> Download 58mm POS
          </Button>
          <Button onClick={() => handleDownloadPOS("80mm")} className="bg-purple-600 hover:bg-purple-700">
            <Download/> Download 80mm POS
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
