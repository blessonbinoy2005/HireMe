const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = mongoose.model("Skill", SkillSchema);