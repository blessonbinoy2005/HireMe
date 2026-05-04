const JobSeekerProfile = require("../models/JobSeekerProfile");
const User = require("../models/User");

function ok(data) {
    return { success: true, data };
}

function fail(message) {
    return { success: false, error: { message } };
}

const SCALAR_FIELDS = ["headline", "locationCity", "currentStatus", "country", "zipCode", "phoneNumber", "resume"];

function cleanEducation(arr) {
    if (!Array.isArray(arr)) return undefined;
    return arr
        .filter((row) => row && (row.school || "").trim() !== "")
        .map((row) => ({
            school: (row.school || "").trim(),
            degree: (row.degree || "").trim(),
            field: (row.field || "").trim(),
            startDate: (row.startDate || "").trim(),
            endDate: (row.endDate || "").trim(),
            current: !!row.current,
        }));
}

function cleanExperience(arr) {
    if (!Array.isArray(arr)) return undefined;
    return arr
        .filter((row) => row && (row.title || "").trim() !== "")
        .map((row) => ({
            title: (row.title || "").trim(),
            company: (row.company || "").trim(),
            employmentType: row.employmentType || "",
            location: (row.location || "").trim(),
            startDate: (row.startDate || "").trim(),
            endDate: (row.endDate || "").trim(),
            current: !!row.current,
            description: (row.description || "").trim(),
        }));
}

function cleanSkills(arr) {
    if (!Array.isArray(arr)) return undefined;
    const seen = new Set();
    const out = [];
    for (const raw of arr) {
        if (typeof raw !== "string") continue;
        const trimmed = raw.trim();
        if (!trimmed) continue;
        const key = trimmed.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(trimmed);
    }
    return out;
}

async function getProfile(req, res) {
    try {
        const profile = await JobSeekerProfile.findOne({ userId: req.userId });
        return res.json(ok({ profile }));
    } catch (err) {
        console.error("getProfile error:", err);
        return res.status(500).json(fail("Server error loading profile."));
    }
}

async function getProfileByUserId(req, res) {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("firstName lastName email role");
        if (!user) {
            return res.status(404).json(fail("User not found."));
        }
        const profile = await JobSeekerProfile.findOne({ userId });
        return res.json(ok({ user, profile }));
    } catch (err) {
        console.error("getProfileByUserId error:", err);
        return res.status(500).json(fail("Server error loading profile."));
    }
}

async function upsertProfile(req, res) {
    try {
        const update = {};
        for (const key of SCALAR_FIELDS) {
            if (req.body[key] !== undefined) update[key] = req.body[key];
        }

        if (req.body.education !== undefined) {
            const cleaned = cleanEducation(req.body.education);
            if (cleaned) update.education = cleaned;
        }
        if (req.body.experience !== undefined) {
            const cleaned = cleanExperience(req.body.experience);
            if (cleaned) update.experience = cleaned;
        }
        if (req.body.skills !== undefined) {
            const cleaned = cleanSkills(req.body.skills);
            if (cleaned) update.skills = cleaned;
        }

        const profile = await JobSeekerProfile.findOneAndUpdate(
            { userId: req.userId },
            { $set: update, $setOnInsert: { userId: req.userId } },
            { returnDocument: "after", upsert: true, runValidators: true }
        );

        return res.json(ok({ profile }));
    } catch (err) {
        console.error("upsertProfile error:", err);
        return res.status(500).json(fail("Server error saving profile."));
    }
}

module.exports = { getProfile, getProfileByUserId, upsertProfile };
