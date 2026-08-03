const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Notification = require("../models/Notification");
const { validateNotificationData, validateIdParam } = require("../validations/notificationValidation");
const { getCurrentEmployeeId } = require("../utils/currentEmployee");

// ======================
// Helper: seed demo notifications for the current employee (first run only)
// Scoped to the authenticated employee - never global.
// ======================
const seedNotifications = async (req) => {
  const employeeId = await getCurrentEmployeeId(req);
  const count = await Notification.countDocuments({ employeeId });
  if (count > 0) return;

  const now = Date.now();
  const day = 86400000;
  const hour = 3600000;

  const seed = [
    {
      title: "Training Reminder",
      description:
        "You have an upcoming training 'Advanced React Development' due in 7 days. Please complete it before the due date.",
      category: "training",
      priority: "high",
      status: "unread",
      relatedModule: "Training",
      actionUrl: "/training",
      actionLabel: "Open Training",
      createdAt: new Date(now - 2 * hour),
    },
    {
      title: "Leave Approved",
      description:
        "Your annual leave request has been approved by HR. Enjoy your time off!",
      category: "leave",
      priority: "high",
      status: "unread",
      relatedModule: "Leave Management",
      actionUrl: "/leaves",
      actionLabel: "Open Leave Management",
      createdAt: new Date(now - 5 * hour),
    },
    {
      title: "Document Upload Reminder",
      description:
        "Please upload your updated PAN Card and Passport documents before the end of this month.",
      category: "document",
      priority: "medium",
      status: "unread",
      relatedModule: "Documents",
      actionUrl: "/documents",
      actionLabel: "Open Documents",
      createdAt: new Date(now - 26 * hour),
    },
    {
      title: "Late Attendance Warning",
      description:
        "You have recorded 3 late arrivals this month. Please ensure you check in before 09:30 AM.",
      category: "attendance",
      priority: "high",
      status: "unread",
      relatedModule: "Attendance",
      actionUrl: "/attendance",
      actionLabel: "View Attendance",
      createdAt: new Date(now - 2 * day),
    },
    {
      title: "Performance Review Reminder",
      description:
        "Your quarterly performance review is scheduled for next week. Please fill in the self-assessment form.",
      category: "performance",
      priority: "medium",
      status: "unread",
      relatedModule: "Performance",
      actionUrl: "/profile",
      actionLabel: "View Profile",
      createdAt: new Date(now - 3 * day),
    },
    {
      title: "Document Approved",
      description:
        "Your Offer Letter document has been verified and approved by the HR team.",
      category: "document",
      priority: "low",
      status: "unread",
      relatedModule: "Documents",
      actionUrl: "/documents",
      actionLabel: "Open Documents",
      createdAt: new Date(now - 3 * day - 4 * hour),
    },
    {
      title: "Training Completed",
      description:
        "Congratulations! You have successfully completed the 'Leadership & Management Essentials' training. Your certificate is now available.",
      category: "training",
      priority: "low",
      status: "unread",
      relatedModule: "Training",
      actionUrl: "/training",
      actionLabel: "View Certificate",
      createdAt: new Date(now - 4 * day),
    },
    {
      title: "Leave Submitted",
      description:
        "Your casual leave request has been submitted successfully and is pending HR approval.",
      category: "leave",
      priority: "low",
      status: "unread",
      relatedModule: "Leave Management",
      actionUrl: "/leaves",
      actionLabel: "Open Leave Management",
      createdAt: new Date(now - 5 * day),
    },
    {
      title: "Attendance Reminder",
      description:
        "Don't forget to check in when you arrive. Regular attendance is important for accurate payroll processing.",
      category: "attendance",
      priority: "medium",
      status: "read",
      relatedModule: "Attendance",
      actionUrl: "/attendance",
      actionLabel: "View Attendance",
      readAt: new Date(now - 2 * day),
      createdAt: new Date(now - 6 * day),
    },
    {
      title: "HR Announcement",
      description:
        "New company policy update: Remote work guidelines have been revised effective next month. Please review the updated policy.",
      category: "hr",
      priority: "high",
      status: "read",
      relatedModule: "HR",
      actionUrl: "/settings",
      actionLabel: "View Policy",
      readAt: new Date(now - 3 * day),
      createdAt: new Date(now - 7 * day),
    },
    {
      title: "Company Announcement",
      description:
        "Annual company offsite is scheduled for next month. Register your interest before the deadline.",
      category: "company",
      priority: "medium",
      status: "read",
      relatedModule: "Company",
      actionUrl: "/",
      actionLabel: "View Details",
      readAt: new Date(now - 4 * day),
      createdAt: new Date(now - 8 * day),
    },
    {
      title: "Profile Updated",
      description:
        "Your profile information has been updated successfully. All changes are now saved.",
      category: "profile",
      priority: "low",
      status: "read",
      relatedModule: "Profile",
      actionUrl: "/profile",
      actionLabel: "View Profile",
      readAt: new Date(now - 5 * day),
      createdAt: new Date(now - 9 * day),
    },
    {
      title: "Document Rejected",
      description:
        "Your NDA Agreement document was rejected due to an invalid signature. Please re-upload a corrected version.",
      category: "document",
      priority: "high",
      status: "read",
      relatedModule: "Documents",
      actionUrl: "/documents",
      actionLabel: "Open Documents",
      readAt: new Date(now - 6 * day),
      createdAt: new Date(now - 10 * day),
    },
    {
      title: "Birthday Wishes",
      description:
        "Happy Birthday! 🎉 The HR team wishes you a wonderful day filled with joy and success.",
      category: "company",
      priority: "low",
      status: "read",
      relatedModule: "Company",
      actionUrl: "/",
      actionLabel: "Celebrate",
      readAt: new Date(now - 7 * day),
      createdAt: new Date(now - 12 * day),
    },
    {
      title: "Training Assigned",
      description:
        "New training 'Cybersecurity Essentials' has been assigned to you. Please register to begin.",
      category: "training",
      priority: "medium",
      status: "read",
      relatedModule: "Training",
      actionUrl: "/training",
      actionLabel: "Open Training",
      readAt: new Date(now - 8 * day),
      createdAt: new Date(now - 13 * day),
    },
    {
      title: "Leave Rejected",
      description:
        "Your sick leave request was rejected due to insufficient documentation. Please contact HR.",
      category: "leave",
      priority: "high",
      status: "read",
      relatedModule: "Leave Management",
      actionUrl: "/leaves",
      actionLabel: "Open Leave Management",
      readAt: new Date(now - 9 * day),
      createdAt: new Date(now - 14 * day),
    },
  ];

  const docs = seed.map((item) => ({
    employeeId,
    ...item,
  }));

  await Notification.insertMany(docs);
};

