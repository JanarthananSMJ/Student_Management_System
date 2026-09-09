import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsListPage from './pages/StudentsListPage';
import StudentFormPage from './pages/StudentFormPage';
import StudentDetailPage from './pages/StudentDetailPage';
import StaffListPage from './pages/StaffListPage';
import StaffFormPage from './pages/StaffFormPage';
import StaffDetailPage from './pages/StaffDetailPage';
import AcademicsPage from './pages/AcademicsPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';

function LoginRoute() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LoginPage />;
}

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
              <Route path="/students" element={<StudentsListPage />} />
              <Route path="/students/:id" element={<StudentDetailPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/students/new" element={<StudentFormPage />} />
              <Route path="/students/:id/edit" element={<StudentFormPage />} />
              <Route path="/staff" element={<StaffListPage />} />
              <Route path="/staff/new" element={<StaffFormPage />} />
              <Route path="/staff/:id" element={<StaffDetailPage />} />
              <Route path="/staff/:id/edit" element={<StaffFormPage />} />
              <Route path="/academics/*" element={<AcademicsPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
