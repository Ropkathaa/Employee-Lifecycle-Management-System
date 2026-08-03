const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const Employee = require("../models/Employee");
const { getOrCreateDefaultEmployee } = require("../utils/currentEmployee");

// ======================
// protect middleware
// Attaches the authenticated employee document to req.employee / req.user.
//
// When the Authentication Module is wired into this codebase, the JWT is
// decoded and the matching employee is loaded from MongoDB. Until then the
// middleware falls back to the default seeded employee so the Employee
// Dashboard module keeps working standalone - with ZERO code changes needed
// for the Auth Module integration later.
//
// All downstream controllers MUST read the current employee via
// req.employee._id / req.employee.employeeId (never a hardcoded id).
// ======================
const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "employee_dashboard_secret"
      );
      const identifier = decoded.id || decoded._id || decoded.sub || decoded.employeeId;

      let employee = null;

      if (identifier) {
        if (mongoose.Types.ObjectId.isValid(identifier)) {
          employee = await Employee.findById(identifier);
        } else {
          employee = await Employee.findOne({ employeeId: identifier });
        }
      }

      if (employee) {
        req.employee = employee;
        req.user = employee;
        return next();
      }
    } catch (err) {
      // Invalid / expired token -> fall through to the standalone fallback
    }
  }

  const employee = await getOrCreateDefaultEmployee();
  req.employee = employee;
  req.user = employee;
  next();
});

module.exports = { protect };

