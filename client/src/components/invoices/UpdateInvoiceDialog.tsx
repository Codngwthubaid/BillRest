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

export function UpdateInvoiceDialog({
  open,
  invoice,
  onClose,
  onUpdate,
}: UpdateInvoiceDialogProps) {
  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    paymentMethod: "Cash",
    status: "draft",
    currency: "INR",
    customerState: "",
    businessState: "",
    posPrint: "A4",
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
        paymentMethod: invoice.paymentMethod || "Cash",
        status: invoice.status || "draft",
        currency: invoice.currency || "INR",
        customerState: invoice.customerState || "",
        businessState: invoice.businessState || "",
        posPrint: invoice.posPrint || "A4",
        products: invoice.products.map((p) => ({
          product: typeof p.product === "string" ? p.product : (p.product as any)._id,
          quantity: p.quantity,
          price: p.price,
          gstRate: p.gstRate,
        })),
      });
    }
  }, [invoice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          <Input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
          />
          <Input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <Input
            name="customerState"
            value={form.customerState}
            onChange={handleChange}
            placeholder="Customer State"
          />
          <Input
            name="businessState"
            value={form.businessState}
            onChange={handleChange}
            placeholder="Business State"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <select
              name="currency"
              className="w-full border rounded p-2 text-sm"
              value={form.currency}
              onChange={handleChange}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
            </select>

            <select
              name="paymentMethod"
              className="w-full border rounded p-2 text-sm"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>

            <select
              name="status"
              className="w-full border rounded p-2 text-sm"
              value={form.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              name="posPrint"
              className="w-full border rounded p-2 text-sm"
              value={form.posPrint}
              onChange={handleChange}
            >
              <option value="A4">A4</option>
              <option value="80mm">80mm</option>
              <option value="58mm">58mm</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {form.products.map((product, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2 border p-2 rounded-md">
              <Input
                value={product.product}
                onChange={(e) => handleProductChange(idx, "product", e.target.value)}
                placeholder="Product ID"
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
          <Button variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Update Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
