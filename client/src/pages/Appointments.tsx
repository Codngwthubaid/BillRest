import { useEffect, useState } from "react";
import { useAppointmentStore } from "@/store/appointment.store";
import { useAuthStore } from "@/store/auth.store";
import {
    Loader2,
    Calendar,
    Clock,
    FileText,
    IndianRupee,
    PenLine,
    Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@/types/appointment.types";
import { Button } from "@/components/ui/button";
import CreateAppointmentDialog from "@/components/appointments/createAppointment";
import UpdateAppointmentDialog from "@/components/appointments/updateAppointment";
import { DeleteAppointmentDialog } from "@/components/appointments/deleteAppointment";

export default function Appointments() {
    const { user } = useAuthStore();
    const role = user?.role;

    const {
        appointments,
        allAppointments,
        fetchAppointments,
        fetchAllAppointments,
        deleteAppointment,
    } = useAppointmentStore();

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    console.log("Appointments component rendered", allAppointments);

    useEffect(() => {
        const fetch = async () => {
            if (role === "support" || role === "master") {
                await fetchAllAppointments();
            } else {
                await fetchAppointments();
            }
            setLoading(false);
        };
        fetch();
    }, [role, fetchAppointments, fetchAllAppointments]);

    const appointmentsList =
        role === "support" || role === "master"
            ? allAppointments?.appointments || []
            : Array.isArray(appointments) ? appointments : [];


    const summary = {
        total: appointmentsList.length,
        admitted: appointmentsList.filter((a: any) => a.admitted).length,
        pending: appointmentsList.filter((a: any) => a.status === "Pending").length,
        discharged: appointmentsList.filter((a: any) => a.status === "Discharged").length,
    };

    const filtered = appointmentsList.filter((app: any) =>
        app.appointmentNumber.toLowerCase().includes(search.toLowerCase()) ||
        app.patient?.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async () => {
        if (!selectedAppointment?._id) return;
        await deleteAppointment(selectedAppointment._id);
        await fetchAppointments();
        setShowDeleteDialog(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Admitted":
                return <Badge className="bg-green-100 text-green-800">Admitted</Badge>;
            case "Completed":
                return <Badge className="bg-yellow-100 text-yellow-800">Completed</Badge>;
            case "Pending":
                return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
            case "Canceled":
                return <Badge className="bg-gray-100 text-gray-800">Canceled</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin size-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Appointments</h1>
                    <p className="text-gray-500">Manage your appointments and admissions</p>
                </div>
                {role === "clinic" && (
                    <>
                        <Button
                            onClick={() => setShowCreateDialog(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            + Create Appointment
                        </Button>
                        <CreateAppointmentDialog
                            open={showCreateDialog}
                            onOpenChange={setShowCreateDialog}
                        />
                    </>
                )}
            </div>

            {(role === "clinic") && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-blue-600">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">Total</span>
                            </div>
                            <span className="font-bold text-lg">{summary.total}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-sm">Admitted</span>
                            </div>
                            <span className="font-bold text-lg">{summary.admitted}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-yellow-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Pending</span>
                            </div>
                            <span className="font-bold text-lg">{summary.pending}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-orange-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Discharged</span>
                            </div>
                            <span className="font-bold text-lg">{summary.discharged}</span>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <Input
                    placeholder="Search appointments by ID or patient name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted text-gray-600 text-left">
                        <tr>
                            <th className="p-4">Appointment</th>
                            <th>Patient</th>
                            <th>Status</th>
                            <th>Created At</th>
                            {role === "clinic" && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((app: Appointment) => (
                            <tr key={app._id} className="border-t hover:bg-muted/30">
                                <td className="p-4">
                                    <div className="font-medium text-blue-600">
                                        {app.appointmentNumber}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {app.createdAt?.slice(0, 10)}
                                    </div>
                                </td>
                                <td>
                                    <div>{app.patient?.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {app.patient?.phoneNumber}
                                    </div>
                                </td>
                                <td>{getStatusBadge(app.status)}</td>
                                <td>{app.createdAt?.slice(0, 10)}</td>
                                {role === "clinic" && (
                                    <td className="flex gap-2 p-2 mt-5 flex-wrap">
                                        <button
                                            onClick={() => {
                                                setSelectedAppointment(app);
                                                setShowUpdateDialog(true);
                                            }}
                                        >
                                            <PenLine className="w-4 h-4 text-emerald-600 hover:scale-110" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedAppointment(app);
                                                setShowDeleteDialog(true);
                                            }}
                                        >
                                            <Trash className="w-4 h-4 text-red-600 hover:scale-110" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center p-4 text-muted-foreground">
                                    No appointments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <UpdateAppointmentDialog
                open={showUpdateDialog}
                appointment={selectedAppointment}
                onClose={() => setShowUpdateDialog(false)}
            />

            <DeleteAppointmentDialog
                open={showDeleteDialog}
                patientName={selectedAppointment?.patient?.name ?? ""}
                onClose={() => setShowDeleteDialog(false)}
                onConfirmDelete={handleDelete}
            />
        </div>
    );
}
