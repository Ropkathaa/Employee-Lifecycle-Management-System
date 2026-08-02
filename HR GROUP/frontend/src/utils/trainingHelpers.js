/**
 * utils/trainingHelpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable domain utilities for Mandatory Training & Monitoring System:
 * Compliance calculation, progress tracking, remaining days calculator,
 * ID generators, and AI/SCORM extension hooks.
 */

/**
 * Generates next sequential Training Program ID (e.g. TRN-2026-0005).
 */
export function generateTrainingId(existingPrograms = []) {
  const currentYear = new Date().getFullYear();
  const maxNum = existingPrograms.reduce((max, p) => {
    const parts = (p.id || '').split('-');
    const num = parseInt(parts[parts.length - 1], 10);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  const nextNum = String(maxNum + 1).padStart(4, '0');
  return `TRN-${currentYear}-${nextNum}`;
}

/**
 * Generates unique Certificate Number (e.g. CERT-POSH-2026-4921).
 */
export function generateCertificateNumber(category = 'GEN') {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  const code = (category || 'GEN').substring(0, 4).toUpperCase();
  return `CERT-${code}-${year}-${rand}`;
}

/**
 * Calculates overall training completion percentage for a list of assignments.
 */
export function calculateCompletionPercentage(assignments = []) {
  if (!Array.isArray(assignments) || assignments.length === 0) return 0;
  const completed = assignments.filter((a) => a.status === 'Completed').length;
  return Math.round((completed / assignments.length) * 100);
}

/**
 * Calculates organization & department compliance metrics.
 */
export function calculateCompliance(programs = [], assignments = []) {
  const mandatoryPrograms = programs.filter((p) => p.isMandatory);
  const mandatoryIds = new Set(mandatoryPrograms.map((p) => p.id));

  const mandatoryAssignments = assignments.filter((a) => mandatoryIds.has(a.trainingId));

  if (mandatoryAssignments.length === 0) return { complianceRate: 100, pendingCount: 0, overdueCount: 0 };

  const completed = mandatoryAssignments.filter((a) => a.status === 'Completed').length;
  const overdue = mandatoryAssignments.filter((a) => {
    if (a.status === 'Completed') return false;
    if (!a.dueDate) return false;
    return new Date(a.dueDate) < new Date();
  }).length;

  const complianceRate = Math.round((completed / mandatoryAssignments.length) * 100);

  return {
    complianceRate,
    completedCount: completed,
    totalMandatoryCount: mandatoryAssignments.length,
    overdueCount: overdue,
    pendingCount: mandatoryAssignments.length - completed,
  };
}

/**
 * Computes summary count statistics across training domain.
 */
export function calculateTrainingStats(programs = [], assignments = [], certificates = []) {
  const compliance = calculateCompliance(programs, assignments);

  const active = programs.filter((p) => p.status === 'Published').length;
  const completedAssignments = assignments.filter((a) => a.status === 'Completed').length;
  const pendingAssignments = assignments.filter((a) => a.status === 'In Progress' || a.status === 'Assigned').length;
  const overdueAssignments = assignments.filter((a) => {
    if (a.status === 'Completed') return false;
    return a.dueDate && new Date(a.dueDate) < new Date();
  }).length;

  return {
    totalPrograms: programs.length,
    activeTrainings: active,
    completedTrainings: completedAssignments,
    pendingTrainings: pendingAssignments,
    overdueTrainings: overdueAssignments,
    compliancePercentage: compliance.complianceRate,
    certificatesIssued: certificates.length,
  };
}

/**
 * Calculates remaining days until deadline.
 */
export function calculateRemainingDays(dueDate) {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/* ─────────────────────────────────────────────────────────────────────────────
 * AI READINESS & SCORM/LEARNING EXTENSION HOOKS (Prepared for future modules)
 * ───────────────────────────────────────────────────────────────────────────── */

export function aiRecommendedTrainingHook(employeeRole, skillsList = []) {
  return { recommendedCategory: 'Technical', matchConfidence: 94 };
}

export function skillGapAnalysisHook(employeeId) {
  return { gapsIdentified: ['Cybersecurity Awareness', 'POSH Refresh'], urgency: 'High' };
}

export function aiCompliancePredictionHook(department) {
  return { predictedComplianceRisk: 'Low', targetDeadlineStatus: 'On Track' };
}

export function scormPackageHook(packageUrl) {
  return { scormVersion: '2004 4th Edition', manifestParsed: true };
}

export function quizEngineHook(trainingId) {
  return { totalQuestions: 10, passingScore: 80 };
}
