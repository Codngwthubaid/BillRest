import type { Subscription } from "@/types/subscription.types";
import { axiosInstance } from "@/lib/axiosInstance";
import type { AuthResponse } from "@/types/user.types";

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const getUserSubscription = async (): Promise<Subscription | null> => {
  const res = await axiosInstance.get("/auth/subscription");
  return res.data.subscription;
};
