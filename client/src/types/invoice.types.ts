export interface InvoiceProduct {
  product: string; // ID of the product
  quantity: number;
  price: number;
  gstRate: number;
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
  totalAmount: number;
  currency: "INR" | "USD" | "AED" | string;
  status: "paid" | "pending" | "overdue" | "draft";
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  customerName: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvoicePayload {
  products: InvoiceProduct[];
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  currency: "INR" | "USD" | "AED" | string;
  customerName: string;
  phoneNumber: string;
}
