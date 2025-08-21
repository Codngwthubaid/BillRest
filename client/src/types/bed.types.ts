export type BedStatus = "Available" | "Occupied" | "Maintenance";

export interface Bed {
  _id: string;
  clinic: string;
  roomNumber: string;
  bedNumber: string;
  bedCharges: number;
  patient?: string | null;
  status: BedStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AddBedPayload {
  clinic: string;
  roomNumber: string;
  bedNumber: string;
  bedCharges: number;
  status: BedStatus;
}

export interface UpdateBedPayload {
  roomNumber?: string;
  bedNumber?: string;
  bedCharges?: number;
  patient?: string | null;
  status?: BedStatus;
}
