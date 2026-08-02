import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import SalaryBadge from '../components/salary/SalaryBadge';
import SalaryBreakdownCard from '../components/salary/SalaryBreakdownCard';
import PFSummaryCard from '../components/salary/PFSummaryCard';
import SalaryRevisionModal from '../components/salary/SalaryRevisionModal';
import SalaryCompareModal from '../components/salary/SalaryCompareModal';
import { useSalary } from '../hooks/useSalary';
import { formatCurrency } from '../utils/salaryHelpers';
import { FiDollarSign, FiEdit3, FiArrowLeft, FiColumns, FiClock } from 'react-icons/fi';

export default function SalaryDetail() {
  const { empId } = useParams();
  const navigate = useNavigate();
  const { getSalaryByEmployeeId, reviseSalary } = useSalary();

  const [showReviseModal, setShowReviseModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const record = getSalaryByEmployeeId(empId);

  if (!record) {
    return (
      <div className="space-y-6">
        <PageHeader title="Salary Record Not Found" breadcrumbs={[{ label: 'Salary Summary', path: '/salary' }]} />
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 mb-4">Salary record for Employee ID "{empId}" was not found.</p>
          <button onClick={() => navigate('/salary')} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold">
            Back to Salary Roster
          </button>
        </div>
      </div>
    );
  }

  const totals = record.calculatedTotals || {};

  const handleRevisionSubmit = (employeeId, revisionInput, reason) => {
    reviseSalary(employeeId, revisionInput, reason);
    setShowReviseModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Salary Summary — ${record.employeeName}`}
        breadcrumbs={[
          { label: 'Salary Summary', path: '/salary' },
          { label: record.employeeId, path: `/salary/${record.employeeId}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReviseModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm"
            >
              <FiEdit3 size={14} /> Revise Salary Package
            </button>
            <button onClick={() => navigate('/salary')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold">
              <FiArrowLeft size={14} /> Back to Roster
            </button>
          </div>
        }
      />

      {/* Hero Overview Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <FiDollarSign size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {record.employeeName}
              <SalaryBadge status={record.status} />
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {record.employeeId} · {record.department} › {record.designation} · Effective: {record.effectiveDate}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-slate-400 text-xs block">Total Annualized CTC</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(totals.totalAnnualCTC)}</span>
        </div>
      </div>

      {/* Earnings, Deductions & Employer Contributions Breakdown */}
      <SalaryBreakdownCard record={record} />

      {/* Provident Fund (PF) Summary Card */}
      <PFSummaryCard record={record} />

      {/* Revision History & Side-by-Side Comparison */}
      <Card title="Salary Revision History & Version Timeline">
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Total Versions: <strong>{(record.revisions || []).length}</strong></span>
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-bold border border-violet-200 dark:border-violet-800"
            >
              <FiColumns size={14} /> Compare Revisions Side-by-Side
            </button>
          </div>

          <div className="space-y-2">
            {(record.revisions || []).map((rev) => (
              <div key={rev.version} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-violet-600 font-mono">v{rev.version}</span>
                  <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{rev.reason}</span>
                  <p className="text-[11px] text-slate-400">Effective: {rev.effectiveDate} · Revised By: {rev.revisedBy}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-600 block">{formatCurrency(rev.calculatedTotals?.totalAnnualCTC || rev.totalAnnualCTC)}</span>
                  <button onClick={() => setShowCompareModal(true)} className="text-violet-600 font-semibold hover:underline">Compare</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Modals */}
      <SalaryRevisionModal record={record} isOpen={showReviseModal} onClose={() => setShowReviseModal(false)} onSubmitRevision={handleRevisionSubmit} />
      <SalaryCompareModal record={record} isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} />
    </div>
  );
}
