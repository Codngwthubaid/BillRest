export interface GstSlab {
  label: string; // e.g., "5%"
  value: number; // e.g., 5
}

export interface Business {
  _id?: string;
  user: string;
  businessName: string;
  address?: string;
  defaultCurrency: "INR" | "USD" | "AED";
  gstSlabs: GstSlab[];
  isOnboarded: boolean;
  protectedPin?: string; // Add this
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessPayload {
  name: string;
  phone: string;
  businessName: string;
  address?: string;
  defaultCurrency: "INR" | "USD" | "AED";
  gstSlabs: GstSlab[];
  protectedPin?: string; // Optional (only on first setup)
}
