export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'master' | 'customer' | 'support';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}