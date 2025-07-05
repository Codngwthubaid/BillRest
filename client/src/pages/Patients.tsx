import { useAuthStore } from "@/store/auth.store";
import PatientsPageForAdminPanel from "@/components/patients/PatientsPageForAdminPanel";
import PatientsPageForPatientsPanel from "@/components/patients/PatientsPageForPatientPanel";
import PatientsPageForSupportPanel from "@/components/patients/PatientsPageForSupportPanel";

export default function Patients() {
    const { user } = useAuthStore()
    return (
        <>
            {user?.role === "customer" && <PatientsPageForPatientsPanel />}
            {user?.role === "support" && <PatientsPageForSupportPanel />}
            {user?.role === "master" && <PatientsPageForAdminPanel />}
        </>
    );
}