import React from 'react';
import { formatCurrency } from '../../utils/salaryHelpers';

export default function SalaryBreakdownCard({ record }) {
  if (!record) return null;

  const earnings = record.earnings || {};
  const deductions = record.deductions || {};
  const employer = record.employerContributions || {};
  const totals = record.calculatedTotals || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
      {/* Earnings Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center justify-between">
          <span>Earnings & Allowances</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold">
            {formatCurrency(totals.annualBase)} / yr
          </span>
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Basic Salary</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(earnings.basicSalary)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">House Rent Allowance (HRA)</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(earnings.hra)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Special Allowance</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(earnings.specialAllowance)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Medical Allowance</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(earnings.medicalAllowance)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Travel Allowance</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(earnings.travelAllowance)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Performance Bonus</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(earnings.bonus)}</strong>
          </div>
        </div>
      </div>

      {/* Deductions Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center justify-between">
          <span>Deductions</span>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold">
            -{formatCurrency(totals.monthlyDeductions * 12)} / yr
          </span>
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Employee PF (12%)</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(deductions.employeePf)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Professional Tax (PT)</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(deductions.professionalTax)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Income Tax (Mock TDS)</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(deductions.incomeTax)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Other Deductions</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(deductions.otherDeductions)}</strong>
          </div>
        </div>
      </div>

      {/* Employer Contributions & Summary */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center justify-between">
          <span>Employer Benefits & CTC</span>
          <span className="text-[11px] text-violet-600 dark:text-violet-400 font-extrabold">
            {formatCurrency(totals.totalAnnualCTC)} / yr
          </span>
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Employer PF (12%)</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(employer.employerPf)}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-500">Medical Insurance</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(employer.insurance)}</strong>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 mt-4 flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Monthly Net Take-Home</span>
            <span className="font-extrabold text-teal-700 dark:text-teal-400 text-sm">{formatCurrency(totals.monthlyNet)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
