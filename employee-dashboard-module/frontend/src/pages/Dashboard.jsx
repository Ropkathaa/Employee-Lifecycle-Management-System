import React, { useEffect, useCallback } from 'react';
import { useEmployee } from '../context/EmployeeContext';
import { employeeService } from '../services/employeeService';
import WelcomeBanner from '../components/WelcomeBanner';
import EmployeeInfoCard from '../components/EmployeeInfoCard';
import TodayAttendanceCard from '../components/TodayAttendanceCard';
import RecentNotifications from '../components/RecentNotifications';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const {
    dashboardData,
    dashboardLoading,
    fetchDashboard,
    error,
  } = useEmployee();

  useEffect(() => {
    if (!dashboardData) {
      fetchDashboard();
    }
  }, [dashboardData, fetchDashboard]);

  const handleCheckIn = useCallback(async () => {
    try {
      const response = await employeeService.checkIn();
      toast.success(response.data?.message || 'Checked in successfully');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check in');
    }
  }, [fetchDashboard]);

  const handleCheckOut = useCallback(async () => {
    try {
      const response = await employeeService.checkOut();
      toast.success(response.data?.message || 'Checked out successfully');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check out');
    }
  }, [fetchDashboard]);

  if (dashboardLoading && !dashboardData) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <LoadingSkeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <LoadingSkeleton className="h-80 w-full" />
            <LoadingSkeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
<p className="text-red-500 font-medium">Failed to load dashboard data</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const profile = dashboardData?.profile || null;
  const todayAttendance = dashboardData?.todayAttendance || null;
  const recentNotifications = dashboardData?.recentNotifications || [];
  const unreadNotifications = dashboardData?.unreadNotifications || 0;

  const fullName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
    : 'Employee';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner employeeName={fullName} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Employee Info */}
        <div className="lg:col-span-1 space-y-6">
          <EmployeeInfoCard employee={profile} />
        </div>

        {/* Right Column - Attendance + Notifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Attendance */}
          <TodayAttendanceCard
            record={todayAttendance}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            loadingAction={false}
          />

          {/* Recent Notifications */}
          <RecentNotifications
            notifications={recentNotifications}
            unreadCount={unreadNotifications}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
