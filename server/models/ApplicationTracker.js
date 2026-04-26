// const mongoose = require("mongoose");

// const ApplicationTrackerSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   jobId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Job",
//     required: true,
//   },
//   applicationStatus: {
//     type: String,
//     enum: ["saved", "applied", "interview", "offer", "rejected", "withdrawn"],
//     default: "saved",
//   },

//   flagCreatedDate: {
//     type: Date,
//     default: Date.now,
//   },
//   flagUpdatedDate: {
//     type: Date,
//     default: Date.now,
//   },
//   notes: {
//     type: String,
//     trim: true,
//   },

//   // additional schema info
//   notes: { type: String, default: "" },
//   applicationLink: String
// });

// module.exports = mongoose.model("ApplicationTracker", ApplicationTrackerSchema);

const mongoose = require("mongoose");

const ApplicationTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // TEMP (until auth is wired)
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
    default: "",
    trim: true,
  },

  applicationLink: String,
});

module.exports = mongoose.model("ApplicationTracker", ApplicationTrackerSchema);