export type UserRole = "master" | "support" | "customer" | "clinic";
export type UserType = "billrest_general" | "billrest_health";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  type: UserType;
}

export interface AuthResponse {
  token: string;
  user: User;
}
