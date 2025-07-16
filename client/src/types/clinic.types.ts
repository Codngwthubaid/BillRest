export interface Clinic {
  _id: string;
  user: string; // ObjectId of the user
  businessName: string;
  address?: string;
  isOnboarded: boolean;
  protectedPin?: string;
  createdAt: string;
  updatedAt: string;
}
