// ======================
// Attendance Validation Helpers
// ======================

const OFFICE_START_HOUR = 9;
const OFFICE_START_MINUTE = 30;

// Validate a check-in request.
// There is no body payload required - the server stamps the time,
// so validation mainly guards against malformed requests.
const validateCheckIn = (data = {}) => {
  const errors = {};

  if (data && typeof data !== "object") {
    errors.body = "Invalid request payload";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate a check-out request.
// Same as check-in: no external payload required.
const validateCheckOut = (data = {}) => {
  const errors = {};

  if (data && typeof data !== "object") {
    errors.body = "Invalid request payload";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

const getOfficeStartLabel = () =>
  `${OFFICE_START_HOUR}:${String(OFFICE_START_MINUTE).padStart(2, "0")} AM`;

module.exports = {
  validateCheckIn,
  validateCheckOut,
  getOfficeStartLabel,
};

