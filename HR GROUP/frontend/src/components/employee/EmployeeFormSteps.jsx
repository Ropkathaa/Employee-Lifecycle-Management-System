import React from 'react';
import Input from '../Input';
import Select from '../Select';
import DocumentUploader from './DocumentUploader';
import DepartmentBadge from './DepartmentBadge';
import { DEPARTMENTS, EMPLOYMENT_TYPES, WORK_LOCATIONS, GENDERS, MANAGERS } from '../../mock/employees';
import {
  getMinimumDOB,
  getMaximumDOB,
  getMinimumJoiningDate,
  getMaximumJoiningDate,
  isValidDOB,
  isValidJoiningDate,
  formatDateDDMMYYYY,
} from '../../utils/dateValidation';

/** Step 1: Personal Information Form */
export function StepPersonal({ formData, onChange }) {
  const dobResult = isValidDOB(formData.dateOfBirth);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
        Step 1: Personal Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          placeholder="e.g. Arjun"
          required
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          placeholder="e.g. Mehta"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Gender"
          value={formData.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          options={GENDERS.map((g) => ({ label: g, value: g }))}
          required
        />
        <div>
          <Input
            label="Date of Birth (DD-MM-YYYY)"
            type="date"
            min={getMinimumDOB()}
            max={getMaximumDOB()}
            value={formData.dateOfBirth}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
            error={formData.dateOfBirth && !dobResult.valid ? dobResult.error : null}
            required
            aria-label="Date of Birth"
          />
          {formData.dateOfBirth && dobResult.valid && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              Formatted: {formatDateDDMMYYYY(formData.dateOfBirth)} (Valid HR Age)
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="e.g. arjun.mehta@company.com"
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="e.g. +91 98765 43210"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Street Address"
          value={formData.address?.street || ''}
          onChange={(e) => onChange('address', { ...formData.address, street: e.target.value })}
          placeholder="e.g. 42 Tech Park Avenue"
        />
        <Input
          label="City"
          value={formData.address?.city || ''}
          onChange={(e) => onChange('address', { ...formData.address, city: e.target.value })}
          placeholder="e.g. Bengaluru"
        />
        <Input
          label="State"
          value={formData.address?.state || ''}
          onChange={(e) => onChange('address', { ...formData.address, state: e.target.value })}
          placeholder="e.g. Karnataka"
        />
      </div>
    </div>
  );
}

/** Step 2: Employment Information Form */
export function StepEmployment({ formData, onChange, idPreview }) {
  const joiningResult = isValidJoiningDate(formData.dateOfJoining);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Step 2: Employment Details
        </h3>
        <span className="text-xs font-mono font-bold bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded border border-violet-200 dark:border-violet-800">
          Preview ID: {idPreview}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Department"
          value={formData.department}
          onChange={(e) => onChange('department', e.target.value)}
          options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
          required
        />
        <Input
          label="Designation"
          value={formData.designation}
          onChange={(e) => onChange('designation', e.target.value)}
          placeholder="e.g. Senior Frontend Developer"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Reporting Manager"
          value={formData.manager}
          onChange={(e) => onChange('manager', e.target.value)}
          options={MANAGERS.map((m) => ({ label: `${m.name} (${m.designation})`, value: `${m.name} (${m.id})` }))}
        />
        <Select
          label="Employment Type"
          value={formData.employmentType}
          onChange={(e) => onChange('employmentType', e.target.value)}
          options={EMPLOYMENT_TYPES.map((t) => ({ label: t, value: t }))}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="Date of Joining (DD-MM-YYYY)"
            type="date"
            min={getMinimumJoiningDate()}
            max={getMaximumJoiningDate()}
            value={formData.dateOfJoining}
            onChange={(e) => onChange('dateOfJoining', e.target.value)}
            error={formData.dateOfJoining && !joiningResult.valid ? joiningResult.error : null}
            required
            aria-label="Date of Joining"
          />
          {formData.dateOfJoining && joiningResult.valid && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              Formatted: {formatDateDDMMYYYY(formData.dateOfJoining)}
            </p>
          )}
        </div>
        <Select
          label="Work Location"
          value={formData.workLocation}
          onChange={(e) => onChange('workLocation', e.target.value)}
          options={WORK_LOCATIONS.map((w) => ({ label: w, value: w }))}
        />
      </div>
    </div>
  );
}

