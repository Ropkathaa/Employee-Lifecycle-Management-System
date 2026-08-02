/**
 * services/analyticsService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Enterprise Service Layer for Executive Analytics & Dashboard Metrics.
 * Returns async Promises simulating backend network calls.
 * In Phase 2+, replace implementation with Express, MongoDB, and Analytics API endpoints.
 */

import { mockSystemHealth, mockKPIBenchmarks, mockExecutiveInsights } from '../mock/analytics';

/**
 * Fetches system health indicators.
 * @returns {Promise<Object>}
 */
export async function fetchSystemHealth() {
  return Promise.resolve({ ...mockSystemHealth });
}

/**
 * Fetches executive KPI benchmarks.
 * @returns {Promise<Object>}
 */
export async function fetchKPIBenchmarks() {
  return Promise.resolve({ ...mockKPIBenchmarks });
}

/**
 * Fetches executive insights cards.
 * @returns {Promise<Array>}
 */
export async function fetchExecutiveInsights() {
  return Promise.resolve([...mockExecutiveInsights]);
}
