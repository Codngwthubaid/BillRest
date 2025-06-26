export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock: number;
  unit: string;
  gstRate: number;
  barcode?: string;
  createdAt?: string;
  updatedAt?: string;
}
