export interface InvoiceProductOnInvoice {
  name: string;
  quantity: string;
  price: string;
  gstRate: string;
  discount?: string;
  barcode?: string;
  category?: string;
  stock?: string;
}

export interface Invoice {
  _id?: string;
  user?: string;
  invoiceNumber: string;
  products: InvoiceProductOnInvoice[];
  subTotal: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  currency: "INR" | "USD" | "AED" | string;
  status: "paid" | "pending" | "overdue" | "draft";
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  customerName: string;
  phoneNumber: string;
  customerState?: string;
  businessState?: string;
  gstNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvoicePayload {
  products: InvoiceProductPayload[];
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  currency: "INR" | "USD" | "AED" | string;
  customerName: string;
  phoneNumber: string;
  status: "paid" | "pending" | "overdue" | "draft";
  customerState: string;
  businessState: string;
  gstNumber?: string;
}

export interface UpdateInvoicePayload {
  customerName: string;
  phoneNumber: string;
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  status: "paid" | "pending" | "overdue" | "draft";
  currency: "INR" | "USD" | "AED" | string;
  customerState?: string;
  businessState?: string;
  gstNumber?: string;
  invoiceNumber: string;
  products: InvoiceProductPayload[];
  createdAt?: string;
}

export interface InvoiceProductPayload {
  product: string;
  quantity: number;
  price: number;
  gstRate: number;
  barcode?: string;
  category?: string;
  name?: string;
  stock?: string;
  discount?: number;
}

export interface POSPrintResponse {
  html: string;
}
