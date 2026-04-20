const mongoose = require("mongoose");

const CareerAdvisorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  organizationName: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("CareerAdvisorProfile", CareerAdvisorProfileSchema);