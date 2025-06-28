import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
