const mongoose = require("mongoose");

// ======================
// Document Schema
// ======================
const documentSchema = new mongoose.Schema(
  {
    documentType: { type: String, required: true, trim: true },
    documentName: { type: String, required: true, trim: true },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: "" },
    status: {
      type: String,
      enum: ["uploaded", "pending", "approved", "rejected", "expired"],
      default: "uploaded",
    },
    expiresAt: { type: Date, default: null },
    employee: { type: String, default: "You" },
    employeeId: { type: String, default: "0" },
  },
  { timestamps: true }
);

// Virtual: return a friendly status that auto-detects expiry
documentSchema.virtual("effectiveStatus").get(function () {
  if (
    this.status !== "expired" &&
    this.expiresAt &&
    new Date(this.expiresAt) < new Date()
  ) {
    return "expired";
  }
  return this.status;
});

module.exports = mongoose.model("Document", documentSchema);

