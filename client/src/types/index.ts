export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'master' | 'customer' | 'support';
  isOnboarded?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  phoneNumber: string;
  products: {
    product: {
      _id: string;
      name: string;
    };
    quantity: number;
    price: number;
    gstRate: number;
  }[];
  subTotal: number;
  gstAmount: number;
  totalAmount: number;
  currency: 'INR' | 'USD' | 'AED';
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Other';
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  gstRate: number;
}

export interface SalesReport {
  totalSales: number;
  count: number;
  topProducts: {
    name: string;
    quantity: number;
    totalSales: number;
  }[];
}

export interface GSTSlab {
  label: string;
  value: number;
}

export interface Business {
  user: string;
  businessName: string;
  address?: string;
  defaultCurrency: 'INR' | 'USD' | 'AED';
  gstSlabs: GSTSlab[];
  isOnboarded: boolean;
}