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
import Bed from "./pages/Bed";


import { useAuthStore } from "./store/auth.store";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Services from "./pages/Services";
import Patients from "./pages/Patients";
import ClinicsPage from "./pages/Clinics";
import { useSubscriptionStore } from "./store/subscription.store";

export default function App() {
  const { user } = useAuthStore();
  const { currentSubscription } = useSubscriptionStore();

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
            {user?.role === "customer" && (
              <Route element={<SubscriptionRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Route>
            )}

            {user?.role === "clinic" && (
              <Route element={<SubscriptionRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/" element={<Dashboard />} />
                {currentSubscription?.plan?.role === "Hospital" && <Route path="/beds" element={<Bed />} />}
                <Route path="/billings" element={<Billing />} />
                <Route path="/services" element={<Services />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Route>
            )}

            {user?.role === "support" && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/businesses" element={<BusinessPage />} />
                <Route path="/clinics" element={<ClinicsPage />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/billings" element={<Billing />} />
                <Route path="/services" element={<Services />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help" element={<HelpPage />} />
              </>
            )}

            {user?.role === "master" && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/clinics" element={<ClinicsPage />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/billings" element={<Billing />} />
                <Route path="/services" element={<Services />} />
                <Route path="/patients" element={<Patients />} />
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
