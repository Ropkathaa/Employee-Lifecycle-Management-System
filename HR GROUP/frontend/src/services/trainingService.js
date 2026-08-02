/**
 * services/trainingService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Enterprise Service Layer for Mandatory Training & Monitoring System.
 * Returns async Promises simulating network requests.
 * In Phase 2+, replace implementation with Express, MongoDB, and Learning APIs endpoints.
 */

import {
  mockTrainingPrograms as seedPrograms,
  mockTrainingAssignments as seedAssignments,
  mockCertificates as seedCertificates,
} from '../mock/training';

/**
 * Fetches all training programs.
 * @returns {Promise<Array>}
 */
export async function fetchTrainingPrograms() {
  return Promise.resolve([...seedPrograms]);
}

/**
 * Fetches single training program by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchTrainingProgramById(id) {
  const p = seedPrograms.find((item) => item.id.toLowerCase() === id.toLowerCase());
  return Promise.resolve(p ? { ...p } : null);
}

/**
 * Fetches all assignments.
 * @returns {Promise<Array>}
 */
export async function fetchTrainingAssignments() {
  return Promise.resolve([...seedAssignments]);
}

/**
 * Fetches all certificates.
 * @returns {Promise<Array>}
 */
export async function fetchCertificates() {
  return Promise.resolve([...seedCertificates]);
}

/**
 * Creates a new training program.
 * @param {Object} programData
 * @returns {Promise<Object>}
 */
export async function createTrainingApi(programData) {
  return Promise.resolve({ ...programData });
}

/**
 * Assigns training program to employees.
 * @param {Object} assignmentData
 * @returns {Promise<Object>}
 */
export async function assignTrainingApi(assignmentData) {
  return Promise.resolve({ ...assignmentData });
}

/**
 * Updates training progress.
 * @param {string} assignmentId
 * @param {number} progress
 * @returns {Promise<Object>}
 */
export async function updateProgressApi(assignmentId, progress) {
  return Promise.resolve({ assignmentId, progress });
}

/**
 * Issues certificate.
 * @param {Object} certData
 * @returns {Promise<Object>}
 */
export async function issueCertificateApi(certData) {
  return Promise.resolve({ ...certData });
}
