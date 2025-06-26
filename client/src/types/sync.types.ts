export interface SyncProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock: number;
  unit: string;
  gstRate: number;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncInvoiceProduct {
  product: string;
  quantity: number;
  price: number;
  gstRate: number;
}

export interface SyncInvoice {
  invoiceNumber: string;
  products: SyncInvoiceProduct[];
  subTotal: number;
  gstAmount: number;
  totalAmount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Other';
  customerName: string;
  phoneNumber: string;
  createdAt: string;
}
