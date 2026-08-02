import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import EmployeeCreate from '../pages/EmployeeCreate';
import EmployeeDetail from '../pages/EmployeeDetail';
import EmployeeEdit from '../pages/EmployeeEdit';
import Documents from '../pages/Documents';
import DocumentUpload from '../pages/DocumentUpload';
import DocumentDetail from '../pages/DocumentDetail';
import Offers from '../pages/Offers';
import OfferCreate from '../pages/OfferCreate';
import OfferDetail from '../pages/OfferDetail';
import OfferEdit from '../pages/OfferEdit';
import Salary from '../pages/Salary';
import SalaryDetail from '../pages/SalaryDetail';
import Training from '../pages/Training';
import TrainingCreate from '../pages/TrainingCreate';
import TrainingDetail from '../pages/TrainingDetail';
import ReportCenter from '../pages/ReportCenter';
import AnalyticsDashboard from '../pages/AnalyticsDashboard';
import ReportGenerator from '../pages/ReportGenerator';
import DepartmentAnalyticsPage from '../pages/DepartmentAnalyticsPage';
import ComplianceDashboardPage from '../pages/ComplianceDashboardPage';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// ProtectedRoute stub checker: checks localStorage for authorization token parameters
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Authentications Layout routing */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Protected Dashboard console layout routing */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/create" element={<EmployeeCreate />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="employees/:id/edit" element={<EmployeeEdit />} />
        <Route path="documents" element={<Documents />} />
        <Route path="documents/upload" element={<DocumentUpload />} />
        <Route path="documents/:id" element={<DocumentDetail />} />
        <Route path="offers" element={<Offers />} />
        <Route path="offers/create" element={<OfferCreate />} />
        <Route path="offers/:id" element={<OfferDetail />} />
        <Route path="offers/:id/edit" element={<OfferEdit />} />
        <Route path="salary" element={<Salary />} />
        <Route path="salary/:empId" element={<SalaryDetail />} />
        <Route path="training" element={<Training />} />
        <Route path="training/create" element={<TrainingCreate />} />
        <Route path="training/:id" element={<TrainingDetail />} />
        <Route path="reports" element={<ReportCenter />} />
        <Route path="reports/analytics" element={<AnalyticsDashboard />} />
        <Route path="reports/generator" element={<ReportGenerator />} />
        <Route path="reports/departments" element={<DepartmentAnalyticsPage />} />
        <Route path="reports/compliance" element={<ComplianceDashboardPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Fallback public layout routing */}
      <Route path="/" element={<MainLayout />}>
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
