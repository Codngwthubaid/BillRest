import { useAuthStore } from "@/store/auth.store";
import AppointmentsPageForAdminPanel from "@/components/appointments/AppointmentsPageForAdminPanel";
import AppointmentsPageForPatientPanel from "@/components/appointments/AppointmentsPageForPatientPanel";
import AppointmentsPageForSupportPanel from "@/components/appointments/AppointmentsPageForSupportPanel";

export default function Appointments() {
    const { user } = useAuthStore()
    return (
        <>
            {user?.role === "customer" && <AppointmentsPageForPatientPanel />}
            {user?.role === "support" && <AppointmentsPageForSupportPanel />}
            {user?.role === "master" && <AppointmentsPageForAdminPanel />}
        </>
    );
}