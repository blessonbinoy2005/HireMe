const mongoose = require("mongoose");

const SystemAdminProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("SystemAdminProfile", SystemAdminProfileSchema);