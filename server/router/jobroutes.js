const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const Company = require("../models/Company");

// Get company info
router.get("/company-info/:companyID", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyID);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all jobs for one company
router.get("/:companyID", async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.params.companyID }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new job for one company
router.post("/:companyID", async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      companyId: req.params.companyID,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
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

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;