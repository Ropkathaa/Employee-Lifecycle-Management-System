import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import EmployeeList from '../pages/EmployeeList';
import EmployeeDetail from '../pages/EmployeeDetail';
import Attendance from '../pages/Attendance';
import LeaveManagement from '../pages/LeaveManagement';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Documents from '../pages/Documents';
import Training from '../pages/Training';
import Notifications from '../pages/Notifications';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leaves" element={<LeaveManagement />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="documents" element={<Documents />} />
        <Route path="training" element={<Training />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;

