export interface Subscription {
  _id: string;
  user: string;
  plan: PlanDetails; // just keep planId as string
  startDate: string;
  endDate: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: "active" | "expired";
  createdAt?: string;
  updatedAt?: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
}

export interface PlanDetails {
  _id: string;
  description: string[];
  durationInDays: Number;
  includedInvoices : Number;
  name: String;
  pricePerMonth: Number;
  totalPrice:Number;
  type: String;
}