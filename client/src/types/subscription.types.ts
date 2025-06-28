export interface Subscription {
  _id: string;
  user: string;
  planId: string; // just keep planId as string
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
