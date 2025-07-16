import { useServiceStore } from "@/store/service.store";
import { useReportStore } from "@/store/report.store";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { User, CalendarCheck, Stethoscope } from "lucide-react";

export default function ProfileStatsForHealth() {
    const { services, fetchServices } = useServiceStore();
    const { healthReport: reportData, fetchHealthReport, loading } = useReportStore();

    useEffect(() => {
        fetchServices();
        fetchHealthReport("monthly", new Date().toISOString().split("T")[0]);
    }, [fetchServices, fetchHealthReport]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Card className="rounded-lg shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full rounded-lg" />
                        ))}
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-lg shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stats = [
        {
            label: "Total Patients",
            value: reportData?.totalPatients || 0,
            icon: User,
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Total Appointments",
            value: reportData?.totalAppointments || 0,
            icon: CalendarCheck,
            color: "bg-green-100 text-green-600",
        },
        {
            label: "Total Services",
            value: services.length || 0,
            icon: Stethoscope,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <div className="space-y-6">
            <Card className="pt-6 rounded-lg shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                    <div className="space-y-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{stat.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold">{stat.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
            
            <Card className="pt-6 rounded-lg shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                    <div className="space-y-4">
                        {reportData?.appointments?.slice(0, 5).map((appointment) => (
                            <div key={appointment._id} className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                                    <CalendarCheck className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {appointment.appointmentNumber}
                                    </p>
                                    <p className="text-sm">
                                        {format(new Date(appointment.createdAt), "dd MMM yyyy, HH:mm")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`text-xs font-medium ${appointment.status === "Completed"
                                                ? "text-green-600"
                                                : appointment.status === "Pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {appointment.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {!reportData?.appointments?.length && (
                            <p className="text-sm">No Appointment records found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
