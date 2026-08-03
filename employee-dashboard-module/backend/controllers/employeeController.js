const fs = require("fs");
const path = require("path");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const { UPLOAD_DIR } = require("../middleware/upload");
const {
  getCurrentEmployee,
  getCurrentEmployeeId,
  toDateStr,
} = require("../utils/currentEmployee");

// @desc    Get all employees
// @route   GET /api/v1/employee-dashboard/employees
// @access  Private
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  ApiResponse.success(res, employees, "Employees fetched successfully");
});

// @desc    Get employee by ID
// @route   GET /api/v1/employee-dashboard/employees/:id
// @access  Private
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return ApiResponse.error(res, "Employee not found", 404);
  }
  ApiResponse.success(res, employee, "Employee fetched successfully");
});

// @desc    Create employee
// @route   POST /api/v1/employee-dashboard/employees
// @access  Private/Admin
const createEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.create(req.body);
  ApiResponse.created(res, employee, "Employee created successfully");
});

// @desc    Update employee
// @route   PUT /api/v1/employee-dashboard/employees/:id
// @access  Private/Admin
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!employee) {
    return ApiResponse.error(res, "Employee not found", 404);
  }
  ApiResponse.success(res, employee, "Employee updated successfully");
});

// @desc    Delete employee
// @route   DELETE /api/v1/employee-dashboard/employees/:id
// @access  Private/Admin
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) {
    return ApiResponse.error(res, "Employee not found", 404);
  }
  ApiResponse.success(res, null, "Employee deleted successfully");
});

// ======================
// Profile Controllers
// ======================

// @desc    Get current employee profile
// @route   GET /api/employee/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const profile = await getCurrentEmployee(req);
  ApiResponse.success(res, profile, "Profile fetched successfully");
});

// @desc    Update current employee profile
// @route   PUT /api/employee/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, location, department, position } = req.body;

  const profile = await getCurrentEmployee(req);

  // Update allowed fields
  if (firstName !== undefined) profile.firstName = firstName;
  if (lastName !== undefined) profile.lastName = lastName;
  if (email !== undefined) profile.email = email;
  if (phone !== undefined) profile.phone = phone;
  if (location !== undefined) profile.location = location;
  if (department !== undefined) profile.department = department;
  if (position !== undefined) profile.position = position;

  const updatedProfile = await profile.save();

  ApiResponse.success(res, updatedProfile, "Profile updated successfully");
});

// Helper: delete a file from the uploads directory (best-effort)
const deleteFileFromDisk = (filePath) => {
  if (!filePath) return;
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(UPLOAD_DIR, path.basename(filePath));
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.error("Failed to delete file:", err.message);
  }
};

// @desc    Upload / replace current employee's profile picture
// @route   PUT /api/employee/profile/avatar
// @access  Private
const uploadProfileAvatar = asyncHandler(async (req, res) => {
  const profile = await getCurrentEmployee(req);

  if (!req.file) {
    return ApiResponse.error(res, "Please select an image to upload", 400);
  }

  // Remove the previous avatar file (if any) before replacing
  deleteFileFromDisk(profile.avatar);

  // Store a URL-friendly path that is served by the static /uploads route
  profile.avatar = `/uploads/${req.file.filename}`;
  const updatedProfile = await profile.save();

  ApiResponse.success(res, updatedProfile, "Profile picture updated successfully");
});

// @desc    Get dashboard data
// @route   GET /api/employee/dashboard
// @access  Private
// Returns ONLY the authenticated employee's own dashboard information:
// profile, today's attendance, latest 3 notifications + unread count.
const getDashboard = asyncHandler(async (req, res) => {
  const employee = await getCurrentEmployee(req);
  const employeeId = await getCurrentEmployeeId(req);
  const today = toDateStr(new Date());

  // Today's attendance for the authenticated employee only
  const todayAttendance = await Attendance.findOne({
    employeeId,
    date: today,
  });

  // Latest 3 notifications belonging to the authenticated employee only
  const recentNotifications = await Notification.find({ employeeId })
    .sort({ createdAt: -1 })
    .limit(3);

  // Unread notification count for the authenticated employee only
  const unreadNotifications = await Notification.countDocuments({
    employeeId,
    status: "unread",
  });

  ApiResponse.success(
    res,
    {
      profile: employee,
      todayAttendance: todayAttendance || null,
      recentNotifications,
      unreadNotifications,
      serverTime: new Date().toISOString(),
      today,
    },
    "Dashboard data fetched successfully"
  );
});

