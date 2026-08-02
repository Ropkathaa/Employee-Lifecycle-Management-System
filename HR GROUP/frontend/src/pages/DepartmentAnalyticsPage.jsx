import React from 'react';
import PageHeader from '../components/PageHeader';
import DepartmentCard from '../components/analytics/DepartmentCard';
import { useAnalytics } from '../hooks/useAnalytics';

export default function DepartmentAnalyticsPage() {
  const { departmentAnalytics } = useAnalytics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Analytics & Compensation Breakdown"
        breadcrumbs={[
          { label: 'Report Center', path: '/reports' },
          { label: 'Department Analytics', path: '/reports/departments' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departmentAnalytics.map((dept) => (
          <DepartmentCard key={dept.department} department={dept} />
        ))}
      </div>
    </div>
  );
}
