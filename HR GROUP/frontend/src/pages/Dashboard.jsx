import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiCalendar, FiUsers, FiChevronRight } from 'react-icons/fi';
import DashboardStats from '../components/dashboard/DashboardStats';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import DashboardChart from '../components/dashboard/DashboardChart';
import UpcomingTaskCard from '../components/dashboard/UpcomingTaskCard';
import NotificationCard from '../components/dashboard/NotificationCard';
import { useEmployees } from '../hooks/useEmployees';
import {
  quickActions,
  employeeGrowthData,
  departmentDistribution,
  trainingCompletionData,
  upcomingTasks,
  pendingApprovals,
} from '../mock/dashboard';

// ─── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Active: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
  Probation: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  Suspended: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400',
  Resigned: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.Active}`}>
      {status}
    </span>
  );
}

// ─── Dashboard Welcome Header ──────────────────────────────────────────────────
function DashboardHeader({ searchQuery, onSearch }) {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Good morning, Admin 👋
        </h1>
        <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500 dark:text-slate-400">
          <FiCalendar size={13} />
          <span>{today}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search employees…"
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800
              text-slate-800 dark:text-slate-200 placeholder-slate-400
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200 w-56"
          />
        </div>
        <button
          onClick={() => navigate('/settings')}
          aria-label="Notifications"
          className="relative p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors duration-150"
        >
          <FiBell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>
      </div>
    </div>
  );
}

// ─── Recent Employees Table ────────────────────────────────────────────────────
function RecentEmployeesTable({ employees, searchQuery }) {
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Recent Employees
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Latest {filtered.length} joinee records
          </p>
        </div>
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-150 cursor-pointer"
        >
          View all <FiChevronRight size={13} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              {['Employee', 'Department', 'Joining Date', 'Status', 'Action'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3 px-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-sm text-slate-400 dark:text-slate-500">
                  <FiUsers className="mx-auto mb-2" size={24} />
                  No employees match your search.
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${emp.avatarColor || 'bg-violet-500'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {emp.avatarInitials || emp.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{emp.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{emp.department}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{emp.designation}</p>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(emp.dateOfJoining || emp.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors duration-150 cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Right Sidebar Panel ───────────────────────────────────────────────────────
function RightSidebar({ tasks, approvals }) {
  const [localApprovals, setLocalApprovals] = useState(approvals);

  const handleApprove = (id) => setLocalApprovals((prev) => prev.filter((a) => a.id !== id));
  const handleReject = (id) => setLocalApprovals((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Upcoming Tasks</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{tasks.length}</span>
        </div>
        <div className="px-5 py-1">
          {tasks.map((task) => <UpcomingTaskCard key={task.id} task={task} />)}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Pending Approvals</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">{localApprovals.length}</span>
        </div>
        <div className="px-5 py-1">
          {localApprovals.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">All approvals resolved ✓</p>
          ) : (
            localApprovals.map((appr) => (
              <NotificationCard key={appr.id} approval={appr} onApprove={handleApprove} onReject={handleReject} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { employees, statsData, recentActivities } = useEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  const recentEmployees = useMemo(() => employees.slice(0, 5), [employees]);

  return (
    <div className="space-y-6">
      <DashboardHeader searchQuery={searchQuery} onSearch={setSearchQuery} />

      <DashboardStats stats={statsData} isLoading={isLoading} />

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => <QuickActionCard key={action.id} action={action} />)}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5 min-w-0">
          <RecentEmployeesTable employees={recentEmployees} searchQuery={searchQuery} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <DashboardChart type="bar" title="Employee Growth" subtitle="Last 6 months" data={employeeGrowthData} isLoading={isLoading} />
            <DashboardChart type="horizontal-bar" title="Department Split" subtitle="By headcount" data={departmentDistribution} isLoading={isLoading} />
            <DashboardChart type="donut" title="Training Status" subtitle="Across all programs" data={trainingCompletionData} isLoading={isLoading} />
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Recent Activity</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Latest HR events across the platform</p>
              </div>
              <button
                onClick={() => navigate('/employees')}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-150 cursor-pointer"
              >
                View all <FiChevronRight size={13} />
              </button>
            </div>
            <div className="px-5 py-4">
              <ActivityTimeline activities={recentActivities} isLoading={isLoading} />
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <RightSidebar tasks={upcomingTasks} approvals={pendingApprovals} />
        </div>
      </div>
    </div>
  );
}
