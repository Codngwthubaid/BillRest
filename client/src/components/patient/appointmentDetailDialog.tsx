import { X } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import type { PatientVisitSummary, Patient } from '../../types/patient.types';

interface AppointmentDetailDialogProps {
  appointment: PatientVisitSummary | null;
  patient: Patient | null; // ✅ added
  onClose: () => void;
}

export default function AppointmentDetailDialog({
  appointment,
  patient,
  onClose,
}: AppointmentDetailDialogProps) {
  if (!appointment || !appointment._id) {
    return null;
  }

  console.log(patient);

  return (
    <Dialog open={true}>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-scroll"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Appointment #{appointment.appointmentNumber}
              </h2>
              <p className="text-sm text-gray-500">Appointment details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Patient Info */}
            {patient && (
              <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Patient:</strong> {patient.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Phone:</strong> {patient.phoneNumber}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Address:</strong> {patient.address}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Age:</strong> {patient.age}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Gender:</strong> {patient.gender}
                </p>

                {/* Appointment-specific history */}
                <div className='space-y-2'>
                  {patient.history && patient.history.length > 0 ? (
                    patient.history
                      .filter((h) => h.appointmentId === appointment._id)
                      .map((h, index) => (
                        <div key={index}>
                          <p className="text-sm text-gray-700">
                            <strong>Status:</strong> {h.status}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>Description:</strong> {h.description}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500">No history available for this appointment.</p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}


