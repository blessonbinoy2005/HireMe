const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.get('/:companyID', async (req, res) => {
    try {
        const jobs = await Job.find({
            CompanyID: req.params.companyID
        });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:jobID', async (req, res) => {
    try {
        const updatedJob = await Job.findOneAndUpdate(
            { JobID: req.params.jobID },
            req.body,
            { new: true }
        );
        res.json(updatedJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;