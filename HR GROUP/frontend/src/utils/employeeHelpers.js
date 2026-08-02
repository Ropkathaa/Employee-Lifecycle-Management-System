/**
 * utils/employeeHelpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized business logic utilities for employee calculations,
 * ID generation, statistics math, and activity logging.
 */

/**
 * Generates the next sequential Employee ID in format EMP-YYYY-XXXX.
 * Example: EMP-2026-0015
 * @param {Array} employees List of existing employees
 * @returns {string} Next formatted Employee ID
 */
export function generateEmployeeId(employees = []) {
  const currentYear = new Date().getFullYear();
  let maxSeq = 14; // Default starting threshold if empty

  if (Array.isArray(employees) && employees.length > 0) {
    employees.forEach((emp) => {
      if (emp?.id) {
        const parts = emp.id.split('-');
        if (parts.length === 3) {
          const num = parseInt(parts[2], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    });
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `EMP-${currentYear}-${nextSeq}`;
}

/**
 * Computes headcount grouped per department.
 * @param {Array} employees
 * @returns {Object} Map of department names to headcount
 */
export function calculateDepartmentCounts(employees = []) {
  const counts = {};
  if (!Array.isArray(employees)) return counts;

  employees.forEach((emp) => {
    if (emp?.department) {
      counts[emp.department] = (counts[emp.department] || 0) + 1;
    }
  });
  return counts;
}

/**
 * Computes summary counts across employee roster.
 * @param {Array} employees
 * @returns {{ total: number, active: number, probation: number, newJoinees: number }}
 */
export function calculateEmployeeStats(employees = []) {
  if (!Array.isArray(employees)) {
    return { total: 0, active: 0, probation: 0, newJoinees: 0 };
  }

  const total = employees.length;
  let active = 0;
  let probation = 0;
  let newJoinees = 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  employees.forEach((emp) => {
    if (emp.status === 'Active') active++;
    if (emp.status === 'Probation') probation++;

    const joiningDate = emp.dateOfJoining || emp.joiningDate;
    if (joiningDate) {
      const d = new Date(joiningDate);
      if (!isNaN(d.getTime()) && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        newJoinees++;
      }
    }
  });

  return { total, active, probation, newJoinees };
}

/**
 * Constructs a standardized activity timeline object.
 * @param {string} title
 * @param {string} description
 * @param {string} type
 * @param {string} actor
 * @returns {Object} Activity object
 */
export function buildActivityObject(title, description, type = 'onboarding', actor = 'HR Admin') {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title,
    description,
    timestamp: new Date().toISOString(),
    actor,
    type,
    icon: type === 'onboarding' ? 'user-plus' : 'briefcase',
    color: 'primary',
  };
}

/**
 * Generates 2-letter uppercase initials from full name.
 * Example: "Arjun Mehta" -> "AM"
 * @param {string} name
 * @returns {string} Initials
 */
export function generateAvatarInitials(name = '') {
  if (!name.trim()) return 'EM';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
