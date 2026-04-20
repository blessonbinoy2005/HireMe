const mongoose = require("mongoose");

const ApplicationTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicationStatus: {
    type: String,
    enum: ["saved", "applied", "interview", "offer", "rejected", "withdrawn"],
    default: "saved",
  },
  flagCreatedDate: {
    type: Date,
    default: Date.now,
  },
  flagUpdatedDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("ApplicationTracker", ApplicationTrackerSchema);