export interface GstSlab {
  label: string;
  value: number;
}

export interface Business {
  _id?: string;
  user: string;
  businessName: string;
  address?: string;
  gstNumber?: string;
  defaultCurrency: "INR" | "USD" | "AED";
  gstSlabs: GstSlab[];
  isOnboarded: boolean;
  protectedPin?: string;
  features: {
    posPrint: "58mm" | "80mm" | "disabled";
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessPayload {
  name: string;
  phone: string;
  businessName: string;
  address?: string;
  gstNumber?: string;
  defaultCurrency: "INR" | "USD" | "AED";
  gstSlabs: GstSlab[];
  protectedPin?: string;
  features?: {
    posPrint?: "58mm" | "80mm" | "disabled";
  };
}
