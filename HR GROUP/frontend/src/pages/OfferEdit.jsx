import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import OfferPreview from '../components/offer/OfferPreview';
import { useOffers } from '../hooks/useOffers';
import { calculateCompensation, formatCurrency, isOfferEditable } from '../utils/offerHelpers';
import { formatDateDDMMYYYY } from '../utils/dateValidation';
import { FiCheckCircle, FiArrowRight, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const WIZARD_STEPS = ['Candidate', 'Compensation', 'Benefits', 'Terms', 'Preview'];

export default function OfferEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOfferById, reviseOffer } = useOffers();

  const [currentStep, setCurrentStep] = useState(1);
  const [changeSummary, setChangeSummary] = useState('Revised offer compensation and terms');
  const [formData, setFormData] = useState(null);

  const offer = getOfferById(id);

  useEffect(() => {
    if (offer) {
      setFormData({
        candidateName: offer.candidateName || '',
        candidateEmail: offer.candidateEmail || '',
        candidatePhone: offer.candidatePhone || '',
        department: offer.department || '',
        designation: offer.designation || '',
        manager: offer.manager || '',
        employmentType: offer.employmentType || 'Full-Time',
        joiningDate: offer.joiningDate || '',
        workLocation: offer.workLocation || 'Hybrid',
        officeAddress: offer.officeAddress || '',
        probationPeriod: offer.probationPeriod || '90 Days',
        noticePeriod: offer.noticePeriod || '60 Days',
        workingHours: offer.workingHours || '9:30 AM - 6:30 PM (Mon-Fri)',
        validUntilDate: offer.validUntilDate || '',
        compensation: offer.compensation || { basicSalary: 800000, hra: 320000, specialAllowance: 240000 },
        benefits: offer.benefits || [],
        remarks: offer.remarks || '',
      });
    }
  }, [offer]);

  if (!offer || !formData) {
    return (
      <div className="space-y-6">
        <PageHeader title="Offer Not Found" breadcrumbs={[{ label: 'Offers', path: '/offers' }]} />
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 mb-4">Offer ID "{id}" was not found.</p>
          <button onClick={() => navigate('/offers')} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold">
            Back to Offers Roster
          </button>
        </div>
      </div>
    );
  }

  if (!isOfferEditable(offer.status)) {
    return (
      <div className="space-y-6">
        <PageHeader title="Offer Read-Only" breadcrumbs={[{ label: 'Offers', path: '/offers' }]} />
        <div className="bg-rose-50 dark:bg-rose-950/30 p-8 text-center rounded-2xl border border-rose-200 dark:border-rose-800 space-y-3">
          <FiAlertCircle size={36} className="mx-auto text-rose-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Offer Packet is Read-Only</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Offer {offer.id} has status "{offer.status}". Finalized offers cannot be edited.
          </p>
          <button onClick={() => navigate(`/offers/${offer.id}`)} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold">
            Return to Offer Details
          </button>
        </div>
      </div>
    );
  }

  const computedComp = calculateCompensation(formData.compensation);

  const handleBenefitToggle = (b) => {
    setFormData((prev) => {
      const exists = prev.benefits.includes(b);
      return {
        ...prev,
        benefits: exists ? prev.benefits.filter((item) => item !== b) : [...prev.benefits, b],
      };
    });
  };

  const handleSaveRevision = async () => {
    await reviseOffer(offer.id, formData, changeSummary);
    navigate(`/offers/${offer.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit & Revise Offer — ${offer.candidateName} (${offer.id})`}
        breadcrumbs={[
          { label: 'Offers', path: '/offers' },
          { label: offer.id, path: `/offers/${offer.id}` },
          { label: 'Edit Offer', path: `#` },
        ]}
      />

      {/* Progress Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {WIZARD_STEPS.map((stepName, idx) => {
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;
            const isDone = currentStep > stepNum;

            return (
              <button
                key={stepName}
                onClick={() => isDone && setCurrentStep(stepNum)}
                className={`flex items-center gap-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isCurrent ? 'text-violet-600 dark:text-violet-400' : isDone ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isCurrent ? 'bg-violet-600 text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {isDone ? '✓' : stepNum}
                </span>
                <span className="hidden sm:inline">{stepName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span>Editing this offer will create <strong>Version {(offer.version || 1) + 1}</strong> without overwriting previous versions.</span>
          <span className="font-mono font-bold">Current: v{offer.version || 1}</span>
        </div>

        {/* STEP 1: Candidate */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Step 1: Role & Candidate Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="text-slate-500 font-semibold block mb-1">Candidate Name</label><input type="text" value={formData.candidateName} onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })} className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800" /></div>
              <div><label className="text-slate-500 font-semibold block mb-1">Department</label><input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800" /></div>
              <div><label className="text-slate-500 font-semibold block mb-1">Designation</label><input type="text" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800 font-bold" /></div>
            </div>
          </div>
        )}

        {/* STEP 2: Compensation */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Step 2: Revised Compensation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="text-slate-500 font-semibold block mb-1">Annual Basic Salary (₹)</label><input type="number" value={formData.compensation.basicSalary} onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, basicSalary: e.target.value } })} className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800 font-bold" /></div>
              <div><label className="text-slate-500 font-semibold block mb-1">Annual HRA (₹)</label><input type="number" value={formData.compensation.hra} onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, hra: e.target.value } })} className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800" /></div>
              <div><label className="text-slate-500 font-semibold block mb-1">Special Allowance (₹)</label><input type="number" value={formData.compensation.specialAllowance} onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, specialAllowance: e.target.value } })} className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-center">
              <div><span className="text-slate-400">Monthly Gross</span><p className="font-bold">{formatCurrency(computedComp.monthlyGross)}</p></div>
              <div><span className="text-slate-400">Annual Base</span><p className="font-bold">{formatCurrency(computedComp.annualBase)}</p></div>
              <div><span className="text-slate-400">Calculated Annual CTC</span><p className="font-extrabold text-emerald-600 text-sm">{formatCurrency(computedComp.totalCTC)}</p></div>
            </div>
          </div>
        )}

        {/* STEP 3: Benefits */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Step 3: Perks & Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {['Health Insurance', 'Accidental Insurance', 'Life Insurance', 'Paid Leave', 'Sick Leave', 'WFH Eligibility', 'Laptop', 'Mobile Reimbursement', 'Food Allowance', 'Transportation'].map((b) => {
                const checked = formData.benefits.includes(b);
                return (
                  <label key={b} onClick={() => handleBenefitToggle(b)} className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${checked ? 'bg-violet-50 border-violet-300 font-bold text-violet-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <span>{b}</span>
                    <input type="checkbox" checked={checked} readOnly className="rounded text-violet-600" />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Terms */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Step 4: Terms & Revision Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-slate-500 font-semibold block mb-1">Joining Date</label><input type="date" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800" /></div>
              <div><label className="text-slate-500 font-semibold block mb-1">Offer Valid Until</label><input type="date" value={formData.validUntilDate} onChange={(e) => setFormData({ ...formData, validUntilDate: e.target.value })} className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800 font-bold" /></div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Revision Reason / Change Summary *</label>
              <input type="text" value={changeSummary} onChange={(e) => setChangeSummary(e.target.value)} placeholder="e.g. Revised CTC after candidate negotiation round 1" className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800 font-semibold" />
            </div>
          </div>
        )}

        {/* STEP 5: Preview */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 border-b pb-2">Step 5: Review Version {(offer.version || 1) + 1} Offer Packet</h3>
            <OfferPreview offer={{ ...offer, ...formData, version: (offer.version || 1) + 1, compensation: computedComp }} />
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
          <button type="button" onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))} disabled={currentStep === 1} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border bg-slate-50 text-xs font-semibold disabled:opacity-40">
            <FiArrowLeft size={14} /> Back
          </button>

          {currentStep < 5 ? (
            <button type="button" onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 5))} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold">
              Next Step <FiArrowRight size={14} />
            </button>
          ) : (
            <button type="button" onClick={handleSaveRevision} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md">
              <FiCheckCircle size={15} /> Save Revision (Version {(offer.version || 1) + 1})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
