export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
  RESIGNED: 'resigned',
};

export const EMPLOYEE_STATUS_COLORS = {
  [EMPLOYEE_STATUS.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  [EMPLOYEE_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [EMPLOYEE_STATUS.ON_LEAVE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  [EMPLOYEE_STATUS.TERMINATED]: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  [EMPLOYEE_STATUS.RESIGNED]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
};

export const LEAVE_TYPES = {
  SICK: 'sick',
  CASUAL: 'casual',
  ANNUAL: 'annual',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
};

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const LEAVE_TYPE_COLORS = {
  [LEAVE_TYPES.SICK]: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  [LEAVE_TYPES.CASUAL]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  [LEAVE_TYPES.ANNUAL]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  [LEAVE_TYPES.MATERNITY]: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  [LEAVE_TYPES.PATERNITY]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  HALF_DAY: 'half_day',
  LATE: 'late',
  WFH: 'work_from_home',
};

export const FORMAT_DATE = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const FORMAT_CURRENCY = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const FORMAT_FILE_SIZE = (bytes) => {
  if (!bytes && bytes !== 0) return '—';
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(1))} ${sizes[i]}`;
};

// ======================
// Document Management
// ======================

export const DOCUMENT_TYPES = {
  AADHAAR_CARD: 'aadhaar_card',
  PAN_CARD: 'pan_card',
  PASSPORT: 'passport',
  PASSPORT_PHOTO: 'passport_photo',
  TENTH_MARKSHEET: 'tenth_marksheet',
  TWELFTH_MARKSHEET: 'twelfth_marksheet',
  GRADUATION_CERTIFICATE: 'graduation_certificate',
  POST_GRADUATION_CERTIFICATE: 'post_graduation_certificate',
  EDUCATIONAL_CERTIFICATES: 'educational_certificates',
  EXPERIENCE_CERTIFICATES: 'experience_certificates',
  OFFER_LETTER: 'offer_letter',
  APPOINTMENT_LETTER: 'appointment_letter',
  RESUME: 'resume',
  ADDITIONAL_DOCUMENTS: 'additional_documents',
};

export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPES.AADHAAR_CARD]: 'Aadhaar Card',
  [DOCUMENT_TYPES.PAN_CARD]: 'PAN Card',
  [DOCUMENT_TYPES.PASSPORT]: 'Passport',
  [DOCUMENT_TYPES.PASSPORT_PHOTO]: 'Passport Photo',
  [DOCUMENT_TYPES.TENTH_MARKSHEET]: '10th Marksheet',
  [DOCUMENT_TYPES.TWELFTH_MARKSHEET]: '12th Marksheet',
  [DOCUMENT_TYPES.GRADUATION_CERTIFICATE]: 'Graduation Certificate',
  [DOCUMENT_TYPES.POST_GRADUATION_CERTIFICATE]: 'Post Graduation Certificate',
  [DOCUMENT_TYPES.EDUCATIONAL_CERTIFICATES]: 'Educational Certificates',
  [DOCUMENT_TYPES.EXPERIENCE_CERTIFICATES]: 'Experience Certificates',
  [DOCUMENT_TYPES.OFFER_LETTER]: 'Offer Letter',
  [DOCUMENT_TYPES.APPOINTMENT_LETTER]: 'Appointment Letter',
  [DOCUMENT_TYPES.RESUME]: 'Resume',
  [DOCUMENT_TYPES.ADDITIONAL_DOCUMENTS]: 'Additional Documents',
};

export const DOCUMENT_TYPE_COLORS = {
  [DOCUMENT_TYPES.AADHAAR_CARD]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  [DOCUMENT_TYPES.PAN_CARD]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  [DOCUMENT_TYPES.PASSPORT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  [DOCUMENT_TYPES.PASSPORT_PHOTO]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  [DOCUMENT_TYPES.TENTH_MARKSHEET]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  [DOCUMENT_TYPES.TWELFTH_MARKSHEET]: 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300',
  [DOCUMENT_TYPES.GRADUATION_CERTIFICATE]: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  [DOCUMENT_TYPES.POST_GRADUATION_CERTIFICATE]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  [DOCUMENT_TYPES.EDUCATIONAL_CERTIFICATES]: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  [DOCUMENT_TYPES.EXPERIENCE_CERTIFICATES]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  [DOCUMENT_TYPES.OFFER_LETTER]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  [DOCUMENT_TYPES.APPOINTMENT_LETTER]: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  [DOCUMENT_TYPES.RESUME]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  [DOCUMENT_TYPES.ADDITIONAL_DOCUMENTS]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export const DOCUMENT_STATUS = {
  UPLOADED: 'uploaded',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

export const DOCUMENT_STATUS_LABELS = {
  [DOCUMENT_STATUS.UPLOADED]: 'Uploaded',
  [DOCUMENT_STATUS.PENDING]: 'Pending',
  [DOCUMENT_STATUS.APPROVED]: 'Approved',
  [DOCUMENT_STATUS.REJECTED]: 'Rejected',
  [DOCUMENT_STATUS.EXPIRED]: 'Expired',
};

export const DOCUMENT_STATUS_COLORS = {
  [DOCUMENT_STATUS.UPLOADED]: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  [DOCUMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
  [DOCUMENT_STATUS.APPROVED]: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
  [DOCUMENT_STATUS.REJECTED]: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
  [DOCUMENT_STATUS.EXPIRED]: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
};

// ======================
// Training Management
// ======================

export const TRAINING_STATUS = {
  PENDING: 'pending',
  REGISTERED: 'registered',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
};

export const TRAINING_STATUS_LABELS = {
  [TRAINING_STATUS.PENDING]: 'Pending',
  [TRAINING_STATUS.REGISTERED]: 'Registered',
  [TRAINING_STATUS.IN_PROGRESS]: 'In Progress',
  [TRAINING_STATUS.COMPLETED]: 'Completed',
  [TRAINING_STATUS.OVERDUE]: 'Overdue',
};

export const TRAINING_STATUS_COLORS = {
  [TRAINING_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
  [TRAINING_STATUS.REGISTERED]: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  [TRAINING_STATUS.IN_PROGRESS]: 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800',
  [TRAINING_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
  [TRAINING_STATUS.OVERDUE]: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
};

export const TRAINING_MODE = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};

export const TRAINING_MODE_LABELS = {
  [TRAINING_MODE.ONLINE]: 'Online',
  [TRAINING_MODE.OFFLINE]: 'Offline',
};

export const TRAINING_CATEGORIES = [
  'Technical',
  'Management',
  'Compliance',
  'Soft Skills',
  'Leadership',
];

export const TRAINING_CITIES = [
  'Kolkata',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Mumbai',
  'Delhi',
  'Ahmedabad',
];

// ======================
// Attendance Management
// ======================

export const ATTENDANCE_STATUS_LABELS = {
  present: 'Full Day',
  half_day: 'Half Day',
  absent: 'Absent',
  leave: 'Leave',
  weekend: 'Weekend',
  work_from_home: 'Work From Home',
};

export const ATTENDANCE_STATUS_COLORS = {
  present: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
  half_day: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
  absent: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
  late: 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800',
  leave: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  weekend: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
  work_from_home: 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800',
};

export const ATTENDANCE_STATUS_ICONS = {
  present: '🟢',
  half_day: '🟡',
  absent: '🔴',
  late: '🟠',
  leave: '🔵',
  weekend: '⚪',
  work_from_home: '🏠',
};

// Calendar color mapping (background classes for the month grid)
export const ATTENDANCE_CALENDAR_COLORS = {
  present: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
  half_day: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700',
  absent: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
  leave: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
  weekend: 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600',
  work_from_home: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
};

export const OFFICE_START_TIME = '09:30 AM';

// ---------- Formatting helpers ----------
export const FORMAT_TIME = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const FORMAT_HOURS = (hours) => {
  if (hours === null || hours === undefined || Number.isNaN(hours)) return '—';
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0 && m === 0) return '0m';
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

export const FORMAT_DURATION = (ms) => {
  if (!ms || ms < 0) return '00h 00m 00s';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
};

// ======================
// Notification Management
// ======================

export const NOTIFICATION_CATEGORIES = [
  'document',
  'training',
  'attendance',
  'leave',
  'profile',
  'hr',
  'company',
  'performance',
  'general',
];

export const NOTIFICATION_CATEGORY_LABELS = {
  document: 'Document',
  training: 'Training',
  attendance: 'Attendance',
  leave: 'Leave',
  profile: 'Profile',
  hr: 'HR',
  company: 'Company',
  performance: 'Performance',
  general: 'General',
};

export const NOTIFICATION_CATEGORY_COLORS = {
  document: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  training: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  attendance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  leave: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  profile: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  hr: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  company: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  performance: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  general: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export const NOTIFICATION_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const NOTIFICATION_PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const NOTIFICATION_PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
  medium: 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800',
  low: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
};

export const NOTIFICATION_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
};

export const NOTIFICATION_STATUS_LABELS = {
  unread: 'Unread',
  read: 'Read',
};

export const NOTIFICATION_STATUS_COLORS = {
  unread: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
  read: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
};

export const FORMAT_DATETIME = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getTimeAgo = (timestamp) => {
  if (!timestamp) return '—';
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return FORMAT_DATE(timestamp);
};

