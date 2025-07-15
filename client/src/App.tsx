import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Plans from "@/pages/Plan";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/routes/ProtectedRoute";
import SubscriptionRoute from "@/routes/SubscriptionRoute";
import MainLayout from "@/layout/MainLayout";
import InvoicesPage from "./pages/Invoices";
import ProductsPage from "./pages/Product";
import ReportPage from "./pages/Report";
import HelpPage from "./pages/Help";
import ContactPage from "./pages/Contact";
import ProtectedPinRoute from "./routes/ProtectedPinRoute";
import CustomerPage from "./pages/Customers";
import BusinessPage from "./pages/Businesses";
import NotFoundPage from "./pages/NotFound404";

import { useAuthStore } from "./store/auth.store";

export default function App() {
  const { user } = useAuthStore();
  console.log(user);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/plans" element={<Plans />} />
            <Route element={<ProtectedPinRoute />}>
              <Route path="/reports" element={<ReportPage />} />
            </Route>

            {/* Role-based routing */}
            {(user?.role === "customer" || user?.role === "clinic") && (
              <Route element={<SubscriptionRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Route>
            )}

            {user?.role === "support" && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/businesses" element={<BusinessPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help" element={<HelpPage />} />
              </>
            )}

            {user?.role === "master" && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/business" element={<BusinessPage />} />
              </>
            )}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
