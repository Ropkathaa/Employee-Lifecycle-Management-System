/**
 * utils/analyticsHelpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable domain utilities for Executive HR Analytics & Report Generation:
 * Growth math, compliance scoring, offer acceptance rates, department distribution,
 * and AI forecasting readiness hooks.
 */

/**
 * Calculates percentage growth rate between current and previous periods.
 */
export function calculateGrowthRate(current = 0, previous = 0) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

/**
 * Calculates overall organizational compliance score (0-100%).
 */
export function calculateComplianceScore(docComplianceRate = 100, trainingComplianceRate = 100) {
  const score = Math.round(docComplianceRate * 0.4 + trainingComplianceRate * 0.6);
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculates offer acceptance rate percentage.
 */
export function calculateOfferAcceptanceRate(offers = []) {
  if (!Array.isArray(offers) || offers.length === 0) return 0;
  const accepted = offers.filter((o) => o.status === 'Accepted').length;
  return Math.round((accepted / offers.length) * 100);
}

/**
 * Computes headcount and percentage distribution by department.
 */
export function calculateDepartmentDistribution(employees = []) {
  if (!Array.isArray(employees)) return [];

  const counts = {};
  employees.forEach((e) => {
    const dept = e.department || 'Other';
    counts[dept] = (counts[dept] || 0) + 1;
  });

  const total = employees.length || 1;
  return Object.entries(counts).map(([department, count]) => ({
    department,
    count,
    percentage: Math.round((count / total) * 100),
  }));
}

/* ─────────────────────────────────────────────────────────────────────────────
 * AI READINESS & WORKFORCE FORECASTING HOOKS (Prepared for future modules)
 * ───────────────────────────────────────────────────────────────────────────── */

export function aiWorkforceForecastingHook(historicalHeadcount = []) {
  return { projectedGrowthNextQuarter: '+12.5%', confidence: 'High' };
}

export function attritionPredictionHook(employees = []) {
  return { highRiskCount: 1, departmentAtRisk: 'Engineering', primaryFactor: 'Comp Alignment' };
}

export function hiringRecommendationsHook(openOffers = []) {
  return { recommendedOpenReqs: 3, topPriorityDept: 'Product' };
}

export function aiReportGenerationHook(queryPrompt) {
  return { generatedReportId: 'REP-AI-001', prompt: queryPrompt, status: 'Success' };
}
