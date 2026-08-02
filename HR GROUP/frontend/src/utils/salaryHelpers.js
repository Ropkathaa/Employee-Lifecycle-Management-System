/**
 * utils/salaryHelpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable domain utilities for Salary Summary & Provident Fund (PF) Management:
 * Breakdown math, PF contribution calculation, department analytics,
 * side-by-side revision comparison diff engine, and AI readiness hooks.
 */

import { PAYROLL_CONFIG } from '../config/payrollConstants';

/**
 * Calculates complete earnings, deductions, PF, and annual CTC breakdown.
 * @param {Object} input
 * @returns {Object} Complete calculated breakdown
 */
export function calculateSalaryBreakdown(input = {}) {
  const earningsInput = input.earnings || {};
  const basic = parseFloat(earningsInput.basicSalary) || 0;
  const hra = parseFloat(earningsInput.hra) || (basic * 0.4);
  const special = parseFloat(earningsInput.specialAllowance) || 0;
  const medical = parseFloat(earningsInput.medicalAllowance) || 0;
  const travel = parseFloat(earningsInput.travelAllowance) || 0;
  const bonus = parseFloat(earningsInput.bonus) || 0;
  const otherAllowances = parseFloat(earningsInput.otherAllowances) || 0;

  // Calculated Earnings
  const annualBase = basic + hra + special + medical + travel + otherAllowances;
  const monthlyGross = Math.round(annualBase / 12);

  // Calculated Deductions
  const employeePf = Math.round(basic * PAYROLL_CONFIG.EMPLOYEE_PF_RATE);
  const professionalTax = PAYROLL_CONFIG.PROFESSIONAL_TAX_MONTHLY * 12;
  const incomeTax = Math.round(annualBase * PAYROLL_CONFIG.MOCK_INCOME_TAX_RATE);
  const otherDeductions = parseFloat(input.deductions?.otherDeductions) || 0;
  const annualDeductions = employeePf + professionalTax + incomeTax + otherDeductions;
  const monthlyDeductions = Math.round(annualDeductions / 12);

  // Employer Contributions
  const employerPf = Math.round(basic * PAYROLL_CONFIG.EMPLOYER_PF_RATE);
  const insurance = parseFloat(input.employerContributions?.insurance) || PAYROLL_CONFIG.INSURANCE_ANNUAL_DEFAULT;
  const annualEmployerContrib = employerPf + insurance;

  // Calculated Totals
  const monthlyNet = Math.max(0, monthlyGross - monthlyDeductions);
  const totalAnnualCTC = Math.round(annualBase + bonus + annualEmployerContrib);
  const totalPfContribution = employeePf + employerPf;

  return {
    earnings: { basicSalary: basic, hra, specialAllowance: special, medicalAllowance: medical, travelAllowance: travel, bonus, otherAllowances },
    deductions: { employeePf, professionalTax, incomeTax, otherDeductions },
    employerContributions: { employerPf, insurance },
    calculatedTotals: {
      monthlyGross,
      monthlyDeductions,
      monthlyNet,
      annualBase,
      totalAnnualCTC,
      annualEmployeePf: employeePf,
      annualEmployerPf: employerPf,
      totalPfContribution,
    },
  };
}

/**
 * Formats currency in INR format (e.g. ₹18,33,000).
 */
export function formatCurrency(amount = 0) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Computes summary count statistics across salary records repository.
 */
