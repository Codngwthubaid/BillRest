import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ["price", "gstRate"].includes(name) ? Number(value) : value
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { createService } = await import("@/store/service.store").then(
        (mod) => mod.useServiceStore.getState()
      );
      await createService(form);
      onOpenChange(false);
      setForm({
        name: "",
        description: "",
        price: 0,
        category: "",
        unit: "",
        gstRate: 0
      }); // reset form if needed
    } catch (err) {
      console.error("Create service error:", err);
    } finally {
      setIsLoading(false);
    }
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
