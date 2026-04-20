const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  applicationLink: {
    type: String,
    trim: true,
  },
  salaryRange: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  jobDescription: {
    type: String,
    trim: true,
  },
  employmentType: {
    type: String,
    trim: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  applicationDeadlineDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Job", JobSchema);