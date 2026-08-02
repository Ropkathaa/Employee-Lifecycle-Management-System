import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ExecutiveSummary from '../components/analytics/ExecutiveSummary';
import KPICard from '../components/analytics/KPICard';
import InsightCard from '../components/analytics/InsightCard';
import DepartmentCard from '../components/analytics/DepartmentCard';
import { useAnalytics } from '../hooks/useAnalytics';
import { FiUsers, FiDollarSign, FiShield, FiBriefcase, FiFileText, FiAward } from 'react-icons/fi';

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { kpis, departmentAnalytics, systemHealth, executiveInsights } = useAnalytics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive HR Analytics Dashboard"
        breadcrumbs={[
          { label: 'Report Center', path: '/reports' },
          { label: 'Executive Analytics', path: '/reports/analytics' },
        ]}
      />

      {/* Executive Boardroom Banner */}
      <ExecutiveSummary kpis={kpis} systemHealth={systemHealth} />

      {/* Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Employees"
          value={kpis.totalEmployees}
          subtitle={`${kpis.activeEmployees} active headcount`}
          trend="+14.2%"
          trendDirection="up"
          icon={FiUsers}
          targetPath="/employees"
        />
        <KPICard
          title="Average CTC"
          value={kpis.avgCTCFormatted}
          subtitle="Annualized average"
          trend="+8.4%"
          trendDirection="up"
          icon={FiDollarSign}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-50 dark:bg-emerald-950/30"
          targetPath="/salary"
        />
        <KPICard
          title="Monthly Payroll"
          value={kpis.monthlyPayrollFormatted}
          subtitle="Gross monthly payout"
          trend="+4.1%"
          trendDirection="up"
          icon={FiDollarSign}
          color="text-purple-600 dark:text-purple-400"
          bg="bg-purple-50 dark:bg-purple-950/30"
          targetPath="/salary"
        />
        <KPICard
          title="Overall Compliance"
          value={`${kpis.overallComplianceScore}%`}
          subtitle="Training & doc audit score"
          trend="+2.5%"
          trendDirection="up"
          icon={FiShield}
          color="text-teal-600 dark:text-teal-400"
          bg="bg-teal-50 dark:bg-teal-950/30"
          targetPath="/reports/compliance"
        />
        <KPICard
          title="Pending Documents"
          value={kpis.pendingDocuments}
          subtitle="Requires verification"
          trend="-8.5%"
          trendDirection="down"
          icon={FiFileText}
          color="text-amber-600 dark:text-amber-400"
          bg="bg-amber-50 dark:bg-amber-950/30"
          targetPath="/documents"
        />
        <KPICard
          title="Offer Acceptance"
          value={`${kpis.offerAcceptanceRate}%`}
          subtitle={`${kpis.upcomingJoinings} upcoming joinings`}
          trend="+5.0%"
          trendDirection="up"
          icon={FiBriefcase}
          color="text-sky-600 dark:text-sky-400"
          bg="bg-sky-50 dark:bg-sky-950/30"
          targetPath="/offers"
        />
      </div>

      {/* Executive Insights & Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Department Performance Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departmentAnalytics.map((dept) => (
              <DepartmentCard key={dept.department} department={dept} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Executive Insights</h3>
          <div className="space-y-3">
            {executiveInsights.map((ins) => (
              <InsightCard key={ins.id} insight={ins} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
