import React from 'react';
import { FiPieChart, FiActivity, FiShield, FiUsers } from 'react-icons/fi';

export default function ExecutiveSummary({ kpis, systemHealth }) {
  if (!kpis) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
        <div>
          <span className="text-[11px] font-bold text-violet-400 uppercase tracking-widest block">Executive Summary</span>
          <h2 className="text-xl font-extrabold text-white">Boardroom HR Analytics & Health Monitor</h2>
        </div>
        {systemHealth && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{systemHealth.status} ({systemHealth.uptimePercentage}% Uptime)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-slate-400 block text-[11px]">Total Headcount</span>
          <strong className="text-lg font-bold text-white block">{kpis.totalEmployees} Employees</strong>
          <span className="text-emerald-400 text-[10px]">{kpis.activeEmployees} Active ({kpis.newJoinees} new joinees)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-slate-400 block text-[11px]">Monthly Payroll Estimate</span>
          <strong className="text-lg font-bold text-white block">{kpis.monthlyPayrollFormatted}</strong>
          <span className="text-slate-300 text-[10px]">Avg CTC: {kpis.avgCTCFormatted}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-slate-400 block text-[11px]">Compliance Score</span>
          <strong className="text-lg font-bold text-emerald-400 block">{kpis.overallComplianceScore}%</strong>
          <span className="text-slate-300 text-[10px]">Training: {kpis.trainingComplianceRate}% · Docs: {kpis.docComplianceRate}%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-slate-400 block text-[11px]">Recruitment Acceptance</span>
          <strong className="text-lg font-bold text-violet-300 block">{kpis.offerAcceptanceRate}%</strong>
          <span className="text-slate-300 text-[10px]">{kpis.upcomingJoinings} Upcoming Joinings</span>
        </div>
      </div>
    </div>
  );
}
