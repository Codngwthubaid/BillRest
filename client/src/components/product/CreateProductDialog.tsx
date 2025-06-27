import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Product } from "@/types/product.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProductDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState<Omit<Product, "_id">>({
    name: "",
    description: "",
    price: 0,
    costPrice: 0,
    stock: 0,
    unit: "",
    category : "",
    gstRate: 0,
    barcode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "price" || name === "stock" || name === "costPrice" || name === "gstRate" ? Number(value) : value });
  };

  const handleSubmit = async () => {
    const { addProduct } = await import("@/store/product.store").then(mod => mod.useProductStore.getState());
    await addProduct(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="name" placeholder="Product Name" onChange={handleChange} />
          <Input name="description" placeholder="Description" onChange={handleChange} />
          <Input name="category" placeholder="Category" onChange={handleChange} />
          <Input name="price" placeholder="Price" type="number" onChange={handleChange} />
          <Input name="costPrice" placeholder="Cost Price" type="number" onChange={handleChange} />
          <Input name="stock" placeholder="Stock Quantity" type="number" onChange={handleChange} />
          <Input name="unit" placeholder="Unit (e.g., pcs, kg)" onChange={handleChange} />
          <Input name="gstRate" placeholder="GST Rate %" type="number" onChange={handleChange} />
          <Input name="barcode" placeholder="Barcode" onChange={handleChange} />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
