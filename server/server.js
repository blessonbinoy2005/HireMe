require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const companyJobRoutes = require("./router/jobroutes");
const ApplicationTracker = require("./models/ApplicationTracker");
//db imports
const Job = require("./models/Job");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Feature routes (API logic lives in controllers/*)
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", companyJobRoutes);

// Start server after DB connects
const PORT = process.env.PORT || 9000;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    });



app.get("/jobs", async (req, res) => {
    try {
      console.log("REQ QUERY:", req.query);
  
      const { keyword, jobType, salary, remote, moreFilter } = req.query;
  
      let filter = {};
  
      if (keyword) {
        filter.$or = [
          { jobTitle: { $regex: keyword, $options: "i" } },
          { companyName: { $regex: keyword, $options: "i" } },
          { jobDescription: { $regex: keyword, $options: "i" } },
          { address: { $regex: keyword, $options: "i" } },
        ];
      }
  
      if (jobType || remote) {
        filter.$and = [];
  
        if (jobType) {
          filter.$and.push({
            employmentType: { $regex: jobType, $options: "i" },
          });
        }
  
        if (remote) {
          filter.$and.push({
            employmentType: { $regex: remote, $options: "i" },
          });
        }
      }
  
      if (moreFilter === "deadline") {
        filter.applicationDeadlineDate = {
          $lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        };
      }
  
      let jobs = await Job.find(filter);
  
      if (salary) {
        jobs = jobs.filter((job) => {
          if (!job.salaryRange) return false;
  
          const nums = job.salaryRange.match(/\d+/g);
          if (!nums) return false;
  
          const maxNum = Math.max(...nums.map(Number));
  
          return maxNum >= Number(salary);
        });
      }
  
      console.log("JOBS RETURNED:", jobs.length);
  
      res.json(jobs);
    } catch (err) {
      console.error("get jobs error:", err);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });


  
// // GET: Fetch all jobs for the Tracker Dashboard 
// app.get('/api/applications', async (req, res) => {
// try {
//     // Note: userId would typically come from authentication middleware
//     const applications = await Application.find({ userId: req.user.id });
//     res.json(applications);
// } catch (err) {
//     res.status(500).json({ message: "Error fetching tracker data" });
// }
// });

// // POST: Save/Bookmark a new job [cite: 35, 39]
// app.post('/api/applications', async (req, res) => {
// const newApp = new Application({
//     ...req.body,
//     userId: req.user.id
// });
// try {
//     const saved = await newApp.save();
//     res.status(201).json(saved);
// } catch (err) {
//     res.status(400).json({ message: "Error saving job" });
// }
// });


// // APPLICATION TRACKER //

// // PATCH: Update application status or specific notes [cite: 35, 44]
// app.patch('/api/applications/:id', async (req, res) => {
//     try {
//         const updatedApp = await Application.findByIdAndUpdate(
//             req.params.id,
//             { status: req.body.status, notes: req.body.notes },
//             { new: true }
//         );
//         res.json(updatedApp);
//     } catch (err) {
//         res.status(400).json({ message: "Error updating application" });
//     }
// });
// async function handleSaveJob(jobFromApi) {
//     const jobToSave = {
//         role: jobFromApi.title,
//         company: jobFromApi.company,
//         location: jobFromApi.location,
//         status: 'Saved', // Default status
//         applicationLink: jobFromApi.url
//     };

//     const response = await fetch('/api/applications', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(jobToSave)
//     });

//     if (response.ok) {
//         alert("Job bookmarked to your tracker!");
//     }
// }
// GET ALL APPLICATIONS
app.get("/api/applications", async (req, res) => {
  try {
    const apps = await ApplicationTracker.find()
      .populate("jobId")
      .sort({ flagCreatedDate: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications" });
  }
});

// SAVE JOB
app.post("/api/applications", async (req, res) => {
  try {
    const { jobId, applicationLink } = req.body;

    const exists = await ApplicationTracker.findOne({ jobId });

    if (exists) {
      return res.status(400).json({ message: "Already saved" });
    }

    const newApp = new ApplicationTracker({
      jobId,
      applicationLink,
    });

    const saved = await newApp.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error saving job" });
  }
});

// UPDATE STATUS / NOTES
app.patch("/api/applications/:id", async (req, res) => {
  try {
    const updated = await ApplicationTracker.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        flagUpdatedDate: Date.now(),
      },
      { new: true }
    ).populate("jobId");

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating" });
  }
});

// DELETE
app.delete("/api/applications/:id", async (req, res) => {
  try {
    await ApplicationTracker.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting" });
  }
});