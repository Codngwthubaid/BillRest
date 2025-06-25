import { axiosInstance } from '@/lib/axiosInstance';
import type { AuthResponse, LoginFormData, RegisterFormData } from '@/types/index';
import { useAuthStore } from '@/store/authStore';

export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/register', data);
  useAuthStore.getState().setAuth(response.data.user, response.data.token);
  return response.data;
};

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', data);
  useAuthStore.getState().setAuth(response.data.user, response.data.token);
  return response.data;
};