const mongoose = require("mongoose");

const JobSeekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  education: {
    type: String,
    trim: true,
  },
  employmentStatus: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  resume: {
    type: String, // store file path, URL, or filename
    trim: true,
  },
});

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfileSchema);