import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import OfferPreview from '../components/offer/OfferPreview';
import { useOffers } from '../hooks/useOffers';
import { useEmployees } from '../hooks/useEmployees';
import { calculateCompensation, formatCurrency } from '../utils/offerHelpers';
import { formatDateDDMMYYYY } from '../utils/dateValidation';
import {
  FiCheckCircle, FiUser, FiDollarSign, FiGift, FiFileText,
  FiEye, FiArrowRight, FiArrowLeft, FiPlus, FiGrid, FiMail, FiDownload,
} from 'react-icons/fi';

const WIZARD_STEPS = ['Candidate', 'Compensation', 'Benefits', 'Terms', 'Preview', 'Success'];

export default function OfferCreate() {
  const navigate = useNavigate();
  const { generateOffer, templates } = useOffers();
  const { employees } = useEmployees();

  const [currentStep, setCurrentStep] = useState(1);
  const [createdOffer, setCreatedOffer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    candidateName: 'Siddharth Rao',
    candidateEmail: 'siddharth.rao@gmail.com',
    candidatePhone: '+91 98765 11223',
    department: 'Engineering',
    designation: 'Senior Frontend Developer',
    manager: 'Vikram Joshi (MGR-001)',
    employmentType: 'Full-Time',
    joiningDate: '2026-08-15',
    workLocation: 'Hybrid',
    officeAddress: 'Building B, Embassy TechVillage, Outer Ring Rd, Bengaluru, KA 560103',
    probationPeriod: '90 Days',
    noticePeriod: '60 Days',
    workingHours: '9:30 AM - 6:30 PM (Mon-Fri)',
    validUntilDate: '2026-08-05',
    compensation: {
      basicSalary: 900000,
      hra: 360000,
      specialAllowance: 240000,
      medicalAllowance: 30000,
      travelAllowance: 50000,
      bonus: 100000,
      variablePay: 60000,
      employerPf: 108000,
      employeePf: 108000,
      gratuity: 43269,
      insurance: 25000,
    },
    benefits: ['Health Insurance', 'Accidental Insurance', 'Paid Leave', 'Sick Leave', 'WFH Eligibility', 'Laptop'],
    remarks: 'Standard senior band compensation package.',
  });

  const computedComp = calculateCompensation(formData.compensation);

  const handleApplyTemplate = (tpl) => {
    setFormData((prev) => ({
      ...prev,
      employmentType: tpl.defaults.employmentType,
      probationPeriod: tpl.defaults.probationPeriod,
      noticePeriod: tpl.defaults.noticePeriod,
      workingHours: tpl.defaults.workingHours,
      workLocation: tpl.defaults.workLocation,
      benefits: tpl.defaults.benefits,
    }));
  };

  const handleSubmitOffer = async () => {
    const created = await generateOffer({
      ...formData,
      compensation: computedComp,
    });
    setCreatedOffer(created);
    setCurrentStep(6);
  };

  const handleBenefitToggle = (b) => {
    setFormData((prev) => {
      const exists = prev.benefits.includes(b);
      return {
        ...prev,
        benefits: exists ? prev.benefits.filter((item) => item !== b) : [...prev.benefits, b],
      };
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={createdOffer ? 'Offer Packet Generated' : 'Generate Offer Packet'}
        breadcrumbs={
          createdOffer
            ? [
                { label: 'Offers', path: '/offers' },
                { label: 'Generate Offer', path: '/offers/create' },
                { label: 'Success', path: '#' },
              ]
            : [
                { label: 'Offers', path: '/offers' },
                { label: 'Generate Offer', path: '/offers/create' },
              ]
        }
      />

      {/* Progress Header */}
      {!createdOffer && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {WIZARD_STEPS.slice(0, 5).map((stepName, idx) => {
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
      )}

      {/* Step Contents */}
      {!createdOffer ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Preset Template Selector Strip */}
          {currentStep === 1 && (
            <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 space-y-2 text-xs">
              <span className="font-bold text-violet-700 dark:text-violet-300 block">Apply Offer Preset Template:</span>
              <div className="flex flex-wrap gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 hover:border-violet-500 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Candidate Details */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                Step 1: Candidate & Role Selection
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.candidateEmail}
                    onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={formData.candidatePhone}
                    onChange={(e) => setFormData({ ...formData, candidatePhone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Department *</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Designation *</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Joining Date *</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Compensation Calculator */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                Step 2: Compensation Calculator & Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Annual Basic Salary (₹) *</label>
                  <input
                    type="number"
                    value={formData.compensation.basicSalary}
                    onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, basicSalary: e.target.value } })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Annual HRA (₹)</label>
                  <input
                    type="number"
                    value={formData.compensation.hra}
                    onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, hra: e.target.value } })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Special Allowance (₹)</label>
                  <input
                    type="number"
                    value={formData.compensation.specialAllowance}
                    onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, specialAllowance: e.target.value } })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Calculated Summary Widget */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                <div><span className="text-slate-400">Monthly Gross</span><p className="font-bold text-slate-900 dark:text-white">{formatCurrency(computedComp.monthlyGross)}</p></div>
                <div><span className="text-slate-400">Annual Base</span><p className="font-bold text-slate-900 dark:text-white">{formatCurrency(computedComp.annualBase)}</p></div>
                <div><span className="text-slate-400">Calculated Annual CTC</span><p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(computedComp.totalCTC)}</p></div>
              </div>
            </div>
          )}

          {/* STEP 3: Benefits Selection */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                Step 3: Perks & Company Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {['Health Insurance', 'Accidental Insurance', 'Life Insurance', 'Paid Leave', 'Sick Leave', 'WFH Eligibility', 'Laptop', 'Mobile Reimbursement', 'Food Allowance', 'Transportation'].map((b) => {
                  const checked = formData.benefits.includes(b);
                  return (
                    <label
                      key={b}
                      onClick={() => handleBenefitToggle(b)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        checked ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-300 dark:border-violet-700 font-bold text-violet-700 dark:text-violet-300' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{b}</span>
                      <input type="checkbox" checked={checked} readOnly className="rounded text-violet-600" />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Terms & Offer Details */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                Step 4: Offer Validity & Employment Terms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Offer Valid Until *</label>
                  <input
                    type="date"
                    value={formData.validUntilDate}
                    onChange={(e) => setFormData({ ...formData, validUntilDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Probation Period</label>
                  <input
                    type="text"
                    value={formData.probationPeriod}
                    onChange={(e) => setFormData({ ...formData, probationPeriod: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Notice Period</label>
                  <input
                    type="text"
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: A4 Offer Packet Preview */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                Step 5: Review A4 Printable Offer Packet
              </h3>
              <OfferPreview offer={{ ...formData, id: 'OFF-2026-PREVIEW', generatedDate: new Date().toISOString().split('T')[0], compensation: computedComp }} />
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold disabled:opacity-40"
            >
              <FiArrowLeft size={14} /> Back
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 5))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm"
              >
                Next Step <FiArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitOffer}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                <FiCheckCircle size={15} /> Confirm & Generate Offer Packet
              </button>
            )}
          </div>
        </div>
      ) : (
        /* STEP 6: Post-Generation Success View */
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-md">
              <FiCheckCircle size={36} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Offer Packet Successfully Generated!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              The official offer packet has been created and logged into approval workflows and dashboard metrics.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">{createdOffer.candidateName}</p>
                <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold">{createdOffer.designation}</p>
              </div>
              <span className="font-mono font-bold text-xs bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-lg border border-violet-200 dark:border-violet-800">
                {createdOffer.id}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="text-slate-400">Department:</span> <strong>{createdOffer.department}</strong></p>
              <p><span className="text-slate-400">Joining Date:</span> <strong>{formatDateDDMMYYYY(createdOffer.joiningDate)}</strong></p>
              <p><span className="text-slate-400">Annual CTC:</span> <strong className="text-emerald-600">{formatCurrency(createdOffer.compensation?.totalCTC)}</strong></p>
              <p><span className="text-slate-400">Offer Valid Until:</span> <strong>{formatDateDDMMYYYY(createdOffer.validUntilDate)}</strong></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <button onClick={() => navigate(`/offers/${createdOffer.id}`)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold">
              <FiUser size={15} /> View Offer Details
            </button>
            <button onClick={() => alert(`Downloading PDF for ${createdOffer.id}...`)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold">
              <FiDownload size={15} /> Download PDF Packet
            </button>
            <button onClick={() => setCreatedOffer(null)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold">
              <FiPlus size={15} /> Generate Another Offer
            </button>
            <button onClick={() => navigate('/offers')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold">
              <FiGrid size={15} /> Return to Offers Roster
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