/** Step 3: Salary Information Form */
export function StepSalary({ formData, onChange }) {
  const basic = parseFloat(formData.salaryPackage?.basicSalary) || 0;
  const allowances = parseFloat(formData.salaryPackage?.allowances) || 0;
  const pf = formData.salaryPackage?.pfEligibility ? basic * 0.12 : 0;
  const totalCTC = basic + allowances;

  const handleSalaryChange = (field, val) => {
    onChange('salaryPackage', {
      ...formData.salaryPackage,
      [field]: val,
      pfContribution: field === 'basicSalary' || field === 'pfEligibility'
        ? (formData.salaryPackage?.pfEligibility ? (parseFloat(field === 'basicSalary' ? val : basic) * 0.12) : 0)
        : pf,
      totalCTC: (parseFloat(field === 'basicSalary' ? val : basic) || 0) + (parseFloat(field === 'allowances' ? val : allowances) || 0),
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
        Step 3: Salary & Bank Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Basic Salary (₹)"
          type="number"
          value={formData.salaryPackage?.basicSalary || ''}
          onChange={(e) => handleSalaryChange('basicSalary', e.target.value)}
          placeholder="e.g. 900000"
          required
        />
        <Input
          label="Allowances (₹)"
          type="number"
          value={formData.salaryPackage?.allowances || ''}
          onChange={(e) => handleSalaryChange('allowances', e.target.value)}
          placeholder="e.g. 432000"
        />
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Provident Fund (PF) Eligibility
          </label>
          <p className="text-[11px] text-slate-400">12% contribution computed on Basic Salary</p>
        </div>
        <input
          type="checkbox"
          checked={Boolean(formData.salaryPackage?.pfEligibility)}
          onChange={(e) => handleSalaryChange('pfEligibility', e.target.checked)}
          className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-xs">
        <div>
          <span className="text-slate-500">Calculated PF</span>
          <p className="font-bold text-violet-600 dark:text-violet-400">₹{pf.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <span className="text-slate-500">Allowances</span>
          <p className="font-semibold text-slate-800 dark:text-slate-200">₹{allowances.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <span className="text-slate-500">Total CTC</span>
          <p className="font-bold text-slate-900 dark:text-white">₹{totalCTC.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Input
          label="Bank Name"
          value={formData.salaryPackage?.bankName || ''}
          onChange={(e) => handleSalaryChange('bankName', e.target.value)}
          placeholder="e.g. HDFC Bank"
        />
        <Input
          label="Account Number"
          value={formData.salaryPackage?.accountNumber || ''}
          onChange={(e) => handleSalaryChange('accountNumber', e.target.value)}
          placeholder="e.g. 50100234567891"
        />
        <Input
          label="IFSC Code"
          value={formData.salaryPackage?.ifscCode || ''}
          onChange={(e) => handleSalaryChange('ifscCode', e.target.value)}
          placeholder="e.g. HDFC0001234"
        />
      </div>
    </div>
  );
}

/** Step 4: Documents Upload Form */
export function StepDocuments({ formData, onAddDocument, onRemoveDocument }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
        Step 4: Upload Verification Documents
      </h3>
      <DocumentUploader
        documents={formData.documents || []}
        onAddDocument={onAddDocument}
        onRemoveDocument={onRemoveDocument}
      />
    </div>
  );
}

/** Step 5: Final Review Panel */
export function StepReview({ formData, onGoToStep }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center justify-between">
        <span>Step 5: Final Review & Confirmation</span>
        <span className="text-xs font-normal text-slate-400">Review all details before submission</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Personal Review Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-1.5">
            <strong className="text-slate-800 dark:text-slate-200">Personal Details</strong>
            <button onClick={() => onGoToStep(1)} className="text-violet-600 font-semibold hover:underline">Edit</button>
          </div>
          <p><span className="text-slate-400">Name:</span> {formData.firstName} {formData.lastName}</p>
          <p><span className="text-slate-400">Email:</span> {formData.email}</p>
          <p><span className="text-slate-400">Phone:</span> {formData.phone}</p>
          <p><span className="text-slate-400">Gender / DOB:</span> {formData.gender} · {formatDateDDMMYYYY(formData.dateOfBirth)}</p>
        </div>

        {/* Employment Review Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-1.5">
            <strong className="text-slate-800 dark:text-slate-200">Employment Details</strong>
            <button onClick={() => onGoToStep(2)} className="text-violet-600 font-semibold hover:underline">Edit</button>
          </div>
          <p><span className="text-slate-400">Department:</span> <DepartmentBadge department={formData.department} /></p>
          <p><span className="text-slate-400">Designation:</span> {formData.designation}</p>
          <p><span className="text-slate-400">Type / Location:</span> {formData.employmentType} · {formData.workLocation}</p>
          <p><span className="text-slate-400">Joining Date:</span> {formatDateDDMMYYYY(formData.dateOfJoining)}</p>
        </div>
      </div>

      {/* Salary & Documents Review */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-1.5">
            <strong className="text-slate-800 dark:text-slate-200">Salary Summary</strong>
            <button onClick={() => onGoToStep(3)} className="text-violet-600 font-semibold hover:underline">Edit</button>
          </div>
          <p><span className="text-slate-400">Basic Salary:</span> ₹{Number(formData.salaryPackage?.basicSalary || 0).toLocaleString('en-IN')}</p>
          <p><span className="text-slate-400">PF Contribution:</span> ₹{Number(formData.salaryPackage?.pfContribution || 0).toLocaleString('en-IN')}</p>
          <p><span className="text-slate-400">Total CTC:</span> ₹{Number(formData.salaryPackage?.totalCTC || 0).toLocaleString('en-IN')}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-1.5">
            <strong className="text-slate-800 dark:text-slate-200">Documents Attached</strong>
            <button onClick={() => onGoToStep(4)} className="text-violet-600 font-semibold hover:underline">Edit</button>
          </div>
          {formData.documents?.length ? (
            formData.documents.map((d) => <p key={d.id} className="truncate">✓ {d.type} ({d.name})</p>)
          ) : (
            <p className="text-slate-400">No documents attached yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
