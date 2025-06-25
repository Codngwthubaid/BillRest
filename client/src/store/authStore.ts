import { create } from 'zustand';
import type { User } from '@/types/index';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token') || null, // Initialize from localStorage
  setAuth: (user, token) => {
    localStorage.setItem('token', token); // Persist token
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('token'); // Clear token
    set({ user: null, token: null });
  },
}));