import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Bed, UpdateBedPayload } from "@/types/bed.types";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useServiceStore } from "@/store/service.store"; // ✅ Import store

interface Props {
  open: boolean;
  bed: Bed | null;
  onClose: () => void;
  onUpdate: (id: string, updatedFields: UpdateBedPayload) => void;
}

export default function UpdateBedDialog({ open, bed, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<UpdateBedPayload>({
    services: [],
    treatments: [],
    medicines: []
  });
  console.log("UpdateBedDialog render with bed:", bed);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  // ✅ Get services from Zustand store
  const { services, fetchServices } = useServiceStore();

  useEffect(() => {
    if (open) {
      fetchServices(); // ✅ Load services when dialog opens
    }
  }, [open, fetchServices]);

  useEffect(() => {
    if (bed) {
      setForm({
        roomNumber: bed.roomNumber,
        bedNumber: bed.bedNumber,
        bedCharges: bed.bedCharges,
        services: bed.services || [],
        treatments: bed.treatments || [],
        medicines: bed.medicines || []
      });
    }
  }, [bed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "bedCharges" ? Number(value) : value
    });
  };

  const handleSubmit = () => {
    if (bed?._id) {
      onUpdate(bed._id, form);
      onClose();
    }
  };

  const addSelectedService = () => {
    const selectedService = services.find(s => s._id === selectedServiceId);
    if (selectedService) {
      setForm({
        ...form,
        services: [
          ...(form.services || []),
          {
            service: selectedService._id,
            name: selectedService.name,
            quantity: 1,
            price: selectedService.price,
            category: selectedService.category,
            unit: selectedService.unit,
            gstRate: selectedService.gstRate
          }
        ]
      });
      setSelectedServiceId("");
    }
  };

  const updateServiceField = (index: number, field: string, value: any) => {
    const updated = [...(form.services || [])];
    updated[index][field] = value;
    setForm({ ...form, services: updated });
  };

  const removeService = (index: number) => {
    const updated = form.services?.filter((_, i) => i !== index);
    setForm({ ...form, services: updated });
  };

  // ✅ Add/Remove treatments
  const addTreatment = () => {
    setForm({
      ...form,
      treatments: [...(form.treatments || []), { name: "", description: "", price: 0 }]
    });
  };

  const updateTreatment = (index: number, field: string, value: any) => {
    const updated = [...(form.treatments || [])];
    updated[index][field] = value;
    setForm({ ...form, treatments: updated });
  };

  const removeTreatment = (index: number) => {
    const updated = form.treatments?.filter((_, i) => i !== index);
    setForm({ ...form, treatments: updated });
  };

  // ✅ Add/Remove medicines
  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [...(form.medicines || []), { name: "", dosage: "", frequency: "", price: 0 }]
    });
  };

  const updateMedicine = (index: number, field: string, value: any) => {
    const updated = [...(form.medicines || [])];
    updated[index][field] = value;
    setForm({ ...form, medicines: updated });
  };

  const removeMedicine = (index: number) => {
    const updated = form.medicines?.filter((_, i) => i !== index);
    setForm({ ...form, medicines: updated });
  };

  console.log("Rendering UpdateBedDialog with form:", form);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Bed</DialogTitle>
        </DialogHeader>

        {/* Basic Bed Info */}
        <div className="space-y-4">
          <Input name="roomNumber" placeholder="Room Number" value={form.roomNumber || ""} onChange={handleChange} />
          <Input name="bedNumber" placeholder="Bed Number" value={form.bedNumber || ""} onChange={handleChange} />
          <Input name="bedCharges" type="number" placeholder="Bed Charges" value={form.bedCharges || 0} onChange={handleChange} />
        </div>

        {/* Services Section */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Services</h3>

          {/* Dropdown to select service */}
          <div className="flex gap-2 mb-4">
            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service._id} value={service._id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addSelectedService} disabled={!selectedServiceId}>
              Add
            </Button>
          </div>

          {/* Added Services */}
          {(form.services || []).map((service, index) => (
            <div key={index} className="border rounded p-3 mb-2 bg-gray-50">
              <p><strong>Name:</strong> {service.name}</p>
              <p><strong>Category:</strong> {service.category}</p>
              <p><strong>Unit:</strong> {service.unit}</p>
              <p><strong>GST:</strong> {service.gstRate}%</p>
              <div className="flex gap-2 mt-2">
                <Input type="number" placeholder="Quantity" value={service.quantity} onChange={(e) => updateServiceField(index, "quantity", Number(e.target.value))} />
                <Input type="number" placeholder="Price" value={service.price} onChange={(e) => updateServiceField(index, "price", Number(e.target.value))} />
                <Button variant="destructive" onClick={() => removeService(index)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Treatments Section */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Treatments</h3>
          {(form.treatments || []).map((treatment, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input placeholder="Name" value={treatment.name} onChange={(e) => updateTreatment(index, "name", e.target.value)} />
              <Input placeholder="Description" value={treatment.description} onChange={(e) => updateTreatment(index, "description", e.target.value)} />
              <Input type="number" placeholder="Price" value={treatment.price} onChange={(e) => updateTreatment(index, "price", Number(e.target.value))} />
              <Button variant="destructive" onClick={() => removeTreatment(index)}>X</Button>
            </div>
          ))}
          <Button onClick={addTreatment} className="mt-2 bg-green-600">Add Treatment</Button>
        </div>

        {/* Medicines Section */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Medicines</h3>
          {(form.medicines || []).map((medicine, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input placeholder="Name" value={medicine.name} onChange={(e) => updateMedicine(index, "name", e.target.value)} />
              <Input placeholder="Dosage" value={medicine.dosage} onChange={(e) => updateMedicine(index, "dosage", e.target.value)} />
              <Input placeholder="Frequency" value={medicine.frequency} onChange={(e) => updateMedicine(index, "frequency", e.target.value)} />
              <Input type="number" placeholder="Price" value={medicine.price} onChange={(e) => updateMedicine(index, "price", Number(e.target.value))} />
              <Button variant="destructive" onClick={() => removeMedicine(index)}>X</Button>
            </div>
          ))}
          <Button onClick={addMedicine} className="mt-2 bg-green-600">Add Medicine</Button>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="destructive" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
