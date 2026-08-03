const mongoose = require("mongoose");

// ======================
// Training Module Schema (sub-document)
// ======================
const trainingModuleSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

// ======================
// Training Schema
// ======================
const trainingSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    trainerName: { type: String, default: "" },
    durationDays: { type: Number, default: 1 },
    assignedDate: { type: Date, default: Date.now },
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    trainingMode: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    trainingCity: { type: String, default: "" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["pending", "registered", "in_progress", "completed", "overdue"],
      default: "pending",
    },
    learningObjectives: { type: [String], default: [] },
    modules: { type: [trainingModuleSchema], default: [] },
    certificateAvailable: { type: Boolean, default: false },
    employee: { type: String, default: "You" },
    employeeId: { type: String, default: "0" },
    registration: {
      mode: { type: String, enum: ["online", "offline", ""], default: "" },
      city: { type: String, default: "" },
      registeredAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Virtual: compute effective status (auto-complete + auto-overdue)
trainingSchema.virtual("effectiveStatus").get(function () {
  if (this.progress >= 100) return "completed";
  if (
    this.dueDate &&
    new Date(this.dueDate) < new Date() &&
    this.status !== "completed"
  ) {
    return "overdue";
  }
  return this.status;
});

module.exports = mongoose.model("Training", trainingSchema);

