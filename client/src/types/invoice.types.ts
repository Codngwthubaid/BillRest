export interface InvoiceProduct {
  product: string;
  quantity: string;
  price: string;
  gstRate: string;
}

export interface PopulatedProduct {
  _id: string;
  name: string;
  price: number;
  gstRate: number;
}

export interface Invoice {
  _id?: string;
  user?: string;
  invoiceNumber: string;
  products: {
    product: string | PopulatedProduct;
    quantity: number;
    price: number;
    gstRate: number;
  }[];
  subTotal: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  currency: "INR" | "USD" | "AED" | string;
  status: "paid" | "pending" | "overdue" | "draft";
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  posPrint: "58mm" | "80mm" | "A4" | "disabled"; // ✅ NEW
  customerName: string;
  phoneNumber: string;
  customerState?: string;
  businessState?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvoicePayload {
  products: InvoiceProduct[];
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  currency: "INR" | "USD" | "AED" | string;
  customerName: string;
  phoneNumber: string;
  status: "paid" | "pending" | "overdue" | "draft";
  customerState: string;
  businessState: string;
  posPrint: "58mm" | "80mm" | "A4" | "disabled"; // ✅ NEW
}

export interface POSPrintResponse {
  html: string;
}
