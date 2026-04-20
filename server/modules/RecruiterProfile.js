const mongoose = require("mongoose");

const RecruiterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobTitle: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("RecruiterProfile", RecruiterProfileSchema);