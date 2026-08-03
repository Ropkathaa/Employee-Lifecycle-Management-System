const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Attendance = require("../models/Attendance");
const {
  getCurrentEmployee,
  getCurrentEmployeeId,
  toDateStr,
} = require("../utils/currentEmployee");

const OFFICE_START_HOUR = 9;
const OFFICE_START_MINUTE = 30;
const FULL_DAY_HOURS = 8;
const HALF_DAY_HOURS = 4;

// ======================
// Helpers
// ======================
const todayStr = () => toDateStr(new Date());

const officeStartToday = () => {
  const start = new Date();
  start.setHours(OFFICE_START_HOUR, OFFICE_START_MINUTE, 0, 0);
  return start;
};

// ======================
// Resolve the authenticated employee's identifier + display name
// ======================
const resolveEmployeeId = async (req) => getCurrentEmployeeId(req);

const resolveEmployeeName = async (req) => {
  const employee = await getCurrentEmployee(req);
  const name = `${employee.firstName || ""} ${employee.lastName || ""}`.trim();
  return name || employee.employeeId || "Employee";
};

// ======================
// Seed demo attendance history for the current employee (first run only)
// Scoped to the authenticated employee - never global.
// ======================
const seedAttendance = async (req) => {
  const employeeId = await resolveEmployeeId(req);
  const employeeName = await resolveEmployeeName(req);

  const count = await Attendance.countDocuments({ employeeId });
  if (count > 0) return;

  const records = [];
  const now = new Date();

  // Past 75 days, weekdays only
  for (let i = 1; i <= 75; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const dow = day.getDay();
    if (dow === 0 || dow === 6) continue;

    const dateStr = toDateStr(day);
    const rand = Math.random();

    // ~5% leave days
    if (rand < 0.05) {
      records.push({
        employee: employeeName,
        employeeId,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        workingHours: 0,
        status: "leave",
        lateEntry: false,
        remarks: "Approved leave",
      });
      continue;
    }

    // ~8% absent days
    if (rand < 0.13) {
      records.push({
        employee: employeeName,
        employeeId,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        workingHours: 0,
        status: "absent",
        lateEntry: false,
        remarks: "Absent",
      });
      continue;
    }

    // ~6% half days
    const halfDay = rand >= 0.13 && rand < 0.19;

    const inMin = 8 * 60 + 45 + Math.floor(Math.random() * 95); // 8:45 AM - 10:20 AM
    const inDate = new Date(day);
    inDate.setHours(0, inMin, 0, 0);

    const outMin = halfDay
      ? 12 * 60 + Math.floor(Math.random() * 60) // 12:00 PM - 1:00 PM
      : 16 * 60 + 30 + Math.floor(Math.random() * 150); // 4:30 PM - 7:00 PM
    const outDate = new Date(day);
    outDate.setHours(0, outMin, 0, 0);

    const hours = Math.round(((outDate - inDate) / 3600000) * 100) / 100;
    const late = inMin > OFFICE_START_HOUR * 60 + OFFICE_START_MINUTE;

    let status = "present";
    if (halfDay || (hours >= HALF_DAY_HOURS && hours < FULL_DAY_HOURS)) status = "half_day";
    if (hours < HALF_DAY_HOURS) status = "absent";

    records.push({
      employee: employeeName,
      employeeId,
      date: dateStr,
      checkIn: inDate,
      checkOut: outDate,
      workingHours: hours,
      status,
      lateEntry: late,
      remarks: late
        ? "Late entry"
        : status === "half_day"
        ? "Half day"
        : "On time",
    });
  }

  await Attendance.insertMany(records);
};

// ======================
// POST /api/employee/attendance/checkin
// @desc    Employee checks in for today (once per day only)
// ======================
const checkIn = asyncHandler(async (req, res) => {
  const employeeId = await resolveEmployeeId(req);
  const employeeName = await resolveEmployeeName(req);

  await seedAttendance(req);

  const date = todayStr();
  let record = await Attendance.findOne({ employeeId, date });

  if (record && record.checkIn) {
    return ApiResponse.error(res, "You have already checked in today.", 400);
  }

  const now = new Date();
  const late = now > officeStartToday();

  if (!record) {
    record = new Attendance({
      employee: employeeName,
      employeeId,
      date,
    });
  }

  record.checkIn = now;
  record.lateEntry = late;
  record.status = "present"; // provisional until check-out
  record.remarks = late ? "Late entry" : "Checked in on time";

  await record.save();

  ApiResponse.success(
    res,
    record,
    late ? "Checked in successfully (Late entry)" : "Checked in successfully"
  );
});

// ======================
// PUT /api/employee/attendance/checkout
// @desc    Employee checks out (requires a prior check-in)
// ======================
const checkOut = asyncHandler(async (req, res) => {
  const employeeId = await resolveEmployeeId(req);

  await seedAttendance(req);

  const date = todayStr();
  const record = await Attendance.findOne({ employeeId, date });

  if (!record || !record.checkIn) {
    return ApiResponse.error(res, "Please check in before checking out.", 400);
  }

  if (record.checkOut) {
    return ApiResponse.error(res, "You have already checked out today.", 400);
  }

  record.checkOut = new Date();
  const hours = Math.round(((record.checkOut - record.checkIn) / 3600000) * 100) / 100;
  record.workingHours = hours;

  if (hours >= FULL_DAY_HOURS) {
    record.status = "present";
    record.remarks = "Completed full working hours";
  } else if (hours >= HALF_DAY_HOURS) {
    record.status = "half_day";
    record.remarks = "Worked half day";
  } else {
    record.status = "absent";
    record.remarks = "Insufficient working hours";
  }

  await record.save();

  ApiResponse.success(res, record, "Checked out successfully");
});

// ======================
// GET /api/employee/attendance/today
// @desc    Get today's attendance record + server meta
// ======================
const getTodayAttendance = asyncHandler(async (req, res) => {
  const employeeId = await resolveEmployeeId(req);

  await seedAttendance(req);

  const record = await Attendance.findOne({
    employeeId,
    date: todayStr(),
  });

  ApiResponse.success(
    res,
    {
      record,
      serverTime: new Date().toISOString(),
      today: todayStr(),
      officeStart: `${OFFICE_START_HOUR}:${String(OFFICE_START_MINUTE).padStart(2, "0")} AM`,
    },
    "Today's attendance fetched successfully"
  );
});

// ======================
// GET /api/employee/attendance
// @desc    Get attendance summary cards for the authenticated employee
// ======================
const getAttendance = asyncHandler(async (req, res) => {
  const employeeId = await resolveEmployeeId(req);

  await seedAttendance(req);

  const records = await Attendance.find({
    employeeId,
  });

  let present = 0;
  let halfDay = 0;
  let absent = 0;
  let late = 0;
  let leaves = 0;
  let totalHours = 0;

  records.forEach((r) => {
    if (r.status === "present") present += 1;
    else if (r.status === "half_day") halfDay += 1;
    else if (r.status === "absent") absent += 1;
    else if (r.status === "leave") leaves += 1;
    if (r.lateEntry) late += 1;
    totalHours += r.workingHours || 0;
  });

  const totalDays = present + halfDay + absent;
  const attendancePercentage =
    totalDays === 0
      ? 0
      : Math.round(((present + halfDay * 0.5) / totalDays) * 1000) / 10;

  ApiResponse.success(
    res,
    {
      presentDays: present,
      absentDays: absent,
      halfDays: halfDay,
      lateEntries: late,
      leaveDays: leaves,
      totalWorkingHours: Math.round(totalHours * 100) / 100,
      attendancePercentage,
      totalDays,
    },
    "Attendance summary fetched successfully"
  );
});

// ======================
// GET /api/employee/attendance/history
// @desc    Get attendance history (search / month / status filter + pagination)
// ======================
const getAttendanceHistory = asyncHandler(async (req, res) => {
  const employeeId = await resolveEmployeeId(req);

  await seedAttendance(req);

  const { search, month, status, page = 1, limit = 10 } = req.query;

  const query = { employeeId };

  if (month && month !== "all") {
    query.date = { $regex: `^${month}` };
  }

  if (status && status !== "all") {
    if (status === "late") query.lateEntry = true;
    else query.status = status;
  }

  if (search) {
    query.$or = [
      { remarks: { $regex: search, $options: "i" } },
      { date: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Attendance.countDocuments(query);
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const records = await Attendance.find(query)
    .sort({ date: -1, checkIn: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  ApiResponse.paginated(
    res,
    records,
    total,
    parseInt(page),
    parseInt(limit),
    "Attendance history fetched successfully"
  );
});

module.exports = {
  getAttendance,
  getTodayAttendance,
  checkIn,
  checkOut,
  getAttendanceHistory,
};

