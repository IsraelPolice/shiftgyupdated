import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import CompanyManagement from '../pages/admin/CompanyManagement';
import CreateCompany from '../pages/admin/CreateCompany';

export default function AdminRoutes() {
  const { user, isSuperAdmin } = useAuth();
  
  // Only super admins can access these routes
  if (!user || !isSuperAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="companies" element={<CompanyManagement />} />
        <Route path="companies/new" element={<CreateCompany />} />
        <Route path="companies/:id/edit" element={<div>Edit Company</div>} />
        <Route path="companies/:id/users" element={<div>Manage Company Users</div>} />
        <Route path="companies/:id/subscription" element={<div>Manage Company Subscription</div>} />
        <Route path="*" element={<Navigate to="/admin/companies" replace />} />
      </Route>
    </Routes>
  );
}