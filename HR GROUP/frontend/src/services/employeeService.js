/**
 * services/employeeService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Enterprise Service Abstraction Layer for Employee Data.
 * Returns async Promises simulating network requests.
 * In Phase 2+, replace implementation inside these methods with Axios API calls.
 */

import { employees as seedEmployees } from '../mock/employees';
import { statsData as seedStats, recentActivities as seedActivities } from '../mock/dashboard';

/**
 * Fetches master employee list.
 * @returns {Promise<Array>} List of employees
 */
export async function fetchEmployees() {
  // Simulates network latency
  return Promise.resolve([...seedEmployees]);
}

/**
 * Fetches dashboard summary statistics.
 * @returns {Promise<Array>} List of stat cards
 */
export async function fetchDashboardStats() {
  return Promise.resolve([...seedStats]);
}

/**
 * Fetches recent platform activities.
 * @returns {Promise<Array>} List of activities
 */
export async function fetchRecentActivities() {
  return Promise.resolve([...seedActivities]);
}

/**
 * Creates a new employee record.
 * @param {Object} newEmployeeData
 * @returns {Promise<Object>} Created employee object
 */
export async function createEmployeeApi(newEmployeeData) {
  return Promise.resolve({ ...newEmployeeData });
}

/**
 * Updates an existing employee record.
 * @param {string} id
 * @param {Object} updatedData
 * @returns {Promise<Object>} Updated employee object
 */
export async function updateEmployeeApi(id, updatedData) {
  return Promise.resolve({ id, ...updatedData });
}

/**
 * Deletes an employee record.
 * @param {string} id
 * @returns {Promise<{ success: boolean, id: string }>} Deletion result
 */
export async function deleteEmployeeApi(id) {
  return Promise.resolve({ success: true, id });
}
