const express = require("express");
const router = express.Router();

const {
  registerCandidate,
  loginCandidate,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  uploadDocument,
  getDocuments,
  getRecruitmentStatus,
  getInterviews,
  requestReschedule,
  getNotifications,
  markNotificationRead,
  getOfferLetter,
  decideOffer,
} = require("../controllers/candidateController");

const { protectCandidate } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Auth / account
router.post("/register", registerCandidate);
router.post("/login", loginCandidate);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Profile
router.get("/profile", protectCandidate, getProfile);
router.put("/profile", protectCandidate, updateProfile);
router.put("/change-password", protectCandidate, changePassword);

// Documents (Stage 1 recruitment + Stage 2 onboarding, per BRD 4.2)
router.post("/documents", protectCandidate, upload.single("file"), uploadDocument);
router.get("/documents", protectCandidate, getDocuments);

// Recruitment status & timeline
router.get("/status", protectCandidate, getRecruitmentStatus);

// Interviews
router.get("/interviews", protectCandidate, getInterviews);
router.put("/interviews/:interviewId/reschedule", protectCandidate, requestReschedule);

// Notifications
router.get("/notifications", protectCandidate, getNotifications);
router.put("/notifications/:notificationId/read", protectCandidate, markNotificationRead);

// Offer letter
router.get("/offer", protectCandidate, getOfferLetter);
router.put("/offer/decision", protectCandidate, decideOffer);

module.exports = router;
