export const REPORT_TYPES = ['Compliance', 'Payroll', 'Headcount', 'Training', 'Document'];

export const generatedReports = [
  { id: 'rep-001', name: 'Q2 2026 Headcount & Attrition Analysis', type: 'Headcount', format: 'PDF', rows: 248, generatedAt: '2026-07-25', generatedBy: 'Admin User', status: 'Ready' },
  { id: 'rep-002', name: 'July 2026 Payroll Statutory PF Report', type: 'Payroll', format: 'XLSX', rows: 248, generatedAt: '2026-07-24', generatedBy: 'Admin User', status: 'Ready' },
  { id: 'rep-003', name: 'Mandatory Compliance Training Audit Log', type: 'Compliance', format: 'CSV', rows: 512, generatedAt: '2026-07-20', generatedBy: 'Priya Sharma', status: 'Ready' },
  { id: 'rep-004', name: 'Engineering Team Skill Matrix 2026', type: 'Training', format: 'PDF', rows: 84, generatedAt: '2026-07-15', generatedBy: 'Sneha Kulkarni', status: 'Ready' },
  { id: 'rep-005', name: 'Document Verification Audit Q1 2026', type: 'Document', format: 'XLSX', rows: 120, generatedAt: '2026-04-01', generatedBy: 'Admin User', status: 'Expired' },
];

export const reportGenerators = [
  { id: 'gen-hc', label: 'Headcount Summary', description: 'Export full department and headcount breakdown in PDF/Excel', icon: 'users', color: 'primary' },
  { id: 'gen-pr', label: 'Payroll & PF Report', description: 'Monthly salary, PF calculation, and statutory compliance report', icon: 'dollar-sign', color: 'success' },
  { id: 'gen-tr', label: 'Training Progress Log', description: 'Detailed completion metrics across mandatory compliance courses', icon: 'book-open', color: 'warning' },
  { id: 'gen-doc', label: 'Document Audit Trail', description: 'Export upload logs and document verification statuses', icon: 'file-text', color: 'violet' },
];

export const reportStats = {
  totalReportsGenerated: 142,
  reportsThisMonth: 18,
  scheduledAutomations: 4,
};