// ======================
// Placeholder stubs for other route handlers referenced in employeeRoutes
// ======================

const getTrainings = asyncHandler(async (req, res) => {
  ApiResponse.success(res, [], "Trainings fetched successfully");
});

const getTrainingById = asyncHandler(async (req, res) => {
  ApiResponse.success(res, null, "Training fetched successfully");
});

const getAttendance = asyncHandler(async (req, res) => {
  ApiResponse.success(res, [], "Attendance fetched successfully");
});

// ======================
// Leave Controllers
// ======================

// @desc    Get all leave requests for the authenticated employee
// @route   GET /api/employee/leaves
// @access  Private
const getLeaves = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const leaves = await Leave.find({ employeeId }).sort({ appliedDate: -1, createdAt: -1 });
  ApiResponse.success(res, leaves, "Leaves fetched successfully");
});

// @desc    Apply for leave (linked to the authenticated employee)
// @route   POST /api/employee/leaves
// @access  Private
const applyLeave = asyncHandler(async (req, res) => {
  const employee = await getCurrentEmployee(req);
  const employeeId = await getCurrentEmployeeId(req);
  const {
    type,
    fromDate,
    toDate,
    numberOfDays,
    reason,
    medicalCertificate,
  } = req.body;

  if (!type || !fromDate || !toDate || !reason) {
    return ApiResponse.error(res, "Missing required leave fields", 400);
  }

  const employeeName = `${employee.firstName || ""} ${employee.lastName || ""}`.trim();

  const leave = await Leave.create({
    employee: employeeName || employee.employeeId || "Employee",
    employeeId,
    type,
    fromDate,
    toDate,
    numberOfDays: numberOfDays || 1,
    reason,
    status: "pending",
    appliedDate: new Date().toISOString().split("T")[0],
    medicalCertificate: medicalCertificate || null,
  });

  ApiResponse.created(res, leave, "Leave applied successfully");
});

// @desc    Update a leave request (authenticated employee's leave only)
// @route   PUT /api/employee/leaves/:id
// @access  Private
const updateLeave = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const leave = await Leave.findOne({ _id: req.params.id, employeeId });
  if (!leave) {
    return ApiResponse.error(res, "Leave request not found", 404);
  }

  const { type, fromDate, toDate, numberOfDays, reason, medicalCertificate } = req.body;
  if (type !== undefined) leave.type = type;
  if (fromDate !== undefined) leave.fromDate = fromDate;
  if (toDate !== undefined) leave.toDate = toDate;
  if (numberOfDays !== undefined) leave.numberOfDays = numberOfDays;
  if (reason !== undefined) leave.reason = reason;
  if (medicalCertificate !== undefined) leave.medicalCertificate = medicalCertificate;

  const updatedLeave = await leave.save();
  ApiResponse.success(res, updatedLeave, "Leave updated successfully");
});

// @desc    Cancel a leave request (authenticated employee's leave only)
// @route   DELETE /api/employee/leaves/:id
// @access  Private
const cancelLeave = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const leave = await Leave.findOne({ _id: req.params.id, employeeId });
  if (!leave) {
    return ApiResponse.error(res, "Leave request not found", 404);
  }

  leave.status = "cancelled";
  const updatedLeave = await leave.save();
  ApiResponse.success(res, updatedLeave, "Leave cancelled successfully");
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getProfile,
  updateProfile,
  uploadProfileAvatar,
  getDashboard,
  getTrainings,
  getTrainingById,
  getAttendance,
  getLeaves,
  applyLeave,
  updateLeave,
  cancelLeave,
};

