import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { CreateServicePayload } from "@/types/service.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateServiceDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState<CreateServicePayload>({
    name: "",
    description: "",
    price: 0,
    category: "",
    unit: "",
    gstRate: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ["price", "gstRate"].includes(name) ? Number(value) : value
    });
  };

  const handleSubmit = async () => {
    const { createService } = await import("@/store/service.store").then(mod => mod.useServiceStore.getState());
    await createService(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="name" placeholder="Service Name" onChange={handleChange} />
          <Input name="description" placeholder="Description" onChange={handleChange} />
          <Input name="category" placeholder="Category" onChange={handleChange} />
          <Input name="price" type="number" placeholder="Price" onChange={handleChange} />
          <Input name="unit" placeholder="Unit (e.g., session, hour)" onChange={handleChange} />
          <Input name="gstRate" type="number" placeholder="GST Rate %" onChange={handleChange} />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
