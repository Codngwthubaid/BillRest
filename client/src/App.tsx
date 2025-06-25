import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/authStore';
import React, { type ReactNode } from 'react';
import Invoices from './pages/Invoices';

const ProtectedAuthRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={
            <ProtectedAuthRoute>
              <Register />
            </ProtectedAuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedAuthRoute>
              <Login />
            </ProtectedAuthRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;