import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ReportBuilder from '../components/analytics/ReportBuilder';
import { useAnalytics } from '../hooks/useAnalytics';

export default function ReportGenerator() {
  const navigate = useNavigate();
  const { generateReport, exportReport } = useAnalytics();

  const handleCompleteReport = (criteria) => {
    generateReport(criteria);
    navigate('/reports');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="7-Step Interactive Report Builder"
        breadcrumbs={[
          { label: 'Report Center', path: '/reports' },
          { label: 'Report Generator', path: '/reports/generator' },
        ]}
      />

      <ReportBuilder
        onCompleteReport={handleCompleteReport}
        onExport={(id, fmt) => exportReport(id, fmt)}
      />
    </div>
  );
}
