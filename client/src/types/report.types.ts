import type { Product } from "./product.types";

export interface ReportProduct {
  name: string;
  quantity: number;
  totalSales: number;
}

export interface ReportInvoiceProduct {
  product: Product | string;
  quantity: number;
  price: number;
  gstRate: number;
}

export interface ReportInvoice {
  _id: string;
  invoiceNumber: string;
  products: ReportInvoiceProduct[];
  subTotal: number;
  gstAmount: number;
  totalAmount: number;
  currency: string;
  status: "paid" | "pending" | "overdue" | "draft";
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  customerName: string;
  phoneNumber: string;
  createdAt: string;
}

export interface SalesReportResponse {
  totalSales: number;
  count: number;
  topProducts: ReportProduct[];
  invoices: ReportInvoice[];
}
