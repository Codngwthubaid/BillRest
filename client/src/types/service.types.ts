export interface Service {
  _id: string;
  clinic: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  unit: string;
  gstRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  price: number;
  category?: string;
  unit?: string;
  gstRate?: number;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  unit?: string;
  gstRate?: number;
}
