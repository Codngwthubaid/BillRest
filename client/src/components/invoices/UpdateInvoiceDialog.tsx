import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useProductStore } from "@/store/product.store";
import type { Invoice, UpdateInvoicePayload, InvoiceProductPayload } from "@/types/invoice.types";

interface UpdateInvoiceDialogProps {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onUpdate: (id: string, updatedFields: UpdateInvoicePayload) => void;
}

export function UpdateInvoiceDialog({
  open,
  invoice,
  onClose,
  onUpdate,
}: UpdateInvoiceDialogProps) {
  const { products, fetchProducts } = useProductStore();

  const [form, setForm] = useState<Omit<UpdateInvoicePayload, "products"> & { products: InvoiceProductPayload[] }>({
    customerName: "",
    phoneNumber: "",
    paymentMethod: "Cash",
    status: "draft",
    currency: "INR",
    customerState: "",
    businessState: "",
    products: [],
  });

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

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
        products: invoice.products.map((p) => ({
          product: products.find((prod) => prod.name === p.name)?._id ?? "",
          quantity: Number(p.quantity),
          price: Number(p.price),
          gstRate: Number(p.gstRate),
        })),
      });
    }
  }, [invoice, products]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index: number, field: keyof InvoiceProductPayload, value: string | number) => {
    const updatedProducts: InvoiceProductPayload[] = [...form.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: field === "product" ? (value as string) : Number(value),
    };
    setForm({ ...form, products: updatedProducts });
  };

  const handleSubmit = () => {
    if (invoice?._id) {
      onUpdate(invoice._id, form);
    }
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
          <Input name="customerState" value={form.customerState} onChange={handleChange} placeholder="Customer State" />
          <Input name="businessState" value={form.businessState} onChange={handleChange} placeholder="Business State" />

          <div className="grid sm:grid-cols-2 gap-4">
            <select name="currency" className="w-full border rounded p-2 text-sm" value={form.currency} onChange={handleChange}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
            </select>
            <select name="paymentMethod" className="w-full border rounded p-2 text-sm" value={form.paymentMethod} onChange={handleChange}>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>
            <select name="status" className="w-full border rounded p-2 text-sm" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {form.products.map((product, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2 border p-2 rounded-md">
              <select
                value={product.product}
                onChange={(e) => handleProductChange(idx, "product", e.target.value)}
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">Select Product</option>
                {products.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name}
                  </option>
                ))}
              </select>
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
