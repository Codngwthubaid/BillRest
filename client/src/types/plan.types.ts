export interface Plan {
  _id: string;
  name: string;
  durationInDays: number;
  pricePerMonth: number;
  totalPrice: number;
  type: "package" | "individual"; // e.g., package vs add-on
  description?: string;           // optional if you want to show e.g., "(300 WhatsApp Invoices)"
  createdAt?: string;
  updatedAt?: string;
}
