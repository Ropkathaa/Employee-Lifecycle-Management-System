import React, { useState } from 'react';
import { StepPersonal, StepEmployment, StepSalary, StepDocuments, StepReview } from './EmployeeFormSteps';
import { FiCheck, FiArrowRight, FiArrowLeft, FiSave } from 'react-icons/fi';
import { useEmployees } from '../../hooks/useEmployees';
import { isValidDOB, isValidJoiningDate } from '../../utils/dateValidation';

const STEP_TITLES = [
  'Personal Information',
  'Employment Details',
  'Salary & Bank',
  'Documents',
  'Final Review',
];

/**
 * Reusable Multi-Step Employee Form Wizard (used by Create & Edit Employee Pages).
 */
export default function EmployeeForm({
  initialData = {},
  onSubmit,
  isEdit = false,
}) {
  const { generateEmployeeId } = useEmployees();
  const [currentStep, setCurrentStep] = useState(1);
  const [idPreview] = useState(initialData.id || generateEmployeeId());
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    gender: initialData.gender || 'Male',
    dateOfBirth: initialData.dateOfBirth || '1995-01-01',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || { street: '', city: '', state: '', zipCode: '' },
    department: initialData.department || 'Engineering',
    designation: initialData.designation || 'Frontend Engineer',
    manager: initialData.manager || '',
    employmentType: initialData.employmentType || 'Full-Time',
    workLocation: initialData.workLocation || 'Hybrid',
    dateOfJoining: initialData.dateOfJoining || new Date().toISOString().split('T')[0],
    salaryPackage: initialData.salaryPackage || {
      basicSalary: 600000,
      allowances: 300000,
      pfEligibility: true,
      pfContribution: 72000,
      totalCTC: 900000,
      bankName: 'HDFC Bank',
      accountNumber: '',
      ifscCode: '',
    },
    documents: initialData.documents || [],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDocument = (doc) => {
    setFormData((prev) => ({ ...prev, documents: [...(prev.documents || []), doc] }));
  };

  const handleRemoveDocument = (docId) => {
    setFormData((prev) => ({ ...prev, documents: (prev.documents || []).filter((d) => d.id !== docId) }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) return false;
      const dobCheck = isValidDOB(formData.dateOfBirth);
      if (!dobCheck.valid) {
        alert(dobCheck.error);
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.department || !formData.designation) return false;
      const joiningCheck = isValidJoiningDate(formData.dateOfJoining);
      if (!joiningCheck.valid) {
        alert(joiningCheck.error);
        return false;
      }
      return true;
    }
    if (step === 3) return formData.salaryPackage?.basicSalary > 0;
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    const finalProfile = {
      ...formData,
      id: idPreview,
      name: `${formData.firstName} ${formData.lastName}`,
      status: initialData.status || 'Active',
      avatarInitials: `${formData.firstName[0] || 'E'}${formData.lastName[0] || 'M'}`,
      avatarColor: initialData.avatarColor || 'bg-violet-500',
    };
    onSubmit?.(finalProfile);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      {/* Progress Step Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <button
                key={title}
                type="button"
                onClick={() => isCompleted && setCurrentStep(stepNum)}
                className={`flex items-center gap-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-violet-600 dark:text-violet-400'
                    : isCompleted
                    ? 'text-slate-700 dark:text-slate-300 cursor-pointer'
                    : 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-violet-600 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? <FiCheck size={12} /> : stepNum}
                </span>
                <span className="hidden sm:inline">{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content Area */}
      <form onSubmit={handleSubmitForm} className="p-6">
        {currentStep === 1 && <StepPersonal formData={formData} onChange={handleChange} />}
        {currentStep === 2 && <StepEmployment formData={formData} onChange={handleChange} idPreview={idPreview} />}
        {currentStep === 3 && <StepSalary formData={formData} onChange={handleChange} />}
        {currentStep === 4 && (
          <StepDocuments
            formData={formData}
            onAddDocument={handleAddDocument}
            onRemoveDocument={handleRemoveDocument}
          />
        )}
        {currentStep === 5 && <StepReview formData={formData} onGoToStep={setCurrentStep} />}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 mt-6 pt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
          >
            <FiArrowLeft size={14} /> Back
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-all min-h-[44px]"
            >
              Next Step <FiArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all min-h-[44px]"
            >
              <FiSave size={15} /> {isEdit ? 'Update Profile' : 'Complete Profile Creation'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
