import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import type { Invoice } from "@/types/invoice.types";

interface UpdateInvoiceDialogProps {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onUpdate: (id: string, updatedFields: Partial<Invoice>) => void;
}

export function UpdateInvoiceDialog({ open, invoice, onClose, onUpdate }: UpdateInvoiceDialogProps) {
  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    paymentMethod: "",
    status: "draft",
    currency: "",
    products: [] as {
      product: string;
      quantity: number;
      price: number;
      gstRate: number;
    }[],
  });

  useEffect(() => {
    if (invoice) {
      setForm({
        customerName: invoice.customerName || "",
        phoneNumber: invoice.phoneNumber || "",
        paymentMethod: invoice.paymentMethod || "",
        status: invoice.status || "draft",
        currency: invoice.currency || "INR",
        products: invoice.products.map((p) => ({
          product: typeof p.product === "string" ? p.product : (p.product as any)._id,
          quantity: p.quantity,
          price: p.price,
          gstRate: p.gstRate,
        })),
      });
    }
  }, [invoice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...form.products];
    (updatedProducts[index] as any)[field] = field === "product" ? value : Number(value);
    setForm({ ...form, products: updatedProducts });
  };

  const handleSubmit = () => {
    if (invoice?._id) onUpdate(invoice._id, form as Invoice);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Customer Name" />
          <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
          <Input name="paymentMethod" value={form.paymentMethod} onChange={handleChange} placeholder="Payment Method" />
          <Input name="status" value={form.status} onChange={handleChange} placeholder="Status" />
          <Input name="currency" value={form.currency} onChange={handleChange} placeholder="Currency (e.g., INR)" />

          {form.products.map((product, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2 border p-2 rounded-md">
              <Input
                value={product.product}
                onChange={(e) => handleProductChange(idx, "product", e.target.value)}
                placeholder="Product Name"
              />
              <Input
                type="number"
                value={product.quantity}
                onChange={(e) => handleProductChange(idx, "quantity", e.target.value)}
                placeholder="Quantity"
              />
              <Input
                type="number"
                value={product.price}
                onChange={(e) => handleProductChange(idx, "price", e.target.value)}
                placeholder="Price"
              />
              <Input
                type="number"
                value={product.gstRate}
                onChange={(e) => handleProductChange(idx, "gstRate", e.target.value)}
                placeholder="GST %"
              />
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Update Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
