const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Candidate = require("../models/Candidate");

const SALT_ROUNDS = 10;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register a new candidate
// @route   POST /api/candidates/register
const registerCandidate = async (req, res) => {
  try {
    const { fullName, email, password, phone, appliedPosition } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    const existing = await Candidate.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const candidate = await Candidate.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      appliedPosition,
      recruitmentTimeline: [
        { stage: "Applied", note: "Candidate registered and application submitted." },
      ],
    });

    return res.status(201).json({
      _id: candidate._id,
      fullName: candidate.fullName,
      email: candidate.email,
      recruitmentStatus: candidate.recruitmentStatus,
      token: generateToken(candidate._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error during registration." });
  }
};

// @desc    Login candidate
// @route   POST /api/candidates/login
const loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const candidate = await Candidate.findOne({ email: email.toLowerCase() });
    if (!candidate) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      _id: candidate._id,
      fullName: candidate.fullName,
      email: candidate.email,
      recruitmentStatus: candidate.recruitmentStatus,
      convertedToEmployee: candidate.convertedToEmployee,
      token: generateToken(candidate._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error during login." });
  }
};

// @desc    Get logged-in candidate's profile
// @route   GET /api/candidates/profile
const getProfile = async (req, res) => {
  const candidate = await Candidate.findById(req.candidate._id).select("-password");
  res.json(candidate);
};

// @desc    Update candidate profile
// @route   PUT /api/candidates/profile
const updateProfile = async (req, res) => {
  try {
    const updatableFields = [
      "fullName",
      "phone",
      "address",
      "dateOfBirth",
      "gender",
      "appliedPosition",
      "experienceYears",
      "linkedIn",
    ];

    const candidate = await Candidate.findById(req.candidate._id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found." });

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) candidate[field] = req.body[field];
    });

    await candidate.save();
    const { password, ...safeCandidate } = candidate.toObject();
    res.json(safeCandidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};

// @desc    Change password (while logged in)
// @route   PUT /api/candidates/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const candidate = await Candidate.findById(req.candidate._id);

    const isMatch = await bcrypt.compare(currentPassword, candidate.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect." });

    candidate.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await candidate.save();
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while changing password." });
  }
};

// @desc    Request password reset (generates token; in production emailed to candidate)
// @route   POST /api/candidates/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const candidate = await Candidate.findOne({ email: email?.toLowerCase() });
    if (!candidate) {
      // Do not reveal whether the email exists
      return res.json({ message: "If that account exists, a reset link has been generated." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    candidate.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    candidate.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 min
    await candidate.save();

    // In production this token would be emailed. Returned here for demo purposes.
    res.json({
      message: "If that account exists, a reset link has been generated.",
      resetToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while processing reset request." });
  }
};

// @desc    Reset password using token
// @route   POST /api/candidates/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const candidate = await Candidate.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!candidate) {
      return res.status(400).json({ message: "Reset token is invalid or has expired." });
    }

    candidate.password = await bcrypt.hash(req.body.newPassword, SALT_ROUNDS);
    candidate.resetPasswordToken = undefined;
    candidate.resetPasswordExpires = undefined;
    await candidate.save();

    res.json({ message: "Password has been reset successfully. Please log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while resetting password." });
  }
};

// @desc    Upload a recruitment/onboarding document
// @route   POST /api/candidates/documents
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const { docType } = req.body;
    const stage = ["government_id", "educational_certificate", "photograph"].includes(docType)
      ? "onboarding"
      : "recruitment";

    const candidate = await Candidate.findById(req.candidate._id);
    candidate.documents.push({
      docType,
      fileName: req.file.originalname,
      filePath: req.file.path,
      stage,
    });
    await candidate.save();

    res.status(201).json({ message: "Document uploaded successfully.", documents: candidate.documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while uploading document." });
  }
};

// @desc    Get all documents for the candidate
// @route   GET /api/candidates/documents
const getDocuments = async (req, res) => {
  const candidate = await Candidate.findById(req.candidate._id).select("documents additionalDocumentsRequested");
  res.json(candidate);
};