// ======================
// GET /api/employee/notifications
// @desc    Get all notifications for the current employee
// ======================
const getNotifications = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  await seedNotifications(req);

  const { search, category, priority, status, sort = "latest", page = 1, limit = 10 } = req.query;

  const filter = { employeeId };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "all") {
    filter.category = category;
  }

  if (priority && priority !== "all") {
    filter.priority = priority;
  }

  if (status && status !== "all") {
    filter.status = status;
  }

  // Sort: latest first (by createdAt desc) or oldest first
  const sortOptions = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const total = await Notification.countDocuments(filter);
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const notifications = await Notification.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  ApiResponse.paginated(
    res,
    notifications,
    total,
    parseInt(page),
    parseInt(limit),
    "Notifications fetched successfully"
  );
});

// ======================
// GET /api/employee/notifications/:id
// @desc    Get a single notification by id (authenticated employee's only)
// ======================
const getNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateIdParam(id)) {
    return ApiResponse.error(res, "Invalid notification id", 400);
  }

  const employeeId = await getCurrentEmployeeId(req);

  const notification = await Notification.findOne({
    _id: id,
    employeeId,
  });

  if (!notification) {
    return ApiResponse.error(res, "Notification not found", 404);
  }

  ApiResponse.success(res, notification, "Notification fetched successfully");
});

// ======================
// PUT /api/employee/notifications/:id/read
// @desc    Mark a notification as read (authenticated employee's only)
// ======================
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateIdParam(id)) {
    return ApiResponse.error(res, "Invalid notification id", 400);
  }

  const employeeId = await getCurrentEmployeeId(req);

  const notification = await Notification.findOne({
    _id: id,
    employeeId,
  });

  if (!notification) {
    return ApiResponse.error(res, "Notification not found", 404);
  }

  if (notification.status !== "read") {
    notification.status = "read";
    notification.readAt = new Date();
    await notification.save();
  }

  ApiResponse.success(res, notification, "Notification marked as read");
});

// ======================
// PUT /api/employee/notifications/read-all
// @desc    Mark all notifications as read (authenticated employee's only)
// ======================
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);

  const result = await Notification.updateMany(
    { employeeId, status: "unread" },
    { status: "read", readAt: new Date() }
  );

  ApiResponse.success(
    res,
    { modifiedCount: result.modifiedCount },
    result.modifiedCount > 0
      ? "All notifications marked as read"
      : "No unread notifications"
  );
});

// ======================
// DELETE /api/employee/notifications/:id
// @desc    Delete a notification (authenticated employee's only)
// ======================
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateIdParam(id)) {
    return ApiResponse.error(res, "Invalid notification id", 400);
  }

  const employeeId = await getCurrentEmployeeId(req);

  const notification = await Notification.findOne({
    _id: id,
    employeeId,
  });

  if (!notification) {
    return ApiResponse.error(res, "Notification not found", 404);
  }

  await notification.deleteOne();
  ApiResponse.success(res, null, "Notification deleted successfully");
});

// ======================
// POST /api/employee/notifications/generate-demo
// @desc    Create a notification for the authenticated employee
// ======================
const generateDemoNotification = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const { title, description, category = "general", priority = "medium", actionUrl = "", actionLabel = "" } = req.body;

  const data = {
    title,
    description,
    category,
    priority,
    actionUrl,
    actionLabel,
  };

  const validation = validateNotificationData(data);
  if (!validation.valid) {
    return ApiResponse.error(res, "Please provide a valid notification title", 400, validation.errors);
  }

  const notification = await Notification.create({
    employeeId,
    title: title.trim(),
    description: description || "",
    category,
    priority,
    status: "unread",
    relatedModule: category.charAt(0).toUpperCase() + category.slice(1),
    actionUrl,
    actionLabel: actionLabel || "View Details",
  });

  ApiResponse.created(res, notification, "Notification generated successfully");
});

module.exports = {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  generateDemoNotification,
};

