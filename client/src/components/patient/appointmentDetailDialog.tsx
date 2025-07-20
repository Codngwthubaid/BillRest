import { X } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import type { PatientVisitSummary } from '../../types/patient.types';

interface AppointmentDetailDialogProps {
  appointment: PatientVisitSummary | null;
  onClose: () => void;
}

export default function AppointmentDetailDialog({
  appointment,
  onClose,
}: AppointmentDetailDialogProps) {
  if (!appointment || !appointment._id) {
    return null;
  }

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
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'Admitted'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'Pending'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Created At:</span>
              <span className="text-lg font-semibold text-gray-900">
                {appointment.createdAt.slice(0, 10)}
              </span>
            </div>

            {/* You can add more appointment-related details here if available */}
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
