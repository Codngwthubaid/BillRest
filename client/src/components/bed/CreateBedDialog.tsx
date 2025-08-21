import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { AddBedPayload } from "@/types/bed.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateBedDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState<AddBedPayload>({
    clinic: "", // This should ideally come from the logged-in user (clinic id)
    roomNumber: "",
    bedNumber: "",
    bedCharges: 0,
    status: "Available"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "bedCharges" ? Number(value) : value
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { addBed } = await import("@/store/bed.store").then(
        (mod) => mod.useBedStore.getState()
      );
      await addBed(form);
      onOpenChange(false);
      setForm({
        clinic: "",
        roomNumber: "",
        bedNumber: "",
        bedCharges: 0,
        status: "Available"
      });
    } catch (err) {
      console.error("Create bed error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Bed</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="roomNumber" placeholder="Room Number" value={form.roomNumber} onChange={handleChange} />
          <Input name="bedNumber" placeholder="Bed Number" value={form.bedNumber} onChange={handleChange} />
          <Input name="bedCharges" type="number" placeholder="Bed Charges" value={form.bedCharges} onChange={handleChange} />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
