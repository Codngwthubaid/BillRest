export interface TreatmentInput {
  service: string; // service ID
  quantity: number; 
  price: number;
  gstRate: number;
  category : string
}

export interface OtherCharge {
  itemName: string;
  amount: number;
}

export interface Billing {
  bedCharges: number;
  serviceCharges: number;
  otherCharges: OtherCharge[];
  grantsOrDiscounts: number;
  totalBeforeDiscount: number;
  finalAmount: number;
  paidAmount?: number;
  paymentStatus?: "pending" | "paid" | "partial";
}

export interface Treatment {
  service: {
    _id: string;
    name: string;
    price: number;
    gstRate: number;
    category?: string;
  };
  quantity: number;
  totalCharges: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface Bed {
  _id: string;
  roomNumber: string;
  bedNumber: string;
  bedCharges: number;
  status: "Available" | "Occupied" | "Maintenance";
  patient?: string | null;
  clinic: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPDResponse {
  _id: string;
  ipdNumber: string;
  patient: Patient | null;
  clinic: string;
  appointment?: string;
  isNewPatient: boolean;
  admissionDate: string;
  dischargeDate?: string;
  bed: Bed; // ✅ replaced bedNumber with full Bed object
  treatments: Treatment[];
  billing: Billing;
  note?: string; // ✅ added note field
  paymentStatus: "pending" | "paid" | "partial";
  status: "Admitted" | "Discharged";
  createdAt: string;
  updatedAt: string;
}

export interface IPDInput {
  patientId: string;
  appointmentId?: string;
  isNewPatient?: boolean;
  admissionDate?: string;
  dischargeDate?: string;
  bedId: string; // ✅ changed from bedNumber to bedId
  grantsOrDiscounts?: number;
  treatments?: TreatmentInput[];
  note?: string; // ✅ added note
}
