import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { Login } from '@components/Login';
import { Navigation } from '@components/Navigation';
import { Toast } from '@components/Toast';
import { Dashboard } from '@pages/Dashboard';
import { Forecast } from '@pages/Forecast';
import { Inventory } from '@pages/Inventory';
import { Simulate } from '@pages/Simulate';
import { Recommend } from '@pages/Recommend';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/" />;
};

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <main>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/forecast" element={<ProtectedRoute><Forecast /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/simulate" element={<ProtectedRoute><Simulate /></ProtectedRoute>} />
          <Route path="/recommend" element={<ProtectedRoute><Recommend /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/'} />} />
        </Routes>
      </main>
      {isLoggedIn && <Toast />}
    </Router>
  );
}
