import React from 'react';
import { formatCurrency } from '../../utils/offerHelpers';
import { formatDateDDMMYYYY } from '../../utils/dateValidation';
import OfferStatusBadge from './OfferStatusBadge';

export default function OfferPreview({ offer }) {
  if (!offer) return null;

  const comp = offer.compensation || {};

  return (
    <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-8 sm:p-12 space-y-8 shadow-sm font-sans max-w-4xl mx-auto text-xs leading-relaxed">
      {/* Letterhead Header */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 text-white font-bold flex items-center justify-center text-sm">
              HR
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">NEXUS HR PLATFORM</h1>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Enterprise HR Automation & Workforce Services</p>
        </div>
        <div className="text-right font-mono text-[11px]">
          <p className="font-bold text-slate-800">{offer.id}</p>
          <p className="text-slate-500">Date: {formatDateDDMMYYYY(offer.generatedDate)}</p>
          <div className="mt-1"><OfferStatusBadge status={offer.status} /></div>
        </div>
      </div>

      {/* Greeting & Candidate Info */}
      <div className="space-y-3">
        <p className="font-bold text-slate-800 text-sm">Strictly Private & Confidential</p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
          <p><strong className="text-slate-700">Candidate Name:</strong> {offer.candidateName}</p>
          <p><strong className="text-slate-700">Email Address:</strong> {offer.candidateEmail}</p>
          <p><strong className="text-slate-700">Phone Number:</strong> {offer.candidatePhone}</p>
        </div>
        <p>Dear <strong>{offer.candidateName}</strong>,</p>
        <p>
          On behalf of Nexus Enterprise Platform, we are pleased to offer you the position of{' '}
          <strong>{offer.designation}</strong> in our <strong>{offer.department}</strong> department, reporting to{' '}
          <strong>{offer.manager || 'Management'}</strong>. We are excited about the prospect of having you join our team.
        </p>
      </div>

      {/* Key Employment Terms Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px]">
        <div><span className="text-slate-400 block">Employment Type</span><strong className="text-slate-800">{offer.employmentType}</strong></div>
        <div><span className="text-slate-400 block">Joining Date</span><strong className="text-slate-800">{formatDateDDMMYYYY(offer.joiningDate)}</strong></div>
        <div><span className="text-slate-400 block">Work Location</span><strong className="text-slate-800">{offer.workLocation}</strong></div>
        <div><span className="text-slate-400 block">Offer Validity</span><strong className="text-slate-800">{formatDateDDMMYYYY(offer.validUntilDate)}</strong></div>
      </div>

      {/* Compensation Structure Table */}
      <div className="space-y-2">
        <h3 className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1">
          ANNEXURE A: COMPENSATION & BENEFITS BREAKDOWN
        </h3>
        <table className="w-full border-collapse border border-slate-200 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="py-2 px-3 text-left">Component</th>
              <th className="py-2 px-3 text-right">Monthly (₹)</th>
              <th className="py-2 px-3 text-right">Annualized (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr><td className="py-2 px-3">Basic Salary</td><td className="py-2 px-3 text-right">{formatCurrency(comp.basicSalary / 12)}</td><td className="py-2 px-3 text-right">{formatCurrency(comp.basicSalary)}</td></tr>
            <tr><td className="py-2 px-3">House Rent Allowance (HRA)</td><td className="py-2 px-3 text-right">{formatCurrency(comp.hra / 12)}</td><td className="py-2 px-3 text-right">{formatCurrency(comp.hra)}</td></tr>
            <tr><td className="py-2 px-3">Special & Statutory Allowances</td><td className="py-2 px-3 text-right">{formatCurrency(comp.specialAllowance / 12)}</td><td className="py-2 px-3 text-right">{formatCurrency(comp.specialAllowance)}</td></tr>
            <tr><td className="py-2 px-3 font-semibold">Gross Monthly Remuneration</td><td className="py-2 px-3 text-right font-bold text-slate-900">{formatCurrency(comp.monthlyGross)}</td><td className="py-2 px-3 text-right font-bold text-slate-900">{formatCurrency(comp.annualBase)}</td></tr>
            <tr><td className="py-2 px-3">Employer PF Contribution (12%)</td><td className="py-2 px-3 text-right">{formatCurrency(comp.employerPf / 12)}</td><td className="py-2 px-3 text-right">{formatCurrency(comp.employerPf)}</td></tr>
            <tr><td className="py-2 px-3">Annual Bonus & Retainers</td><td className="py-2 px-3 text-right">—</td><td className="py-2 px-3 text-right">{formatCurrency(comp.bonus)}</td></tr>
            <tr className="bg-emerald-50/70 font-bold text-emerald-900 border-t-2 border-slate-300">
              <td className="py-2.5 px-3">TOTAL COST TO COMPANY (CTC)</td>
              <td className="py-2.5 px-3 text-right">{formatCurrency(comp.monthlyGross + (comp.employerPf / 12))}</td>
              <td className="py-2.5 px-3 text-right text-emerald-700 font-extrabold text-sm">{formatCurrency(comp.totalCTC)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Benefits List */}
      {offer.benefits?.length > 0 && (
        <div className="space-y-1 text-[11px]">
          <h4 className="font-bold text-slate-800">Perks & Company Benefits Included:</h4>
          <p className="text-slate-600">{offer.benefits.join(' • ')}</p>
        </div>
      )}

      {/* Digital Signatures Block */}
      <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-[11px]">
        <div className="space-y-4">
          <p className="font-bold text-slate-700">For Nexus Enterprise Platform:</p>
          <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 font-serif text-violet-700 font-bold text-sm">
            Priya Sharma (HR Director)
          </div>
          <p className="text-slate-400">Authorized HR Signatory</p>
        </div>

        <div className="space-y-4">
          <p className="font-bold text-slate-700">Candidate Acceptance & Acknowledgement:</p>
          <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 text-slate-500 font-mono text-[10px]">
            {offer.status === 'Accepted' ? `Digital Signature Verified: ${offer.candidateName}` : 'Signature Placeholder'}
          </div>
          <p className="text-slate-400">Candidate Signature & Date</p>
        </div>
      </div>
    </div>
  );
}
