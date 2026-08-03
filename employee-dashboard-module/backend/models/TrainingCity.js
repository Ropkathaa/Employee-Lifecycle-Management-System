const mongoose = require("mongoose");

// ======================
// Training City Schema
// (Managed by HR - available offline training locations)
// ======================
const trainingCitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingCity", trainingCitySchema);

