export interface Invoice {
  _id: string;
  invoiceNumber: string;
  totalAmount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  createdAt: string;
  products: {
    name: string;
    quantity: number;
    price: number;
    gstRate: number;
    discount: number;
  }[];
}

export interface Customer {
  _id: string;
  user: string;
  name: string;
  phoneNumber: string;
  state?: string;
  invoices: Invoice[];
  createdAt: string;
  updatedAt: string;
}
