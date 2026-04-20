const mongoose = require("mongoose");

const AdminRoleSchema = new mongoose.Schema({
  reportedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  flagStatus: {
    type: String,
    enum: ["pending", "reviewed", "resolved", "dismissed"],
    default: "pending",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  reviewedByAdminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("AdminRole", AdminRoleSchema);