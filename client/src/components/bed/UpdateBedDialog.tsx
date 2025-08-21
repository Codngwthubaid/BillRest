import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Bed, UpdateBedPayload } from "@/types/bed.types";

interface Props {
  open: boolean;
  bed: Bed | null;
  onClose: () => void;
  onUpdate: (id: string, updatedFields: UpdateBedPayload) => void;
}

export default function UpdateBedDialog({ open, bed, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<UpdateBedPayload>({});

  useEffect(() => {
    if (bed) {
      setForm({
        roomNumber: bed.roomNumber,
        bedNumber: bed.bedNumber,
        bedCharges: bed.bedCharges,
        status: bed.status
      });
    }
  }, [bed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "bedCharges" ? Number(value) : value
    });
  };

  const handleSubmit = () => {
    if (bed?._id) {
      onUpdate(bed._id, form);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Bed</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="roomNumber" placeholder="Room Number" value={form.roomNumber || ""} onChange={handleChange} />
          <Input name="bedNumber" placeholder="Bed Number" value={form.bedNumber || ""} onChange={handleChange} />
          <Input name="bedCharges" type="number" placeholder="Bed Charges" value={form.bedCharges || 0} onChange={handleChange} />
          <select
            name="status"
            value={form.status || "Available"}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
