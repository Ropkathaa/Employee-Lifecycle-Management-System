/**
 * config/trainingConstants.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized configurable training rules, categories, statuses, and options.
 * Single Source of Truth for training constants; NO hardcoding in business logic.
 */

export const TRAINING_CATEGORIES = [
  'Compliance',
  'Technical',
  'Safety & Health',
  'Soft Skills',
  'Leadership',
  'Security',
  'Onboarding',
];

export const TRAINING_STATUSES = [
  'Draft',
  'Published',
  'Assigned',
  'In Progress',
  'Completed',
  'Failed',
  'Expired',
  'Archived',
];

export const CERTIFICATION_STATUSES = [
  'Not Started',
  'In Progress',
  'Completed',
  'Certificate Issued',
  'Expiring Soon',
  'Expired',
  'Renewal Required',
];

export const TRAINING_MODES = ['Online', 'Offline', 'Hybrid'];

export const PRIORITY_LEVELS = ['Critical', 'High', 'Medium', 'Low'];

export const RECURRENCE_OPTIONS = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];
