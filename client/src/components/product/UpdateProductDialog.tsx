import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product.types";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onUpdate: (id: string, updatedFields: Partial<Product>) => void;
}

export default function UpdateProductDialog({ open, product, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setForm({ ...product });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "price" || name === "stock" || name === "costPrice" || name === "gstRate" ? Number(value) : value });
  };

  const handleSubmit = () => {
    if (product?._id) {
      onUpdate(product._id, form);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="name" placeholder="Product Name" value={form.name || ""} onChange={handleChange} />
          <Input name="description" placeholder="Description" value={form.description || ""} onChange={handleChange} />
          <Input name="price" placeholder="Price" type="number" value={form.price || 0} onChange={handleChange} />
          <Input name="costPrice" placeholder="Cost Price" type="number" value={form.costPrice || 0} onChange={handleChange} />
          <Input name="stock" placeholder="Stock Quantity" type="number" value={form.stock || 0} onChange={handleChange} />
          <Input name="unit" placeholder="Unit" value={form.unit || ""} onChange={handleChange} />
          <Input name="gstRate" placeholder="GST Rate %" type="number" value={form.gstRate || 0} onChange={handleChange} />
          <Input name="barcode" placeholder="Barcode" value={form.barcode || ""} onChange={handleChange} />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
