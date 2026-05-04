const mongoose = require("mongoose");

const CompanyMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    role: {
        type: String,
        enum: ["owner", "admin", "recruiter"],
        default: "recruiter",
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

CompanyMemberSchema.index({ company: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("CompanyMember", CompanyMemberSchema);
