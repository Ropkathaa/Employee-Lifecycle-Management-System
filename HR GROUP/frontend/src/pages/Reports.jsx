import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import { FiDownload, FiUsers, FiFileText, FiBookOpen, FiBarChart2 } from 'react-icons/fi';
import { generatedReports, reportGenerators, reportStats, REPORT_TYPES } from '../mock/reports';

const REPORT_TYPE_STYLES = {
  Compliance: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  Payroll: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
  Headcount: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400',
  Training: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  Document: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
};

const REPORT_STATUS_STYLES = {
  Ready: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
  Expired: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
  Generating: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
};

const GENERATOR_ICONS = {
  users: FiUsers,
  'dollar-sign': FiBarChart2,
  'book-open': FiBookOpen,
  'file-text': FiFileText,
};

const GENERATOR_COLOR_MAP = {
  primary: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700',
  success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700',
  warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700',
  violet: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:border-purple-300 dark:hover:border-purple-700',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Reports() {
  const [filterType, setFilterType] = useState('');
  const [generatingId, setGeneratingId] = useState(null);

  const filtered = filterType
    ? generatedReports.filter((r) => r.type === filterType)
    : generatedReports;

  const handleGenerate = (genId) => {
    setGeneratingId(genId);
    setTimeout(() => setGeneratingId(null), 1500);
  };

  const headers = ['Report Name', 'Type', 'Format', 'Rows', 'Generated', 'Status', 'Actions'];

  const renderRow = (report) => (
    <tr key={report.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <FiFileText className="text-violet-600 dark:text-violet-400 flex-shrink-0" size={15} />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{report.name}</span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${REPORT_TYPE_STYLES[report.type]}`}>
          {report.type}
        </span>
      </td>
      <td className="text-sm text-slate-500 dark:text-slate-400 py-3.5 px-4">{report.format}</td>
      <td className="text-sm text-slate-600 dark:text-slate-400 py-3.5 px-4">{report.rows.toLocaleString()}</td>
      <td className="py-3.5 px-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(report.generatedAt)}</p>
        <p className="text-xs text-slate-400">by {report.generatedBy}</p>
      </td>
      <td className="py-3.5 px-4">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${REPORT_STATUS_STYLES[report.status]}`}>
          {report.status}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <button
          disabled={report.status === 'Expired'}
          className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiDownload size={12} /> Download
        </button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytical Reports"
        breadcrumbs={[{ label: 'Reports Console', path: '/reports' }]}
      />

      {/* Generator Cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
          Generate New Report
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportGenerators.map((gen) => {
            const Icon = GENERATOR_ICONS[gen.icon] || FiFileText;
            const isGenerating = generatingId === gen.id;
            const colorCls = GENERATOR_COLOR_MAP[gen.color] || GENERATOR_COLOR_MAP.primary;
            return (
              <button
                key={gen.id}
                onClick={() => handleGenerate(gen.id)}
                disabled={isGenerating}
                className={`text-left p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                  ${colorCls} disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
              >
                <span className="inline-flex p-2 rounded-lg mb-2.5 bg-current/10">
                  <Icon size={18} />
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{gen.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{gen.description}</p>
                {isGenerating && (
                  <span className="mt-2 block text-xs font-medium text-violet-600 animate-pulse">Generating…</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Generated Reports</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {filtered.length} of {generatedReports.length} reports · {reportStats.totalReportsGenerated} total generated
            </p>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2 focus:outline-none focus:border-primary transition-all"
          >
            <option value="">All Types</option>
            {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Table headers={headers} data={filtered} renderRow={renderRow} emptyMessage="No reports found for the selected type." />
      </div>
    </div>
  );
}
