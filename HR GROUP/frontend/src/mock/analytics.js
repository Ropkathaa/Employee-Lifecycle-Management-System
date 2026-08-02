/**
 * mock/analytics.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Seed executive analytics data, benchmark KPIs, system health status, and insights.
 * Pure seed data; NO CRUD logic, NO state.
 */

export const mockSystemHealth = {
  status: 'Healthy & Operational',
  uptimePercentage: 99.98,
  apiLatencyMs: 42,
  databaseSyncStatus: 'Synchronized',
  lastBackupTime: '2026-07-29 03:00 AM',
};

export const mockKPIBenchmarks = {
  employeeGrowthPct: 14.2, // +14.2% vs previous period
  pendingDocsPctChange: -8.5, // -8.5% fewer pending docs
  offerAcceptancePct: 88.5, // 88.5% acceptance
  trainingCompliancePct: 92.0, // 92% compliance
  salaryGrowthPct: 8.4, // +8.4% CTC growth
};

export const mockExecutiveInsights = [
  {
    id: 'INS-001',
    title: 'Strong Technical Headcount Expansion',
    category: 'Workforce Growth',
    type: 'positive',
    message: 'Engineering department grew by 18.5% this quarter with 94% offer acceptance rate.',
    metric: '+18.5%',
  },
  {
    id: 'INS-002',
    title: 'POSH Compliance Audit Alert',
    category: 'Compliance',
    type: 'warning',
    message: '12 new joinees across Marketing have POSH training due within the next 14 days.',
    metric: '14 Days Due',
  },
  {
    id: 'INS-003',
    title: 'Competitive Salary Alignment',
    category: 'Compensation',
    type: 'info',
    message: 'Average CTC for Senior Frontend Developers is aligned with top 80th market percentile.',
    metric: 'Top 80th %ile',
  },
];
