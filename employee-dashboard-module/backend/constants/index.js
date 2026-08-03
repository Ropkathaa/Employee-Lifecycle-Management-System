// Employee Status
const EMPLOYEE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ON_LEAVE: "on_leave",
  TERMINATED: "terminated",
  RESIGNED: "resigned",
};

// Employee Roles
const EMPLOYEE_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  HR: "hr",
};

// Leave Types
const LEAVE_TYPES = {
  SICK: "sick",
  CASUAL: "casual",
  ANNUAL: "annual",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
};

// Leave Status
const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

// Attendance Status
const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  HALF_DAY: "half_day",
  LATE: "late",
  LEAVE: "leave",
  WEEKEND: "weekend",
  WFH: "work_from_home",
};

// Document Types
const DOCUMENT_TYPES = {
  AADHAAR_CARD: "aadhaar_card",
  PAN_CARD: "pan_card",
  PASSPORT: "passport",
  PASSPORT_PHOTO: "passport_photo",
  TENTH_MARKSHEET: "tenth_marksheet",
  TWELFTH_MARKSHEET: "twelfth_marksheet",
  GRADUATION_CERTIFICATE: "graduation_certificate",
  POST_GRADUATION_CERTIFICATE: "post_graduation_certificate",
  EDUCATIONAL_CERTIFICATES: "educational_certificates",
  EXPERIENCE_CERTIFICATES: "experience_certificates",
  OFFER_LETTER: "offer_letter",
  APPOINTMENT_LETTER: "appointment_letter",
  RESUME: "resume",
  ADDITIONAL_DOCUMENTS: "additional_documents",
};

// Document Status
const DOCUMENT_STATUS = {
  UPLOADED: "uploaded",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  EXPIRED: "expired",
};

// Training Status
const TRAINING_STATUS = {
  PENDING: "pending",
  REGISTERED: "registered",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  OVERDUE: "overdue",
};

// Training Mode
const TRAINING_MODE = {
  ONLINE: "online",
  OFFLINE: "offline",
};

// Training Categories (sample set - HR can manage)
const TRAINING_CATEGORIES = [
  "Technical",
  "Management",
  "Compliance",
  "Soft Skills",
  "Leadership",
];

// Notification Categories
const NOTIFICATION_CATEGORIES = [
  "document",
  "training",
  "attendance",
  "leave",
  "profile",
  "hr",
  "company",
  "performance",
  "general",
];

// Notification Priority
const NOTIFICATION_PRIORITY = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

// Notification Status
const NOTIFICATION_STATUS = {
  UNREAD: "unread",
  READ: "read",
};

module.exports = {
  EMPLOYEE_STATUS,
  EMPLOYEE_ROLES,
  LEAVE_TYPES,
  LEAVE_STATUS,
  ATTENDANCE_STATUS,
  DOCUMENT_TYPES,
  DOCUMENT_STATUS,
  TRAINING_STATUS,
  TRAINING_MODE,
  TRAINING_CATEGORIES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITY,
  NOTIFICATION_STATUS,
};


