const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName:  { type: String, required: true, trim: true },
        email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["job_seeker", "recruiter", "career_advisor", "admin"], default: "job_seeker" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
