// ======================
// Notification Validation Helpers
// ======================

const {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITY,
  NOTIFICATION_STATUS,
} = require("../constants");

const CATEGORIES = NOTIFICATION_CATEGORIES;
const PRIORITIES = Object.values(NOTIFICATION_PRIORITY);
const STATUSES = Object.values(NOTIFICATION_STATUS);

const validateNotificationData = (data = {}) => {
  const errors = {};

  if (!data.title || !String(data.title).trim()) {
    errors.title = "Notification title is required";
  }

  if (data.category && !CATEGORIES.includes(data.category)) {
    errors.category = "Invalid notification category";
  }

  if (data.priority && !PRIORITIES.includes(data.priority)) {
    errors.priority = "Invalid notification priority";
  }

  if (data.status && !STATUSES.includes(data.status)) {
    errors.status = "Invalid notification status";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateIdParam = (id) => {
  return id && /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  validateNotificationData,
  validateIdParam,
};

