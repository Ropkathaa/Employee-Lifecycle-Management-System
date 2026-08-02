/**
 * config/payrollConstants.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized configurable payroll rules and constants.
 * Single Source of Truth for percentages and rates; NO hardcoding in business logic.
 */

export const PAYROLL_CONFIG = {
  EMPLOYEE_PF_RATE: 0.12, // 12% of Basic Salary
  EMPLOYER_PF_RATE: 0.12, // 12% of Basic Salary
  PROFESSIONAL_TAX_MONTHLY: 200, // ₹200 / month
  MOCK_INCOME_TAX_RATE: 0.05, // 5% mock income tax deduction
  INSURANCE_ANNUAL_DEFAULT: 20000, // ₹20,000 annual insurance contribution
  GRATUITY_FORMULA_RATIO: 15 / 26 / 5, // Statutory gratuity ratio
};

export const SALARY_STATUSES = ['Active', 'Under Revision', 'On Hold', 'Archived'];
