export interface Plan {
  _id: string;
  name: string;
  durationInDays: number;
  pricePerMonth: number;
  totalPrice: number;
  type: "package" | "individual";
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
