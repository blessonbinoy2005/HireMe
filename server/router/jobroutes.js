const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// Get all jobs for one company
router.get("/:companyID", async (req, res) => {
  try {
    const jobs = await Job.find({
      companyId: req.params.companyID,
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update one job
router.put("/:jobID", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobID,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;