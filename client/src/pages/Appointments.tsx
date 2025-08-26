// import { useEffect, useState } from "react";
// import { useAppointmentStore } from "@/store/appointment.store";
// import { useAuthStore } from "@/store/auth.store";
// import {
//     Loader2,
//     Calendar,
//     Clock,
//     FileText,
//     IndianRupee,
//     PenLine,
//     Trash,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import type { Appointment } from "@/types/appointment.types";
// import { Button } from "@/components/ui/button";
// import CreateAppointmentDialog from "@/components/appointments/createAppointment";
// import UpdateAppointmentDialog from "@/components/appointments/updateAppointment";
// import { DeleteAppointmentDialog } from "@/components/appointments/deleteAppointment";

// export default function Appointments() {
//     const { user } = useAuthStore();
//     const role = user?.role;

//     const {
//         appointments,
//         allAppointments,
//         fetchAppointments,
//         fetchAllAppointments,
//         deleteAppointment,
//     } = useAppointmentStore();

//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
//     const [showUpdateDialog, setShowUpdateDialog] = useState(false);
//     const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//     const [showCreateDialog, setShowCreateDialog] = useState(false);
//     const [selectedEmail, setSelectedEmail] = useState("");
//     const [selectedStatus, setSelectedStatus] = useState("");


//     useEffect(() => {
//         const fetch = async () => {
//             if (role === "support" || role === "master") {
//                 await fetchAllAppointments();
//             } else {
//                 await fetchAppointments();
//             }
//             setLoading(false);
//         };
//         fetch();
//     }, [role, fetchAppointments, fetchAllAppointments]);

//     const appointmentsList =
//         role === "support" || role === "master"
//             ? allAppointments?.appointments || []
//             : Array.isArray(appointments) ? appointments : [];

//     const uniqueEmails = Array.from(
//         new Set(appointmentsList.map(a => a.clinic?.email).filter(Boolean))
//     );


//     const summary = {
//         total: appointmentsList.length,
//         admitted: appointmentsList.filter((a: any) => a.admitted).length,
//         pending: appointmentsList.filter((a: any) => a.status === "Pending").length,
//         discharged: appointmentsList.filter((a: any) => a.status === "Discharged").length,
//     };

//     const filtered = appointmentsList.filter((app: Appointment) => {
//         const matchesSearch =
//             app.appointmentNumber.toLowerCase().includes(search.toLowerCase()) ||
//             app.patient?.name.toLowerCase().includes(search.toLowerCase());

//         const matchesEmail = !selectedEmail || app.clinic?.email === selectedEmail;
//         const matchesStatus = !selectedStatus || app.status === selectedStatus;

//         return matchesSearch && matchesEmail && matchesStatus;
//     });


//     const handleDelete = async () => {
//         if (!selectedAppointment?._id) return;
//         await deleteAppointment(selectedAppointment._id);
//         await fetchAppointments();
//         setShowDeleteDialog(false);
//     };

//     const getStatusBadge = (status: string) => {
//         switch (status) {
//             case "Admitted":
//                 return <Badge className="bg-green-100 text-green-800">Admitted</Badge>;
//             case "Completed":
//                 return <Badge className="bg-yellow-100 text-yellow-800">Completed</Badge>;
//             case "Pending":
//                 return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
//             case "Canceled":
//                 return <Badge className="bg-gray-100 text-gray-800">Canceled</Badge>;
//             default:
//                 return <Badge variant="outline">Unknown</Badge>;
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <Loader2 className="animate-spin size-12 text-blue-600" />
//             </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//                 <div>
//                     <h1 className="text-2xl font-bold">Appointments</h1>
//                     <p className="text-gray-500">Manage your appointments and admissions</p>
//                 </div>
//                 {role === "clinic" && (
//                     <>
//                         <Button
//                             onClick={() => setShowCreateDialog(true)}
//                             className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
//                         >
//                             + Create Appointment
//                         </Button>
//                         <CreateAppointmentDialog
//                             open={showCreateDialog}
//                             onOpenChange={setShowCreateDialog}
//                         />
//                     </>
//                 )}
//             </div>

//             {(role === "clinic") && (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
//                     <Card>
//                         <CardContent className="p-4">
//                             <div className="flex items-center gap-2 text-blue-600">
//                                 <FileText className="w-4 h-4" />
//                                 <span className="text-sm">Total</span>
//                             </div>
//                             <span className="font-bold text-lg">{summary.total}</span>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="p-4">
//                             <div className="flex items-center gap-2 text-green-600">
//                                 <IndianRupee className="w-4 h-4" />
//                                 <span className="text-sm">Admitted</span>
//                             </div>
//                             <span className="font-bold text-lg">{summary.admitted}</span>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="p-4">
//                             <div className="flex items-center gap-2 text-yellow-600">
//                                 <Clock className="w-4 h-4" />
//                                 <span className="text-sm">Pending</span>
//                             </div>
//                             <span className="font-bold text-lg">{summary.pending}</span>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="p-4">
//                             <div className="flex items-center gap-2 text-orange-600">
//                                 <Calendar className="w-4 h-4" />
//                                 <span className="text-sm">Discharged</span>
//                             </div>
//                             <span className="font-bold text-lg">{summary.discharged}</span>
//                         </CardContent>
//                     </Card>
//                 </div>
//             )}
//             <div className="flex flex-col sm:flex-row gap-4 mb-4">
//                 <Input
//                     placeholder="Search by appointment ID or patient name..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="w-full"
//                 />

