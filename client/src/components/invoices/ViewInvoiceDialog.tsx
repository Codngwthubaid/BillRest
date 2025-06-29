import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Invoice } from "@/types/invoice.types";
import { Badge } from "@/components/ui/badge";
import { POSPrintButton } from "@/components/invoices/POSPrintButton";

interface ViewInvoiceDialogProps {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "overdue":
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    default:
      return <Badge variant="outline">Draft</Badge>;
  }
};

export default function ViewInvoiceDialog({ open, invoice, onClose }: ViewInvoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>

        {invoice ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Number</p>
              <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{invoice.customerName}</p>
                <p className="text-sm">{invoice.phoneNumber}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <p>{invoice.paymentMethod}</p>
                <p>Status: {getStatusBadge(invoice.status)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Products</p>
              <ul className="space-y-2">
                {invoice.products.map((p, idx) => (
                  <li key={idx} className="text-sm border rounded p-2 flex justify-between items-center">
                    <span>{typeof p.product === "string" ? p.product : p.product.name}</span>
                    <span>{p.quantity} x ₹{p.price} + {p.gstRate}% GST</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <p>Subtotal: ₹{invoice.subTotal.toFixed(2)}</p>
              <p>GST: ₹{invoice.gstAmount.toFixed(2)}</p>
              <p className="font-bold">Total: ₹{invoice.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}

        <POSPrintButton invoiceId={invoice._id} />
      </DialogContent>
    </Dialog>
  );
}