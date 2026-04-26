require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const companyJobRoutes = require("./router/jobroutes");

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

    