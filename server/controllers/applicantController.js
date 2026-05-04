const ApplicationTracker = require("../models/ApplicationTracker");
const CompanyMember = require("../models/CompanyMember");
const Job = require("../models/Job");

function ok(data) {
    return { success: true, data };
}

function fail(message) {
    return { success: false, error: { message } };
}

async function listApplicants(req, res) {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json(fail("Job not found."));
        }

        const membership = await CompanyMember.findOne({
            company: job.companyId,
            user: req.userId,
        });
        if (!membership) {
            return res.status(403).json(fail("You are not a member of this job's company."));
        }

        const applicants = await ApplicationTracker
            .find({ jobId: job._id, applicationStatus: { $ne: "saved" } })
            .populate("userId")
            .sort({ flagCreatedDate: -1 });

        return res.json(ok({ applicants }));
    } catch (err) {
        console.error("listApplicants error:", err);
        return res.status(500).json(fail("Server error loading applicants."));
    }
}

async function updateApplicant(req, res) {
    try {
        const { jobId, applicationId } = req.params;
        const { applicationStatus, recruiterNotes } = req.body;

        if (applicationStatus !== undefined) {
            const allowed = ["applied", "interview", "offer", "rejected"];
            if (!allowed.includes(applicationStatus)) {
                return res.status(400).json(fail("Invalid status."));
            }
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json(fail("Job not found."));
        }

        const membership = await CompanyMember.findOne({
            company: job.companyId,
            user: req.userId,
        });
        if (!membership) {
            return res.status(403).json(fail("You are not a member of this job's company."));
        }

        const application = await ApplicationTracker.findOne({
            _id: applicationId,
            jobId: jobId,
        });
        if (!application) {
            return res.status(404).json(fail("Application not found."));
        }

        if (applicationStatus !== undefined) {
            application.applicationStatus = applicationStatus;
        }
        if (recruiterNotes !== undefined) {
            application.recruiterNotes = recruiterNotes;
        }
        application.flagUpdatedDate = Date.now();
        await application.save();

        const populated = await ApplicationTracker
            .findById(application._id)
            .populate("userId");

        return res.json(ok({ application: populated }));
    } catch (err) {
        console.error("updateApplicant error:", err);
        return res.status(500).json(fail("Server error updating applicant."));
    }
}

module.exports = { listApplicants, updateApplicant };
