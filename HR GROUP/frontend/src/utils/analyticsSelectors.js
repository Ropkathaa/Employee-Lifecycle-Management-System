/**
 * utils/analyticsSelectors.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure selector functions for aggregating live data from all HR modules:
 * Employee Roster, Documents, Offers, Salary, and Mandatory Training.
 */

import { calculateComplianceScore, calculateOfferAcceptanceRate } from './analyticsHelpers';
import { formatCurrency } from './salaryHelpers';

/**
 * Aggregates master executive KPI metrics across all modules.
 */
export function selectExecutiveKPIs(data = {}) {
  const employees = data.employees || [];
  const documents = data.documents || [];
  const offers = data.offers || [];
  const salaryRecords = data.salaryRecords || [];
  const programs = data.programs || [];
  const assignments = data.assignments || [];

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Active' || e.status === 'Probation').length;
  const newJoinees = employees.filter((e) => {
    if (!e.joiningDate) return false;
    const joinDate = new Date(e.joiningDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate >= thirtyDaysAgo;
  }).length;

  const pendingDocs = documents.filter((d) => d.verificationStatus === 'Pending' || d.verificationStatus === 'Under Review').length;
  const verifiedDocs = documents.filter((d) => d.verificationStatus === 'Verified').length;
  const docComplianceRate = documents.length > 0 ? Math.round((verifiedDocs / documents.length) * 100) : 100;

  const completedTraining = assignments.filter((a) => a.status === 'Completed').length;
  const trainingComplianceRate = assignments.length > 0 ? Math.round((completedTraining / assignments.length) * 100) : 100;

  const overallComplianceScore = calculateComplianceScore(docComplianceRate, trainingComplianceRate);
  const offerAcceptanceRate = calculateOfferAcceptanceRate(offers);

  let totalCTC = 0;
  let monthlyPayroll = 0;
  salaryRecords.forEach((s) => {
    totalCTC += s.calculatedTotals?.totalAnnualCTC || 0;
    monthlyPayroll += s.calculatedTotals?.monthlyGross || 0;
  });
  const avgCTC = salaryRecords.length > 0 ? Math.round(totalCTC / salaryRecords.length) : 0;

  return {
    totalEmployees,
    activeEmployees,
    newJoinees,
    upcomingJoinings: offers.filter((o) => o.status === 'Accepted' || o.status === 'Approved').length,
    pendingDocuments: pendingDocs,
    docComplianceRate,
    trainingComplianceRate,
    overallComplianceScore,
    offerAcceptanceRate,
    avgCTC,
    avgCTCFormatted: formatCurrency(avgCTC),
    monthlyPayrollEstimate: monthlyPayroll,
    monthlyPayrollFormatted: formatCurrency(monthlyPayroll),
    activeOffersCount: offers.filter((o) => o.status === 'Sent' || o.status === 'Pending Approval').length,
  };
}

/**
 * Computes aggregated department breakdown combining headcount, CTC, and compliance.
 */
export function selectDepartmentAnalytics(data = {}) {
  const employees = data.employees || [];
  const salaryRecords = data.salaryRecords || [];
  const assignments = data.assignments || [];

  const deptMap = {};

  employees.forEach((e) => {
    const dept = e.department || 'General';
    if (!deptMap[dept]) {
      deptMap[dept] = { department: dept, headcount: 0, totalCTC: 0, completedTrainings: 0, totalTrainings: 0 };
    }
    deptMap[dept].headcount += 1;
  });

  salaryRecords.forEach((s) => {
    const dept = s.department || 'General';
    if (!deptMap[dept]) {
      deptMap[dept] = { department: dept, headcount: 0, totalCTC: 0, completedTrainings: 0, totalTrainings: 0 };
    }
    deptMap[dept].totalCTC += s.calculatedTotals?.totalAnnualCTC || 0;
  });

  assignments.forEach((a) => {
    const dept = a.department || 'General';
    if (!deptMap[dept]) {
      deptMap[dept] = { department: dept, headcount: 0, totalCTC: 0, completedTrainings: 0, totalTrainings: 0 };
    }
    deptMap[dept].totalTrainings += 1;
    if (a.status === 'Completed') deptMap[dept].completedTrainings += 1;
  });

  return Object.values(deptMap).map((d) => ({
    department: d.department,
    headcount: d.headcount,
    totalCTC: d.totalCTC,
    avgCTC: d.headcount > 0 ? Math.round(d.totalCTC / d.headcount) : 0,
    trainingCompliance: d.totalTrainings > 0 ? Math.round((d.completedTrainings / d.totalTrainings) * 100) : 100,
  }));
}
