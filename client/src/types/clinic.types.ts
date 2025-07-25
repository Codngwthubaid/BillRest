export interface Clinic {
  _id: string;
  user: string; 
  clinicId : string;
  businessName: string;
  address?: string;
  isOnboarded: boolean;
  protectedPin?: string;
  createdAt: string;
  updatedAt: string;
  count?: number;
}

export interface ClinicPayload {
  name: string;
  phone: string;
  businessName: string;
  address?: string;
  protectedPin?: string;
}

export interface ClinicFeatures {
  // Example features
  healthReportAccess?: boolean;
  appointmentScheduling?: boolean;
  customNotes?: boolean;
  // Add more as needed
}
