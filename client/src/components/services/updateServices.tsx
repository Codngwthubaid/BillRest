import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Service } from "@/types/service.types";

interface Props {
  open: boolean;
  service: Service | null;
  onClose: () => void;
  onUpdate: (id: string, updatedFields: Partial<Service>) => void;
}

export default function UpdateServiceDialog({ open, service, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<Partial<Service>>({});

  useEffect(() => {
    if (service) {
      setForm({ ...service });
    }
  }, [service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ["price", "gstRate"].includes(name) ? Number(value) : value
    });
  };

  const handleSubmit = () => {
    if (service?._id) {
      onUpdate(service._id, form);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="name" placeholder="Service Name" value={form.name || ""} onChange={handleChange} />
          <Input name="description" placeholder="Description" value={form.description || ""} onChange={handleChange} />
          <Input name="category" placeholder="Category" value={form.category || ""} onChange={handleChange} />
          <Input name="price" type="number" placeholder="Price" value={form.price || 0} onChange={handleChange} />
          <Input name="unit" placeholder="Unit (e.g., session, hour)" value={form.unit || ""} onChange={handleChange} />
          <Input name="gstRate" type="number" placeholder="GST Rate %" value={form.gstRate || 0} onChange={handleChange} />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
