export interface PatientVisitSummary {
  _id: string;
  appointmentNumber: string;
  status: "Pending" | "Admitted" | "Discharged";
  createdAt: string;
}

export interface Patient {
  _id: string;
  clinic: string;
  name: string;
  phoneNumber: string;
  appointments?: string;
  address?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  visits: PatientVisitSummary[];
  createdAt: string;
  updatedAt: string;
}
