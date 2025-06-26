// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Plans from "@/pages/Plan";
import Dashboard from "@/pages/Dashboard"; // 👈 Only allowed after plan purchase
import ProtectedRoute from "@/routes/ProtectedRoute";
import SubscriptionRoute from "@/routes/SubscriptionRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Login Required) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/plans" element={<Plans />} />

          {/* Subscription Protected Routes */}
          <Route element={<SubscriptionRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more pages that require subscription here */}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
