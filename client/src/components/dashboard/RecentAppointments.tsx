import { useAuthStore } from "@/store/auth.store";
import { useReportStore } from "@/store/report.store";
import { usePatientStore } from "@/store/patient.store";
import { useAppointmentStore } from "@/store/appointment.store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FileText } from "lucide-react";
import { useEffect } from "react";

export default function RecentAppointments() {
  const { user } = useAuthStore();
  const role = user?.role;

  const { healthReport } = useReportStore();
  const { fetchPatients } = usePatientStore();
  const { allAppointments, fetchAllAppointments } = useAppointmentStore();

  useEffect(() => {
    if (role === "support" || role === "master") {
      fetchPatients();
      fetchAllAppointments();
    }
  }, [role, fetchPatients, fetchAllAppointments]);

  const appointmentsToShow =
    role === "support" || role === "master"
      ? (Array.isArray(allAppointments) ? allAppointments.slice(0, 4) : [])
      : (Array.isArray(healthReport?.topAppointments) ? healthReport.topAppointments.slice(0, 4) : []);

  return (
    <Card className="rounded-lg shadow-sm border">
      <CardHeader className="border-b pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
          <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          {appointmentsToShow?.map((app, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{app.description}</p>
                  <p className="text-sm text-gray-600">
                    Total Visits: {app.count}  
                  </p>
                </div>
              </div>
            </div>
          ))}
          {!appointmentsToShow?.length && (
            <p className="text-sm">No appointments found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
