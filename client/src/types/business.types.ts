export interface GstSlab {
  label: string;
  value: number;
}

export interface BusinessFeatures {
  whatsappInvoice?: boolean;
  barcode?: boolean;
  pwa?: boolean;
  backup?: boolean;
}

export interface Business {
  businessId: string;
  _id?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    features: BusinessFeatures;
  };
  businessName: string;
  address?: string;
  gstNumber?: string;
  defaultCurrency: "INR" | "USD" | "AED";
  gstSlabs: GstSlab[];
  isOnboarded: boolean;
  protectedPin?: string;
  features?: BusinessFeatures;
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
  features?: BusinessFeatures;
}
