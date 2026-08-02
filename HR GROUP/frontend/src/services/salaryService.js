/**
 * services/salaryService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Enterprise Service Layer for Salary Summary & PF Management.
 * Returns async Promises simulating network requests.
 * In Phase 2+, replace implementation with Express, MongoDB, and Payroll API endpoints.
 */

import { mockSalaryRecords as seedSalaryRecords } from '../mock/salary';

/**
 * Fetches master list of employee salary records.
 * @returns {Promise<Array>}
 */
export async function fetchSalaryRecords() {
  return Promise.resolve([...seedSalaryRecords]);
}

/**
 * Fetches single salary record by Employee ID.
 * @param {string} employeeId
 * @returns {Promise<Object|null>}
 */
export async function fetchSalaryRecordByEmployeeId(employeeId) {
  const record = seedSalaryRecords.find(
    (s) => s.employeeId.toLowerCase() === employeeId.toLowerCase()
  );
  return Promise.resolve(record ? { ...record } : null);
}

/**
 * Updates an employee's salary record.
 * @param {string} employeeId
 * @param {Object} updatedData
 * @returns {Promise<Object>}
 */
export async function updateSalaryApi(employeeId, updatedData) {
  return Promise.resolve({ employeeId, ...updatedData });
}

/**
 * Revises salary, creating a new version record.
 * @param {string} employeeId
 * @param {Object} revisionData
 * @returns {Promise<Object>}
 */
export async function reviseSalaryApi(employeeId, revisionData) {
  return Promise.resolve({ employeeId, ...revisionData });
}

/**
 * Deletes or archives a salary record.
 * @param {string} employeeId
 * @returns {Promise<{ success: boolean, employeeId: string }>}
 */
export async function deleteSalaryApi(employeeId) {
  return Promise.resolve({ success: true, employeeId });
}