//                 {user?.role !== "clinic" && (
//                     <select
//                         value={selectedEmail}
//                         onChange={(e) => setSelectedEmail(e.target.value)}
//                         className="p-2 border rounded-md"
//                     >
//                         <option value="">All Clinics</option>
//                         {uniqueEmails.map((email) => (
//                             <option key={email} value={email}>
//                                 {email}
//                             </option>
//                         ))}
//                     </select>
//                 )}

//                 <select
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className=" p-2 border rounded-md"
//                 >
//                     <option value="">All Statuses</option>
//                     <option value="Admitted">Admitted</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Canceled">Canceled</option>
//                 </select>
//             </div>

//             <div className="rounded-lg border overflow-x-auto">
//                 <table className="w-full text-sm">
//                     <thead className="bg-muted text-black text-left">
//                         <tr>
//                             {user?.role !== "clinic" && (
//                                 <th className="p-4">Clinic Email</th>
//                             )}
//                             <th className="p-4">Appointment ID</th>
//                             <th className="p-4">Patient</th>
//                             <th className="p-4">Age</th>
//                             <th className="p-4">Status</th>
//                             <th className="p-4">Created At</th>
//                             {role === "clinic" && <th className="p-4">Actions</th>}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filtered.map((app: Appointment) => (
//                             <tr key={app._id} className="border-t hover:bg-muted/30">
//                                 {user?.role !== "clinic" && (
//                                     <td className="p-4">
//                                         <div className="font-medium text-blue-600">
//                                             {app.clinic?.email || "N/A"}
//                                         </div>
//                                     </td>
//                                 )}
//                                 <td className="p-4">
//                                     <div className="font-medium text-blue-600">
//                                         {app.appointmentNumber}
//                                     </div>
//                                     <div className="text-xs text-muted-foreground">
//                                         {app.createdAt?.slice(0, 10)}
//                                     </div>
//                                 </td>
//                                 <td className="p-4">
//                                     <div>{app.patient?.name}</div>
//                                     <div className="text-xs text-muted-foreground">
//                                         {app.patient?.phoneNumber}
//                                     </div>
//                                 </td>
//                                 <td className="p-4">
//                                     <div>{app.patient?.age}</div>
//                                 </td>
//                                 <td className="p-4">{getStatusBadge(app.status)}</td>
//                                 <td className="p-4">{app.createdAt?.slice(0, 10)}</td>
//                                 {role === "clinic" && (
//                                     <td className="flex gap-2 mt-5 flex-wrap p-4">
//                                         <button
//                                             onClick={() => {
//                                                 setSelectedAppointment(app);
//                                                 setShowUpdateDialog(true);
//                                             }}
//                                         >
//                                             <PenLine className="w-4 h-4 text-emerald-600 hover:scale-110 cursor-pointer" />
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 setSelectedAppointment(app);
//                                                 setShowDeleteDialog(true);
//                                             }}
//                                         >
//                                             <Trash className="w-4 h-4 text-red-600 hover:scale-110 cursor-pointer" />
//                                         </button>
//                                     </td>
//                                 )}
//                             </tr>
//                         ))}
//                         {filtered.length === 0 && (
//                             <tr>
//                                 <td colSpan={5} className="text-center p-4 text-muted-foreground">
//                                     No appointments found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <UpdateAppointmentDialog
//                 open={showUpdateDialog}
//                 appointment={selectedAppointment}
//                 onClose={() => setShowUpdateDialog(false)}
//             />

//             <DeleteAppointmentDialog
//                 open={showDeleteDialog}
//                 patientName={selectedAppointment?.patient?.name ?? ""}
//                 onClose={() => setShowDeleteDialog(false)}
//                 onConfirmDelete={handleDelete}
//             />
//         </div>
//     );
// }








import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { usePatientStore } from "@/store/patient.store";
import { useAppointmentStore } from "@/store/appointment.store";
import { toast } from "sonner";

