export const statsData = [
  { id: 'stat-1', label: 'Total Employees', value: '248', subtitle: 'Across all departments', trend: '+12', trendLabel: 'vs last month', trendDirection: 'up', icon: 'users', color: 'primary' },
  { id: 'stat-2', label: 'New Joinees', value: '14', subtitle: 'This month', trend: '+5', trendLabel: 'vs last month', trendDirection: 'up', icon: 'user-plus', color: 'success' },
  { id: 'stat-3', label: 'Pending Documents', value: '31', subtitle: 'Awaiting upload', trend: '-8', trendLabel: 'vs last month', trendDirection: 'down', icon: 'file-warning', color: 'warning' },
  { id: 'stat-4', label: 'Training Pending', value: '19', subtitle: 'Assignments overdue', trend: '+3', trendLabel: 'vs last week', trendDirection: 'up', icon: 'book-open', color: 'danger' },
];

export const quickActions = [
  { id: 'action-1', label: 'Create Employee', description: 'Add a new employee profile with auto-generated ID', route: '/employees/create', icon: 'user-plus', color: 'primary' },
  { id: 'action-2', label: 'Generate Offer Packet', description: 'Compile and export an offer letter document', route: '/offers/create', icon: 'file-text', color: 'success' },
  { id: 'action-3', label: 'Assign Training', description: 'Assign compliance or technical training sessions', route: '/training', icon: 'graduation-cap', color: 'warning' },
  { id: 'action-4', label: 'Generate Report', description: 'Export HR analytics and headcount reports', route: '/reports', icon: 'bar-chart', color: 'violet' },
];

export const recentEmployees = [
  { id: 'EMP-2026-0014', name: 'Arjun Mehta', designation: 'Senior Frontend Developer', department: 'Engineering', joiningDate: '2026-07-15', status: 'Active', avatarInitials: 'AM', avatarColor: 'bg-violet-500' },
  { id: 'EMP-2026-0013', name: 'Priya Sharma', designation: 'HR Business Partner', department: 'Human Resources', joiningDate: '2026-07-10', status: 'Active', avatarInitials: 'PS', avatarColor: 'bg-emerald-500' },
  { id: 'EMP-2026-0012', name: 'Rahul Nair', designation: 'Financial Analyst', department: 'Finance', joiningDate: '2026-07-08', status: 'Probation', avatarInitials: 'RN', avatarColor: 'bg-amber-500' },
  { id: 'EMP-2026-0011', name: 'Sneha Kulkarni', designation: 'Product Manager', department: 'Product', joiningDate: '2026-07-01', status: 'Active', avatarInitials: 'SK', avatarColor: 'bg-blue-500' },
  { id: 'EMP-2026-0010', name: 'Vikram Joshi', designation: 'Backend Engineer', department: 'Engineering', joiningDate: '2026-06-28', status: 'Probation', avatarInitials: 'VJ', avatarColor: 'bg-rose-500' },
];

export const recentActivities = [
  { id: 'act-1', title: 'New Employee Profile Created', description: 'Arjun Mehta (EMP-2026-0014) added to Engineering department.', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), actor: 'Admin User', type: 'onboarding', icon: 'user-plus', color: 'primary' },
  { id: 'act-2', title: 'Document Verified', description: 'Aadhaar Card verified for Priya Sharma (EMP-2026-0013).', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), actor: 'Priya Sharma', type: 'document', icon: 'file-text', color: 'success' },
  { id: 'act-3', title: 'Compliance Module Assigned', description: 'Code of Conduct 2026 assigned to 14 new joinees.', timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), actor: 'Admin User', type: 'training', icon: 'book-open', color: 'warning' },
  { id: 'act-4', title: 'Offer Letter Generated', description: 'Offer letter packet compiled for Rahul Nair (EMP-2026-0012).', timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), actor: 'Admin User', type: 'document', icon: 'file-text', color: 'violet' },
];

export const employeeGrowthData = [
  { month: 'Feb', count: 180 },
  { month: 'Mar', count: 195 },
  { month: 'Apr', count: 210 },
  { month: 'May', count: 228 },
  { month: 'Jun', count: 234 },
  { month: 'Jul', count: 248 },
];

export const departmentDistribution = [
  { department: 'Engineering', count: 104, percentage: 42 },
  { department: 'Human Resources', count: 32, percentage: 13 },
  { department: 'Finance', count: 28, percentage: 11 },
  { department: 'Product', count: 35, percentage: 14 },
  { department: 'Marketing', count: 25, percentage: 10 },
  { department: 'Operations', count: 24, percentage: 10 },
];

export const trainingCompletionData = [
  { label: 'Completed', value: 78, color: 'success' },
  { label: 'In Progress', value: 16, color: 'warning' },
  { label: 'Overdue', value: 6, color: 'danger' },
];

export const upcomingTasks = [
  { id: 'task-1', title: 'Offer Letter Review', description: 'Review and approve 3 pending offer letters', priority: 'high', dueDate: new Date(Date.now() + 86400000).toISOString(), type: 'approval' },
  { id: 'task-2', title: 'Payroll Processing', description: 'Process July payroll for all 248 employees', priority: 'critical', dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), type: 'payroll' },
  { id: 'task-3', title: 'Training Compliance Audit', description: 'Review training compliance for Engineering team', priority: 'medium', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), type: 'training' },
  { id: 'task-4', title: 'Document Verification', description: 'Verify onboarding docs for 6 new joinees', priority: 'medium', dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), type: 'document' },
];

export const pendingApprovals = [
  { id: 'appr-1', requestedBy: 'Karan Patel', type: 'Leave Application', detail: 'Annual leave request from 10 Aug to 15 Aug (5 days)', avatarInitials: 'KP', avatarColor: 'bg-teal-500', submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'appr-2', requestedBy: 'Divya Reddy', type: 'Reimbursement', detail: 'Marketing conference travel expenses (₹14,500)', avatarInitials: 'DR', avatarColor: 'bg-pink-500', submittedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  { id: 'appr-3', requestedBy: 'Amit Singh', type: 'Software License', detail: 'Figma Organization plan renewal request', avatarInitials: 'AS', avatarColor: 'bg-fuchsia-500', submittedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString() },
];