export function calculateSalaryStats(records = []) {
  if (!Array.isArray(records) || records.length === 0) {
    return {
      totalEmployees: 0,
      avgCTC: 0,
      highestCTC: 0,
      lowestCTC: 0,
      monthlyPayrollEstimate: 0,
      totalEmployerPF: 0,
      totalEmployeePF: 0,
    };
  }

  let totalCTC = 0;
  let highestCTC = 0;
  let lowestCTC = Infinity;
  let monthlyPayrollEstimate = 0;
  let totalEmployerPF = 0;
  let totalEmployeePF = 0;

  records.forEach((rec) => {
    const ctc = rec.calculatedTotals?.totalAnnualCTC || 0;
    const gross = rec.calculatedTotals?.monthlyGross || 0;
    const empPf = rec.calculatedTotals?.annualEmployeePf || 0;
    const emprPf = rec.calculatedTotals?.annualEmployerPf || 0;

    totalCTC += ctc;
    monthlyPayrollEstimate += gross;
    totalEmployeePF += empPf;
    totalEmployerPF += emprPf;

    if (ctc > highestCTC) highestCTC = ctc;
    if (ctc < lowestCTC) lowestCTC = ctc;
  });

  const avgCTC = Math.round(totalCTC / records.length);
  if (lowestCTC === Infinity) lowestCTC = 0;

  return {
    totalEmployees: records.length,
    avgCTC,
    highestCTC,
    lowestCTC,
    monthlyPayrollEstimate,
    totalEmployerPF,
    totalEmployeePF,
  };
}

/**
 * Computes department-wise salary analytics breakdown.
 */
export function calculateDepartmentSalaryAnalytics(records = []) {
  if (!Array.isArray(records)) return [];

  const deptMap = {};

  records.forEach((rec) => {
    const dept = rec.department || 'Other';
    const ctc = rec.calculatedTotals?.totalAnnualCTC || 0;

    if (!deptMap[dept]) {
      deptMap[dept] = { department: dept, totalCTC: 0, count: 0 };
    }
    deptMap[dept].totalCTC += ctc;
    deptMap[dept].count += 1;
  });

  return Object.values(deptMap).map((d) => ({
    department: d.department,
    count: d.count,
    totalCTC: d.totalCTC,
    avgCTC: Math.round(d.totalCTC / d.count),
  }));
}

/**
 * Compares two salary revision objects side-by-side and extracts diff items.
 */
export function compareSalaryRevisions(revA = {}, revB = {}) {
  const calcA = revA.calculatedTotals || revA;
  const calcB = revB.calculatedTotals || revB;

  const fields = [
    { field: 'totalAnnualCTC', label: 'Total Annual CTC', valA: formatCurrency(calcA.totalAnnualCTC), valB: formatCurrency(calcB.totalAnnualCTC), rawA: calcA.totalAnnualCTC, rawB: calcB.totalAnnualCTC },
    { field: 'monthlyGross', label: 'Monthly Gross Salary', valA: formatCurrency(calcA.monthlyGross), valB: formatCurrency(calcB.monthlyGross), rawA: calcA.monthlyGross, rawB: calcB.monthlyGross },
    { field: 'monthlyNet', label: 'Monthly Net Take-Home', valA: formatCurrency(calcA.monthlyNet), valB: formatCurrency(calcB.monthlyNet), rawA: calcA.monthlyNet, rawB: calcB.monthlyNet },
    { field: 'basicSalary', label: 'Annual Basic Salary', valA: formatCurrency(revA.earnings?.basicSalary), valB: formatCurrency(revB.earnings?.basicSalary), rawA: revA.earnings?.basicSalary, rawB: revB.earnings?.basicSalary },
    { field: 'annualEmployerPf', label: 'Annual Employer PF', valA: formatCurrency(calcA.annualEmployerPf), valB: formatCurrency(calcB.annualEmployerPf), rawA: calcA.annualEmployerPf, rawB: calcB.annualEmployerPf },
  ];

  return fields.map((item) => ({
    ...item,
    isDifferent: item.rawA !== item.rawB,
  }));
}

/* ─────────────────────────────────────────────────────────────────────────────
 * AI READINESS & PAYROLL EXTENSION HOOKS (Prepared for future modules)
 * ───────────────────────────────────────────────────────────────────────────── */

export function payrollProcessingHook(records) {
  return { status: 'Ready for Monthly Processing', recordsCount: records.length };
}

export function payslipGenerationHook(employeeId, monthYear) {
  return { template: 'Standard Payslip 2026', employeeId, monthYear };
}

export function taxCalculatorHook(grossSalary) {
  return { estimatedTaxBracket: '10%', recommendedTaxSaveInvestment: 150000 };
}

export function aiSalaryBenchmarkHook(designation, currentCTC) {
  return { marketAvg: currentCTC * 1.08, percentile: 80, recommendation: 'Competitive' };
}
