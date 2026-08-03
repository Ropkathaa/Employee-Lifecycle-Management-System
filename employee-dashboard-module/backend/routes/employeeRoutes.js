const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getDashboard,
  getProfile,
  updateProfile,
  uploadProfileAvatar,
  getLeaves,
  applyLeave,
  updateLeave,
  cancelLeave,
} = require("../controllers/employeeController");

const {
  getTrainingCities,
  getTrainings,
  getTrainingById,
  registerTraining,
  updateTrainingProgress,
  getTrainingCertificate,
} = require("../controllers/trainingController");

const {
  getDocuments,
  uploadDocument,
  bulkUploadDocuments,
  updateDocument,
  deleteDocument,
  downloadDocument,
} = require("../controllers/documentController");

const {
  getAttendance,
  getTodayAttendance,
  checkIn,
  checkOut,
  getAttendanceHistory,
} = require("../controllers/attendanceController");

const {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  generateDemoNotification,
} = require("../controllers/notificationController");

const upload = require("../middleware/upload");
const { uploadAvatar } = require("../middleware/upload");

// Apply authentication to every employee route so req.employee / req.user
// is always available. Controllers read the authenticated employee from
// req.employee._id / req.employee.employeeId (never hardcoded).
router.use(protect);

// ================= Dashboard =================
router.get("/dashboard", getDashboard);

// ================= Profile =================
router
  .route("/profile")
  .get(getProfile)
  .put(updateProfile);

router.put("/profile/avatar", uploadAvatar.single("avatar"), uploadProfileAvatar);

// ================= Documents =================
router
  .route("/documents")
  .get(getDocuments)
  .post(upload.single("file"), uploadDocument);

router
  .route("/documents/bulk")
  .post(upload.array("files", 20), bulkUploadDocuments);

router
  .route("/documents/:id")
  .put(upload.single("file"), updateDocument)
  .delete(deleteDocument);

router.get("/documents/:id/download", downloadDocument);

// ================= Trainings =================
router.get("/trainings/cities", getTrainingCities);
router.get("/trainings", getTrainings);
router.get("/trainings/:id", getTrainingById);
router.post("/trainings/:id/register", registerTraining);
router.put("/trainings/:id/progress", updateTrainingProgress);
router.get("/trainings/:id/certificate", getTrainingCertificate);

// ================= Attendance =================
router.get("/attendance", getAttendance);
router.post("/attendance/checkin", checkIn);
router.put("/attendance/checkout", checkOut);
router.get("/attendance/today", getTodayAttendance);
router.get("/attendance/history", getAttendanceHistory);

// ================= Leave =================
router
  .route("/leaves")
  .get(getLeaves)
  .post(applyLeave);

router
  .route("/leaves/:id")
  .put(updateLeave)
  .delete(cancelLeave);

// ================= Notifications =================
router.get("/notifications", getNotifications);
router.get("/notifications/:id", getNotificationById);
router.put("/notifications/:id/read", markNotificationAsRead);
router.put("/notifications/read-all", markAllNotificationsAsRead);
router.delete("/notifications/:id", deleteNotification);
router.post("/notifications/generate-demo", generateDemoNotification);

module.exports = router;