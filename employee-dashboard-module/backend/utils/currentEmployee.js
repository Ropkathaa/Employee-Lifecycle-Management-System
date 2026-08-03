const Employee = require("../models/Employee");

// ======================
// Default profile (used to seed the DB on first run / standalone mode)
// This is only a fallback so the module keeps working until the
// Authentication Module is wired into this codebase.
// ======================
const DEFAULT_PROFILE = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, USA",
  department: "Engineering",
  position: "Senior Developer",
  employeeId: "EMP-001",
  joinDate: "2023-01-15",
  avatar: null,
};

// ======================
// Get or create the default employee record
// ======================
const getOrCreateDefaultEmployee = async () => {
  let profile = await Employee.findOne({ employeeId: DEFAULT_PROFILE.employeeId });
  if (!profile) {
    profile = await Employee.create(DEFAULT_PROFILE);
  }
  return profile;
};

// ======================
// Resolve the currently authenticated employee.
// Priority:
//   1. req.employee / req.user (attached by the protect middleware / Auth Module)
//   2. Default employee (standalone mode before Auth Module integration)
// Always returns a real MongoDB document - never a hardcoded object.
// ======================
const getCurrentEmployee = async (req) => {
  const authenticated = req.employee || req.user;
  if (authenticated && authenticated._id) {
    return authenticated;
  }
  return getOrCreateDefaultEmployee();
};

// ======================
// Resolve the current employee's employeeId (used to scope every query)
// ======================
const getCurrentEmployeeId = async (req) => {
  const employee = await getCurrentEmployee(req);
  return employee.employeeId || employee._id.toString();
};

// ======================
// Helper: format a Date as YYYY-MM-DD (local time)
// ======================
const toDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

module.exports = {
  getCurrentEmployee,
  getCurrentEmployeeId,
  getOrCreateDefaultEmployee,
  toDateStr,
};

