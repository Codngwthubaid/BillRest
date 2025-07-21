import { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patient.store";
import { exportToCSV } from "@/lib/exportCsv";
import type { Patient } from "@/types/patient.types";
import type { Appointment } from "@/types/appointment.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseISO, isSameMonth } from "date-fns";
import { useAuthStore } from "@/store/auth.store";
import PatientCard from "@/components/patient/patientCard";
import PatientDetailsDialog from "@/components/patient/patientDetailsDailog";
import AppointmentDetailDialog from "@/components/patient/appointmentDetailDialog";
import ProtectedPinDialog from "@/components/invoices/ProtectedPinDialog";
import ConfirmDeleteDialog from "@/components/customer/DeleteCustomerDialog";

export default function Patients() {
  const {
    patients,
    allPatients,
    loading,
    fetchAllPatients,
    fetchPatients,
    deletePatient,
  } = usePatientStore();

  const { user } = useAuthStore();

  console.log("Patients component rendered with user:", patients);

  const [search, setSearch] = useState("");
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const isClinic = user?.role === "clinic";
  const isAdmin = user?.role === "support" || user?.role === "master";

  const patientList: Patient[] = isAdmin
    ? allPatients?.patients || []
    : Array.isArray(patients)
    ? patients
    : [];

  useEffect(() => {
    if (isAdmin) {
      fetchAllPatients();
    } else if (isClinic) {
      fetchPatients();
    }
  }, [user?.role]);

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setShowPinDialog(true);
  };

  const pinCallback = () => {
    setShowPinDialog(false);
    setShowConfirmDialog(true);
  };

  const currentMonth = new Date();

  const newThisMonth = patientList.filter((patient) => {
    const appointments = patient.appointments || [];
    if (appointments.length === 0) return false;

    const firstAppointmentDate = (appointments as Appointment[])
      .map((a) => parseISO(a.createdAt))
      .sort((a, b) => a.getTime() - b.getTime())[0];

    return isSameMonth(firstAppointmentDate, currentMonth);
  }).length;

  const activeThisMonth = patientList.filter(
    (patient) =>
      Array.isArray(patient.appointments) &&
      patient.appointments.some((a: any) =>
        isSameMonth(parseISO(a.createdAt), currentMonth)
      )
  ).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Patients</h1>
      <p className="mb-6">Manage your patient records and appointments</p>

      {isClinic && (
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4 mb-6">
          <div className="rounded-xl p-4 border-2 w-full">
            <p className="text-sm">Total Patients</p>
            <p className="text-2xl font-semibold">{patientList.length}</p>
          </div>
          <div className="rounded-xl p-4 border-2 w-full">
            <p className="text-sm">Active This Month</p>
            <p className="text-2xl font-semibold text-green-600">
              {activeThisMonth}
            </p>
          </div>
          <div className="rounded-xl p-4 border-2 w-full">
            <p className="text-sm">New This Month</p>
            <p className="text-2xl font-semibold text-purple-600">
              {newThisMonth}
            </p>
          </div>
        </div>
      )}

      {/* Search & Export */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search by name, phone, or condition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        {isClinic && (
          <Button
            onClick={() => exportToCSV(patients, "patients.csv")}
            className="bg-green-600 text-white"
          >
            Export CSV
          </Button>
        )}
      </div>

      {/* Patient cards */}
      {loading && <p>Loading...</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patientList
          .filter(
            (p: any) =>
              p.phoneNumber.includes(search) ||
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.condition?.toLowerCase().includes(search.toLowerCase())
          )
          .map((patient: Patient) => (
            <PatientCard
              key={patient._id}
              patient={patient}
              onViewDetails={() => setSelectedPatient(patient)}
              onDelete={() => handleDeletePatient(patient)}
            />
          ))}
      </div>

      {/* Modals */}
      <PatientDetailsDialog
        patient={selectedPatient && selectedPatient._id ? selectedPatient : null}
        onClose={() => setSelectedPatient(null)}
        onSelectVisit={(visit) => setSelectedAppointment(visit)}
      />

      <AppointmentDetailDialog
        appointment={
          selectedAppointment && selectedAppointment._id
            ? selectedAppointment
            : null
        }
        onClose={() => setSelectedAppointment(null)}
      />

      <ProtectedPinDialog
        open={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onVerified={pinCallback}
      />

      <ConfirmDeleteDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={async () => {
          if (patientToDelete) {
            await deletePatient(patientToDelete._id);

            // Refetch after deletion
            if (isAdmin) {
              await fetchAllPatients();
            } else if (isClinic) {
              await fetchPatients();
            }
          }
          setShowConfirmDialog(false);
          setPatientToDelete(null);
        }}
        title="Delete Patient"
        message={`Are you sure you want to delete ${patientToDelete?.name}?`}
      />
    </div>
  );
}
