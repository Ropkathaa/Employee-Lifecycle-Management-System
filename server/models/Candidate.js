const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    docType: {
      type: String,
      enum: [
        "resume",
        "experience_certificate",
        "professional_certification",
        "government_id",
        "educational_certificate",
        "photograph",
        "other",
        "additional_requested",
      ],
      required: true,
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    stage: {
      type: String,
      enum: ["recruitment", "onboarding"],
      default: "recruitment",
    },
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  },
  { _id: true }
);

const interviewSchema = new mongoose.Schema(
  {
    round: { type: String, default: "Round 1" },
    scheduledDate: { type: Date, required: true },
    mode: { type: String, enum: ["Online", "In-Person", "Telephonic"], default: "Online" },
    location: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Reschedule Requested"],
      default: "Scheduled",
    },
    rescheduleRequest: {
      requested: { type: Boolean, default: false },
      preferredDate: { type: Date },
      reason: { type: String },
      requestedAt: { type: Date },
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    },
  },
  { _id: true }
);

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sentBy: { type: String, default: "HR" },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { _id: true }
);

const candidateSchema = new mongoose.Schema(
  {
    // Auth
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    // Profile
    fullName: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"] },
    appliedPosition: { type: String },
    experienceYears: { type: Number, default: 0 },
    linkedIn: { type: String },

    // Recruitment lifecycle
    recruitmentStatus: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Interview Scheduled",
        "Interview Completed",
        "Selected",
        "Rejected",
        "Offer Extended",
        "Offer Accepted",
        "Offer Declined",
      ],
      default: "Applied",
    },
    recruitmentTimeline: [
      {
        stage: String,
        note: String,
        date: { type: Date, default: Date.now },
      },
    ],

    documents: [documentSchema],
    additionalDocumentsRequested: [
      {
        description: String,
        requestedAt: { type: Date, default: Date.now },
        fulfilled: { type: Boolean, default: false },
      },
    ],

    interviews: [interviewSchema],
    notifications: [notificationSchema],

    offerLetter: {
      filePath: { type: String },
      fileName: { type: String },
      issuedAt: { type: Date },
      decision: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending",
      },
      decisionAt: { type: Date },
    },

    // Once offer accepted, candidate converts to employee
    convertedToEmployee: { type: Boolean, default: false },
    employeeId: { type: String },

    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
