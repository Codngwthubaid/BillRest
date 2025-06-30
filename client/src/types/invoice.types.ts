export interface InvoiceProductOnInvoice {
  name: string;
  quantity: string;
  price: string;
  gstRate: string;
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
}

export interface POSPrintResponse {
  html: string;
}

export interface InvoiceProductPayload {
  product: string;    // product ID
  quantity: number;
  price: number;
  gstRate: number;
}

export interface UpdateInvoicePayload {
  customerName: string;
  phoneNumber: string;
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  status: "paid" | "pending" | "overdue" | "draft";
  currency: "INR" | "USD" | "AED" | string;
  customerState?: string;
  businessState?: string;
  products: InvoiceProductPayload[];
}