// @desc    Get recruitment status + timeline
// @route   GET /api/candidates/status
const getRecruitmentStatus = async (req, res) => {
  const candidate = await Candidate.findById(req.candidate._id).select(
    "recruitmentStatus recruitmentTimeline"
  );
  res.json(candidate);
};

// @desc    Get scheduled interviews
// @route   GET /api/candidates/interviews
const getInterviews = async (req, res) => {
  const candidate = await Candidate.findById(req.candidate._id).select("interviews");
  res.json(candidate.interviews);
};

// @desc    Request interview reschedule
// @route   PUT /api/candidates/interviews/:interviewId/reschedule
const requestReschedule = async (req, res) => {
  try {
    const { preferredDate, reason } = req.body;
    const candidate = await Candidate.findById(req.candidate._id);
    const interview = candidate.interviews.id(req.params.interviewId);

    if (!interview) return res.status(404).json({ message: "Interview not found." });

    interview.status = "Reschedule Requested";
    interview.rescheduleRequest = {
      requested: true,
      preferredDate,
      reason,
      requestedAt: new Date(),
      status: "Pending",
    };

    await candidate.save();
    res.json({ message: "Reschedule request submitted.", interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while requesting reschedule." });
  }
};

// @desc    Get notifications
// @route   GET /api/candidates/notifications
const getNotifications = async (req, res) => {
  const candidate = await Candidate.findById(req.candidate._id).select("notifications");
  res.json(candidate.notifications.sort((a, b) => b.createdAt - a.createdAt));
};

// @desc    Mark a notification as read
// @route   PUT /api/candidates/notifications/:notificationId/read
const markNotificationRead = async (req, res) => {
  const candidate = await Candidate.findById(req.candidate._id);
  const notification = candidate.notifications.id(req.params.notificationId);
  if (!notification) return res.status(404).json({ message: "Notification not found." });
  notification.read = true;
  await candidate.save();
  res.json({ message: "Notification marked as read." });
};

// @desc    View offer letter
// @route   GET /api/candidates/offer
const getOfferLetter = async (req, res) => {
  const candidate = await Candidate.findById(req.candidate._id).select("offerLetter recruitmentStatus");
  if (!candidate.offerLetter || !candidate.offerLetter.filePath) {
    return res.status(404).json({ message: "No offer letter available yet." });
  }
  res.json(candidate.offerLetter);
};

// @desc    Accept or decline offer letter
// @route   PUT /api/candidates/offer/decision
const decideOffer = async (req, res) => {
  try {
    const { decision } = req.body; // "Accepted" | "Declined"
    if (!["Accepted", "Declined"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be 'Accepted' or 'Declined'." });
    }

    const candidate = await Candidate.findById(req.candidate._id);
    if (!candidate.offerLetter || !candidate.offerLetter.filePath) {
      return res.status(400).json({ message: "No offer letter to act on." });
    }

    candidate.offerLetter.decision = decision;
    candidate.offerLetter.decisionAt = new Date();
    candidate.recruitmentStatus = decision === "Accepted" ? "Offer Accepted" : "Offer Declined";
    candidate.recruitmentTimeline.push({
      stage: candidate.recruitmentStatus,
      note: `Candidate ${decision.toLowerCase()} the offer letter.`,
    });

    if (decision === "Accepted") {
      // Convert candidate dashboard into employee dashboard per BRD 4.2
      candidate.convertedToEmployee = true;
      candidate.employeeId = generateEmployeeId();
      candidate.recruitmentTimeline.push({
        stage: "Converted to Employee",
        note: "Profile and verified documents transferred to employee record.",
      });
    }

    await candidate.save();
    res.json({
      message: `Offer ${decision.toLowerCase()} successfully.`,
      recruitmentStatus: candidate.recruitmentStatus,
      convertedToEmployee: candidate.convertedToEmployee,
      employeeId: candidate.employeeId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while processing offer decision." });
  }
};

// Generates a unique 5-digit employee ID per BRD 4.4 requirement
function generateEmployeeId() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

module.exports = {
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
};
