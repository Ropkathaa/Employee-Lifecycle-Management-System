// ======================
// Training Validation Helpers
// ======================

const TRAINING_MODES = ["online", "offline"];
const TRAINING_STATUSES = [
  "pending",
  "registered",
  "in_progress",
  "completed",
  "overdue",
];

const validateRegistration = (data = {}) => {
  const errors = {};

  if (!data.mode || !TRAINING_MODES.includes(data.mode)) {
    errors.mode = "Please select the training mode.";
  }

  if (data.mode === "offline" && !data.city) {
    errors.city = "Please select a training city.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateProgress = (progress) => {
  const value = parseInt(progress, 10);
  if (Number.isNaN(value) || value < 0 || value > 100) {
    return {
      valid: false,
      message: "Progress must be between 0 and 100",
    };
  }
  return { valid: true, value };
};

const validateTrainingData = (data = {}) => {
  const errors = {};
  if (!data.courseName || !String(data.courseName).trim()) {
    errors.courseName = "Course name is required";
  }
  if (data.status && !TRAINING_STATUSES.includes(data.status)) {
    errors.status = "Invalid training status";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  TRAINING_MODES,
  TRAINING_STATUSES,
  validateRegistration,
  validateProgress,
  validateTrainingData,
};

