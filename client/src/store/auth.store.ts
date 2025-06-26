import { create } from "zustand";
import { persist,type PersistOptions } from "zustand/middleware";
import type { User } from "@/types/user.types";
import type { Subscription } from "@/types/subscription.types";

interface AuthState {
  user: User | null;
  token: string | null;
  subscription: Subscription | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setSubscription: (sub: Subscription | null) => void;
}

type AuthPersist = PersistOptions<AuthState>;

export const useAuthStore = create<AuthState>()(
  persist<AuthState, [], AuthPersist>(
    (set) => ({
      user: null,
      token: null,
      subscription: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, subscription: null }),
      setSubscription: (sub) => set({ subscription: sub }),
    }),
    {
      name: "auth-storage", // 🗂 localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        subscription: state.subscription,
      }),
    }
  )
);
