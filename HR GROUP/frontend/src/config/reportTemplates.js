/**
 * config/reportTemplates.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Built-in Report Templates, Categories, Columns, and Export formats.
 * Centralized configuration; NO hardcoding in business logic.
 */

export const REPORT_CATEGORIES = [
  'All Reports',
  'Employee Reports',
  'Salary Reports',
  'Training Reports',
  'Document Reports',
  'Offer Reports',
  'Compliance Reports',
  'Department Reports',
  'Executive Reports',
  'Saved Reports',
];

export const EXPORT_FORMATS = ['PDF', 'Excel', 'CSV', 'Print', 'Email', 'Cloud Share'];

export const BUILTIN_REPORT_TEMPLATES = [
  {
    id: 'REP-EMP-001',
    name: 'Employee Master Census & Roster Report',
    category: 'Employee Reports',
    description: 'Comprehensive organization employee census including contact details, department, designation, and employment type.',
    defaultColumns: ['employeeId', 'name', 'email', 'department', 'designation', 'employmentType', 'joiningDate', 'status'],
    icon: 'FiUsers',
  },
  {
    id: 'REP-SAL-002',
    name: 'Annual Compensation & Payroll Summary',
    category: 'Salary Reports',
    description: 'Executive salary breakdown showing Monthly Gross, Deductions, Net Take-Home, Employee PF, Employer PF, and Total CTC.',
    defaultColumns: ['employeeId', 'name', 'department', 'designation', 'monthlyGross', 'employeePf', 'employerPf', 'monthlyNet', 'totalAnnualCTC'],
    icon: 'FiDollarSign',
  },
  {
    id: 'REP-TRN-003',
    name: 'Mandatory Compliance & Training Progress Report',
    category: 'Training Reports',
    description: 'Audit report tracking employee completion rates for mandatory POSH, Security, and Compliance training modules.',
    defaultColumns: ['trainingId', 'trainingName', 'category', 'isMandatory', 'assignedCount', 'completedCount', 'overdueCount', 'completionRate'],
    icon: 'FiBookOpen',
  },
  {
    id: 'REP-DOC-004',
    name: 'Document Verification & Expiry Audit Report',
    category: 'Document Reports',
    description: 'Compliance verification audit detailing uploaded documents, verification status, and upcoming document expiries.',
    defaultColumns: ['id', 'name', 'type', 'employeeName', 'department', 'verificationStatus', 'expiryDate'],
    icon: 'FiFileText',
  },
  {
    id: 'REP-OFF-005',
    name: 'Recruitment & Offer Packet Status Report',
    category: 'Offer Reports',
    description: 'Recruitment pipeline report monitoring generated offer packets, candidate response statuses, and CTC offers.',
    defaultColumns: ['id', 'candidateName', 'department', 'designation', 'offeredCtc', 'status', 'version', 'issueDate'],
    icon: 'FiBriefcase',
  },
  {
    id: 'REP-EXEC-006',
    name: 'Executive Board Overview & Department KPI Report',
    category: 'Executive Reports',
    description: 'C-suite summary detailing headcount growth, average CTC, training compliance rate, and key risk indicators.',
    defaultColumns: ['department', 'headcount', 'averageCtc', 'trainingCompliance', 'pendingDocuments', 'activeOffers'],
    icon: 'FiPieChart',
  },
];
