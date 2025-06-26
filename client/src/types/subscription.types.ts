export interface Plan {
  _id: string;
  name: string;
  durationInDays: number;
  price: number;
}

export interface Subscription {
  _id: string;
  user: string;
  plan: Plan;
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