export default function AppointmentsPage() {
    const { patients, fetchPatients, setPatients } = usePatientStore();
    const { createAppointment } = useAppointmentStore();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [description, setDescription] = useState(""); // New field

    const [showNewPatientForm, setShowNewPatientForm] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: "", phoneNumber: "", age: "", gender: "" });

    useEffect(() => {
        fetchPatients();
    }, []);

    const timeSlots = generateTimeSlots("09:00", "18:00", 30);

    function generateTimeSlots(start: string, end: string, interval: number) {
        const slots: string[] = [];
        let [hour, minute] = start.split(":").map(Number);
        const [endHour, endMinute] = end.split(":").map(Number);

        while (hour < endHour || (hour === endHour && minute < endMinute)) {
            slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
            minute += interval;
            if (minute >= 60) {
                hour++;
                minute -= 60;
            }
        }
        return slots;
    }

    const handleAddPatient = () => {
        if (!newPatient.name || !newPatient.phoneNumber) {
            toast.error("Please enter patient name and phone number");
            return;
        }

        const addedPatient = { ...newPatient, _id: Date.now().toString() };
        setPatients([...patients, addedPatient]);
        toast.success("Patient added successfully!");
        setNewPatient({ name: "", phoneNumber: "", age: "", gender: "" });
        setShowNewPatientForm(false);
        setSelectedPatientId(addedPatient._id);
    };

    const handleCreateAppointment = async () => {
        if (!selectedDate || !selectedTime || !selectedPatientId) {
            toast.error("Please select date, time, and patient");
            return;
        }

        const payload = {
            patientId: selectedPatientId,
            date: format(selectedDate, "yyyy-MM-dd"),
            time: selectedTime,
            description // include description
        };

        const appointment = await createAppointment(payload);
        if (appointment) {
            toast.success("Appointment created successfully!");
            setSelectedDate(null);
            setSelectedTime(null);
            setSelectedPatientId(null);
            setDescription(""); // reset description
        } else {
            toast.error("Failed to create appointment");
        }
    };

    const selectedPatient = patients.find(p => p._id === selectedPatientId);

    return (
        <div className="flex gap-6 p-6">
            {/* LEFT SIDE: Calendar + Time Slots */}
            <div className="w-1/2 flex gap-6 justify-center items-start">
                <Calendar
                    mode="single"
                    required={true}
                    selected={selectedDate || undefined}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                />

                {selectedDate && (
                    <div>
                        <h3 className="font-semibold mb-2">Available Time Slots</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((time) => (
                                <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT SIDE: Appointment Form */}
            <div className="w-1/2 border rounded-lg p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold">Create Appointment</h2>

                {/* Patient Selection Dropdown */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Select Patient</label>
                    <Select onValueChange={setSelectedPatientId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                            {patients.length > 0 ? (
                                patients.map((patient) => (
                                    <SelectItem key={patient._id} value={patient._id}>
                                        {patient.name} ({patient.phoneNumber})
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="p-2 text-gray-500 text-sm">No patients found</p>
                            )}
                        </SelectContent>
                    </Select>

                    {/* Patient details */}
                    {selectedPatient && (
                        <div className="border p-4 rounded-lg mt-2 bg-gray-50">
                            <h3 className="font-semibold mb-2">Patient Details</h3>
                            <p><strong>Name:</strong> {selectedPatient.name}</p>
                            <p><strong>Phone:</strong> {selectedPatient.phoneNumber}</p>
                            <p><strong>Age:</strong> {selectedPatient.age || "N/A"}</p>
                            <p><strong>Gender:</strong> {selectedPatient.gender || "N/A"}</p>
                        </div>
                    )}
                </div>

                {/* Toggle Add New Patient (hide if patient selected) */}
                {!selectedPatientId && (
                    <>
                        <Button
                            variant="link"
                            className="p-0 text-blue-600"
                            onClick={() => setShowNewPatientForm(!showNewPatientForm)}
                        >
                            {showNewPatientForm ? "Cancel" : "Add New Patient"}
                        </Button>

                        {showNewPatientForm && (
                            <div className="border p-4 rounded-lg flex flex-col gap-3">
                                <Input
                                    placeholder="Name"
                                    value={newPatient.name}
                                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                />
                                <Input
                                    placeholder="Phone Number"
                                    value={newPatient.phoneNumber}
                                    onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                                />
                                <Input
                                    placeholder="Age"
                                    value={newPatient.age}
                                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                />
                                <Select onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAddPatient}>Save Patient</Button>
                            </div>
                        )}
                    </>
                )}

                {/* Description field */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                        placeholder="Enter appointment description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Appointment Info */}
                <div>
                    <p className="text-sm text-black">
                        Selected Date: {selectedDate ? format(selectedDate, "PPP") : "None"}
                    </p>
                    <p className="text-sm text-black">Selected Time: {selectedTime || "None"}</p>
                </div>

                {/* Create Appointment Button */}
                <Button
                    className="mt-4 bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    onClick={handleCreateAppointment}
                    disabled={!selectedDate || !selectedTime || !selectedPatientId}
                >
                    Create Appointment
                </Button>
            </div>
        </div>
    );
}
