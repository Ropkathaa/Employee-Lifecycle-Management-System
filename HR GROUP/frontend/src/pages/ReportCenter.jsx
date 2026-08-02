import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ReportTable from '../components/analytics/ReportTable';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import { useAnalytics } from '../hooks/useAnalytics';
import { FiFileText, FiPlus, FiPieChart, FiGrid, FiShield } from 'react-icons/fi';

export default function ReportCenter() {
  const navigate = useNavigate();
  const {
    reportTemplates,
    filteredTemplates,
    savedReports,
    filters,
    setFilters,
    resetFilters,
    generateReport,
    exportReport,
  } = useAnalytics();

  const [activeTab, setActiveTab] = useState('library');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Report Center & Library"
        breadcrumbs={[{ label: 'Report Center', path: '/reports' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate('/reports/analytics')}>
              <FiPieChart size={16} /> Executive Analytics
            </Button>
            <Button variant="primary" onClick={() => navigate('/reports/generator')}>
              <FiPlus size={16} /> Build Custom Report
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 text-xs font-bold">
        <button
          onClick={() => setActiveTab('library')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'library' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500'
          }`}
        >
          <FiFileText size={14} /> Report Library ({reportTemplates.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'saved' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500'
          }`}
        >
          <FiGrid size={14} /> Generated Reports ({savedReports.length})
        </button>
      </div>

      {activeTab === 'library' && (
        <div className="space-y-6">
          <AnalyticsFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            totalCount={reportTemplates.length}
            filteredCount={filteredTemplates.length}
          />

          <ReportTable
            templates={filteredTemplates}
            onGenerate={(tpl) => generateReport({ title: tpl.name, templateId: tpl.id })}
            onExport={(id, fmt) => exportReport(id, fmt)}
          />
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 text-center space-y-3 text-xs">
          <FiFileText size={32} className="mx-auto text-slate-400" />
          <h4 className="font-bold text-slate-900 dark:text-white">Generated Reports Archive</h4>
          {savedReports.length === 0 ? (
            <p className="text-slate-400">No reports generated yet. Click "Build Custom Report" to create one.</p>
          ) : (
            <div className="space-y-2 max-w-xl mx-auto text-left">
              {savedReports.map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-slate-50 border flex justify-between">
                  <span>{r.title} ({r.id})</span>
                  <button onClick={() => exportReport(r.id, 'PDF')} className="text-violet-600 font-bold">Download</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
