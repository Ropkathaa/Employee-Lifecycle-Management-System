/**
 * mock/salary.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Initial seed salary records matching employee dataset.
 * Pure seed data; NO CRUD logic, NO state.
 */

export const mockSalaryRecords = [
  {
    employeeId: 'EMP-2026-0014',
    employeeName: 'Arjun Mehta',
    department: 'Engineering',
    designation: 'Senior Frontend Developer',
    status: 'Active',
    version: 2,
    effectiveDate: '2026-07-01',
    earnings: {
      basicSalary: 900000,
      hra: 360000,
      specialAllowance: 240000,
      medicalAllowance: 30000,
      travelAllowance: 50000,
      bonus: 100000,
      otherAllowances: 20000,
    },
    deductions: {
      employeePf: 108000,
      professionalTax: 2400,
      incomeTax: 80000,
      otherDeductions: 0,
    },
    employerContributions: {
      employerPf: 108000,
      insurance: 25000,
    },
    calculatedTotals: {
      monthlyGross: 133333,
      monthlyDeductions: 15866,
      monthlyNet: 117467,
      annualBase: 1600000,
      totalAnnualCTC: 1833000,
      annualEmployeePf: 108000,
      annualEmployerPf: 108000,
      totalPfContribution: 216000,
    },
    revisions: [
      {
        version: 1,
        effectiveDate: '2025-07-15',
        revisedBy: 'Priya Sharma (HR)',
        reason: 'Initial joining salary package',
        earnings: { basicSalary: 800000, hra: 320000, specialAllowance: 200000, bonus: 80000 },
        totalAnnualCTC: 1580000,
      },
      {
        version: 2,
        effectiveDate: '2026-07-01',
        revisedBy: 'Admin User',
        reason: 'Annual appraisal & band promotion to Senior Frontend Developer',
        earnings: { basicSalary: 900000, hra: 360000, specialAllowance: 240000, bonus: 100000 },
        totalAnnualCTC: 1833000,
      },
    ],
    auditTrail: [
      { action: 'Salary Package Created', user: 'Priya Sharma (HR)', timestamp: '2025-07-15 10:00 AM', reason: 'Initial joining setup' },
      { action: 'Salary Revised (v2)', user: 'Admin User', timestamp: '2026-07-01 02:30 PM', reason: 'Annual Appraisal Hike' },
    ],
  },
  {
    employeeId: 'EMP-2026-0013',
    employeeName: 'Priya Sharma',
    department: 'Human Resources',
    designation: 'HR Business Partner',
    status: 'Active',
    version: 1,
    effectiveDate: '2026-07-10',
    earnings: {
      basicSalary: 720000,
      hra: 288000,
      specialAllowance: 192000,
      medicalAllowance: 24000,
      travelAllowance: 36000,
      bonus: 60000,
      otherAllowances: 10000,
    },
    deductions: {
      employeePf: 86400,
      professionalTax: 2400,
      incomeTax: 63000,
      otherDeductions: 0,
    },
    employerContributions: {
      employerPf: 86400,
      insurance: 20000,
    },
    calculatedTotals: {
      monthlyGross: 105833,
      monthlyDeductions: 12650,
      monthlyNet: 93183,
      annualBase: 1270000,
      totalAnnualCTC: 1436400,
      annualEmployeePf: 86400,
      annualEmployerPf: 86400,
      totalPfContribution: 172800,
    },
    revisions: [
      {
        version: 1,
        effectiveDate: '2026-07-10',
        revisedBy: 'Admin User',
        reason: 'Initial joining compensation setup',
        earnings: { basicSalary: 720000, hra: 288000, specialAllowance: 192000 },
        totalAnnualCTC: 1436400,
      },
    ],
    auditTrail: [
      { action: 'Salary Package Created', user: 'Admin User', timestamp: '2026-07-10 11:00 AM', reason: 'Initial setup' },
    ],
  },
  {
    employeeId: 'EMP-2026-0012',
    employeeName: 'Rahul Nair',
    department: 'Finance',
    designation: 'Financial Analyst',
    status: 'Active',
    version: 1,
    effectiveDate: '2026-07-08',
    earnings: {
      basicSalary: 650000,
      hra: 260000,
      specialAllowance: 180000,
      medicalAllowance: 24000,
      travelAllowance: 36000,
      bonus: 50000,
      otherAllowances: 10000,
    },
    deductions: {
      employeePf: 78000,
      professionalTax: 2400,
      incomeTax: 57500,
      otherDeductions: 0,
    },
    employerContributions: {
      employerPf: 78000,
      insurance: 20000,
    },
    calculatedTotals: {
      monthlyGross: 96666,
      monthlyDeductions: 11491,
      monthlyNet: 85175,
      annualBase: 1160000,
      totalAnnualCTC: 1308000,
      annualEmployeePf: 78000,
      annualEmployerPf: 78000,
      totalPfContribution: 156000,
    },
    revisions: [
      {
        version: 1,
        effectiveDate: '2026-07-08',
        revisedBy: 'Admin User',
        reason: 'Initial joining package',
        earnings: { basicSalary: 650000, hra: 260000, specialAllowance: 180000 },
        totalAnnualCTC: 1308000,
      },
    ],
    auditTrail: [
      { action: 'Salary Package Created', user: 'Admin User', timestamp: '2026-07-08 09:15 AM', reason: 'Initial setup' },
    ],
  },
];
