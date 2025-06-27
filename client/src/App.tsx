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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Layout + Pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/plans" element={<Plans />} />

            <Route element={<SubscriptionRoute />}>
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/reports" element={<ReportPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
