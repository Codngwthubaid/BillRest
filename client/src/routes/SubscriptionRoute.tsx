// src/routes/SubscriptionRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export default function SubscriptionRoute() {
  const token = useAuthStore((state) => state.token);
  const subscription = useAuthStore((state) => state.subscription);

  if (!token) return <Navigate to="/login" replace />;
  if (!subscription) return <Navigate to="/plans" replace />;

  return <Outlet />;
}
