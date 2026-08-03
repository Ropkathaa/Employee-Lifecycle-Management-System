const mongoose = require("mongoose");

// ======================
// Notification Schema
// ======================
const notificationSchema = new mongoose.Schema(
  {
    employee: { type: String, default: "You" },
    employeeId: { type: String, default: "0" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "document",
        "training",
        "attendance",
        "leave",
        "profile",
        "hr",
        "company",
        "performance",
        "general",
      ],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    readAt: { type: Date, default: null },
    relatedModule: { type: String, default: "" },
    actionUrl: { type: String, default: "" },
    actionLabel: { type: String, default: "" },
  },
  { timestamps: true }
);

// Indexes for faster queries
notificationSchema.index({ employeeId: 1, createdAt: -1 });
notificationSchema.index({ employeeId: 1, status: 1 });

module.exports = mongoose.model("Notification", notificationSchema);

