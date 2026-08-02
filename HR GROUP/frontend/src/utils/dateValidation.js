/**
 * utils/dateValidation.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized HR Date Validation & Formatting Utilities.
 * Implements strict enterprise HR business rules for DOB and Joining Dates.
 */

/**
 * Returns YYYY-MM-DD string for 65 years ago today (maximum allowed DOB).
 * Example: if today is 2026-07-28 -> 1961-07-28
 */
export function getMinimumDOB() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 65);
  return d.toISOString().split('T')[0];
}

/**
 * Returns YYYY-MM-DD string for 18 years ago today (minimum allowed DOB).
 * Example: if today is 2026-07-28 -> 2008-07-28
 */
export function getMaximumDOB() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split('T')[0];
}

/**
 * Returns YYYY-MM-DD string for today (minimum allowed Joining Date).
 * Example: 2026-07-28
 */
export function getMinimumJoiningDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns YYYY-MM-DD string for today + 365 days (maximum allowed Joining Date).
 * Example: 2027-07-28
 */
export function getMaximumJoiningDate() {
  const d = new Date();
  d.setDate(d.getDate() + 365);
  return d.toISOString().split('T')[0];
}

/**
 * Validates Date of Birth according to HR Business Rules:
 * - Age must be between 18 and 65 years.
 * @param {string} dateString - Date in YYYY-MM-DD or standard date format
 * @returns {{ valid: boolean, error: string | null }} Validation result
 */
export function isValidDOB(dateString) {
  if (!dateString) {
    return { valid: false, error: 'Date of birth is required.' };
  }

  const dob = new Date(dateString);
  if (isNaN(dob.getTime())) {
    return { valid: false, error: 'Please enter a valid date.' };
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 18 || age > 65) {
    return { valid: false, error: 'Employee age must be between 18 and 65 years.' };
  }

  return { valid: true, error: null };
}

/**
 * Validates Date of Joining according to HR Business Rules:
 * - Joining date cannot be earlier than today.
 * - Maximum joining date is 1 year (365 days) into the future.
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {{ valid: boolean, error: string | null }} Validation result
 */
export function isValidJoiningDate(dateString) {
  if (!dateString) {
    return { valid: false, error: 'Date of joining is required.' };
  }

  const joiningDate = new Date(dateString);
  if (isNaN(joiningDate.getTime())) {
    return { valid: false, error: 'Please enter a valid date.' };
  }

  // Clear time part for accurate date comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate < today) {
    return { valid: false, error: 'Joining date cannot be earlier than today.' };
  }

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 365);

  if (targetDate > maxDate) {
    return { valid: false, error: 'Joining date cannot be further than 1 year in future.' };
  }

  return { valid: true, error: null };
}

/**
 * Formats a YYYY-MM-DD or ISO date string to consistent DD-MM-YYYY format.
 * Example: "1994-12-01" -> "01-12-1994"
 * @param {string} dateString
 * @returns {string} Formatted date string (DD-MM-YYYY)
 */
export function formatDateDDMMYYYY(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}
