// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAppointmentStore } from "@/store/appointment.store";
// import type { CreateAppointmentPayload } from "@/types/appointment.types";
// import { Loader2 } from "lucide-react";

// interface Props {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const defaultForm: CreateAppointmentPayload = {
//   name: "",
//   phoneNumber: "",
//   address: "",
//   age: undefined,
//   gender: "",
//   description: "",
//   status: "Pending",
//   admitted: false,
// };

// export default function CreateAppointmentDialog({ open, onOpenChange }: Props) {
//   const [form, setForm] = useState<CreateAppointmentPayload>(defaultForm);
//   const [isLoading, setIsLoading] = useState(false)
//   const { createAppointment } = useAppointmentStore();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true); // start loading before API call

//     try {
//       const res = await createAppointment(form);
//       if (res) {
//         setForm(defaultForm);
//         onOpenChange(false);
//       }
//     } catch (error) {
//       console.error("Error creating appointment:", error);
//     } finally {
//       setIsLoading(false); // stop loading after API call
//     }
//   };


//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[600px] p-6 overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Create Appointment</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Patient details */}
//           <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
//             <h3 className="text-lg font-medium mb-2">Patient Details</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//               <Input
//                 placeholder="Phone Number"
//                 value={form.phoneNumber}
//                 onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//                 required
//               />
//               <Input
//                 placeholder="Address"
//                 value={form.address}
//                 onChange={(e) => setForm({ ...form, address: e.target.value })}
//               />
//               <Input
//                 type="number"
//                 placeholder="Age"
//                 value={form.age ?? ""}
//                 onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
//               />
//               <Select
//                 value={form.gender}
//                 onValueChange={(value) => setForm({ ...form, gender: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Gender" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Male">Male</SelectItem>
//                   <SelectItem value="Female">Female</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Additional details */}
//           <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
//             <h3 className="text-lg font-medium mb-2">Appointment Details</h3>
//             <Input
//               placeholder="Description / Symptoms"
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-base font-medium">Status</label>
//                 <Select
//                   value={form.status ?? "Pending"}
//                   onValueChange={(value) =>
//                     setForm({ ...form, status: value as "Pending" | "Admitted" | "Discharged" })
//                   }
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Pending">Pending</SelectItem>
//                     <SelectItem value="Admitted">Admitted</SelectItem>
//                     <SelectItem value="Discharged">Discharged</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <label className="text-base font-medium">Admitted</label>
//                 <Select
//                   value={form.admitted ? "Yes" : "No"}
//                   onValueChange={(value) =>
//                     setForm({ ...form, admitted: value === "Yes" })
//                   }
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Admitted?" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Yes">Yes</SelectItem>
//                     <SelectItem value="No">No</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           <Button
//             type="submit"
//             disabled={isLoading}
//             className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               "Create Appointment"
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }




import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppointmentStore } from "@/store/appointment.store";
import { usePatientStore } from "@/store/patient.store";
import type { CreateAppointmentPayload } from "@/types/appointment.types";
import type { Patient } from "@/types/patient.types";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultForm: CreateAppointmentPayload = {
  name: "",
  phoneNumber: "",
  address: "",
  age: undefined,
  gender: "",
  description: "",
  status: "Pending",
  admitted: false,
};

export default function CreateAppointmentDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState<CreateAppointmentPayload>(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const { createAppointment } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();

  // Fetch patients when modal opens
  useEffect(() => {
    if (open) {
      fetchPatients();
    }
  }, [open, fetchPatients]);

  // Auto-fill form when patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      const patient = patients.find((p) => p._id === selectedPatientId);
      if (patient) {
        setForm((prev) => ({
          ...prev,
          name: patient.name,
          phoneNumber: patient.phoneNumber,
          address: patient.address || "",
          age: patient.age,
          gender: patient.gender || "",
        }));
      }
    } else {
      setForm(defaultForm);
    }
  }, [selectedPatientId, patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await createAppointment(form);
      if (res) {
        setForm(defaultForm);
        setSelectedPatientId(null);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-full sm:max-w-[600px] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Select Existing Patient</h3>
            <Select
              value={selectedPatientId || "new"}
              onValueChange={(value) =>
                setSelectedPatientId(value === "new" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Patient</SelectItem>
                {patients.map((patient: Patient) => (
                  <SelectItem key={patient._id} value={patient._id}>
                    {patient.name} - {patient.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

          {/* Patient details */}
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Patient Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={!!selectedPatientId}
              />
              <Input
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                required
                disabled={!!selectedPatientId}
              />
              <Input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                disabled={!!selectedPatientId}
              />
              <Input
                type="number"
                placeholder="Age"
                value={form.age ?? ""}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                disabled={!!selectedPatientId}
              />
              <Select
                value={form.gender}
                onValueChange={(value) => setForm({ ...form, gender: value })}
                disabled={!!selectedPatientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional details */}
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-medium mb-2">Appointment Details</h3>
            <Input
              placeholder="Description / Symptoms"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-base font-medium">Status</label>
                <Select
                  value={form.status ?? "Pending"}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value as "Pending" | "Admitted" | "Discharged" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Admitted">Admitted</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-base font-medium">Admitted</label>
                <Select
                  value={form.admitted ? "Yes" : "No"}
                  onValueChange={(value) => setForm({ ...form, admitted: value === "Yes" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Admitted?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Appointment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
