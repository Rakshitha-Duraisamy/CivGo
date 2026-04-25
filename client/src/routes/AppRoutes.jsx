import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Pages - Public
// import Landing from '../pages/Landing';
import PublicDashboard from '../pages/PublicDashboard';

// Pages - Citizen
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import SubmitComplaint from '../pages/citizen/SubmitComplaint';
import ComplaintHistory from '../pages/citizen/ComplaintHistory';
import ComplaintDetails from '../pages/citizen/ComplaintDetails';
import NearbyComplaints from '../pages/citizen/NearbyComplaints';

// Pages - Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminComplaints from '../pages/admin/AdminComplaints';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';

// Protection Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/public-dashboard" element={<MainLayout><PublicDashboard /></MainLayout>} />

      {/* Citizen Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['citizen', 'admin']}><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/submit-complaint" element={<SubmitComplaint />} />
        <Route path="/history" element={<ComplaintHistory />} />
        <Route path="/complaint/:id" element={<ComplaintDetails />} />
        <Route path="/nearby" element={<NearbyComplaints />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
