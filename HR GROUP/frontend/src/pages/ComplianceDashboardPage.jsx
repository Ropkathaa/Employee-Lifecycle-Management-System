import React from 'react';
import PageHeader from '../components/PageHeader';
import ComplianceCard from '../components/training/ComplianceCard';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTraining } from '../hooks/useTraining';

export default function ComplianceDashboardPage() {
  const { kpis } = useAnalytics();
  const { compliance } = useTraining();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Audit & Compliance Dashboard"
        breadcrumbs={[
          { label: 'Report Center', path: '/reports' },
          { label: 'Compliance Dashboard', path: '/reports/compliance' },
        ]}
      />

      <ComplianceCard compliance={compliance} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">Document Compliance Status</h4>
          <p className="text-slate-400">Verified Documents Rate: <strong className="text-teal-600 font-extrabold">{kpis.docComplianceRate}%</strong></p>
          <span className="text-[11px] text-amber-600 block">{kpis.pendingDocuments} documents require verification</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">Training Compliance Status</h4>
          <p className="text-slate-400">Mandatory Course Completion: <strong className="text-emerald-600 font-extrabold">{kpis.trainingComplianceRate}%</strong></p>
          <span className="text-[11px] text-teal-600 block">Overall Compliance Score: {kpis.overallComplianceScore}%</span>
        </div>
      </div>
    </div>
  );
}
