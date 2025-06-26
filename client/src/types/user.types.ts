export type UserRole = "master" | "support" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
