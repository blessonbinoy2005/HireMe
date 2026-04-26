import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "../css/JobPage.css";
import Navbar from "../components/navbar";
import JobMap from "../components/JobMap";

function JobsPage() {
  const [searchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [distance, setDistance] = useState("");
  const [remote, setRemote] = useState("");
  const [moreFilter, setMoreFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const fetchJobs = () => {
    axios
      .get("http://localhost:9000/jobs", {
        params: {
          keyword,
          jobType,
          salary,
          distance,
          remote,
          moreFilter,
        },
      })
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.log("Error fetching jobs:", err);
      });
  };

  const fetchSavedApplications = () => {
    axios
      .get("http://localhost:9000/api/applications")
      .then((res) => {
        const ids = res.data.map((app) => app.jobId);
        setSavedJobIds(ids);
      })
      .catch((err) => {
        console.log("Error fetching saved applications:", err);
      });
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedApplications();
  }, [jobType, salary, distance, remote, moreFilter]);

  const handleSearch = () => {
    fetchJobs();
  };

  const handleSaveJob = async (job, e) => {
    e.stopPropagation();

    try {
      const jobToSave = {
        jobId: job._id,
        role: job.jobTitle,
        company: job.companyName,
        location: job.address,
        status: "Saved",
        notes: "",
        applicationLink: job.applicationLink,
      };

      const res = await axios.post(
        "http://localhost:9000/api/applications",
        jobToSave
      );

      setSavedJobIds([...savedJobIds, job._id]);
      alert("Job saved to tracker!");
    } catch (error) {
      console.error(error);
      alert("Job is already saved or failed to save.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="jobs-page">
        <div className="jobs-filter-bar">
          <div className="jobs-search-input">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Software engineer in Albany, NY"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <select
            className="filter-input"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">Job Type</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            className="filter-input"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          >
            <option value="">Salary</option>
            <option value="20">$20+/hr</option>
            <option value="25">$25+/hr</option>
            <option value="60000">$60K+</option>
            <option value="80000">$80K+</option>
            <option value="100000">$100K+</option>
          </select>

          <select
            className="filter-input"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          >
            <option value="">Distance</option>
            <option value="5">Within 5 miles</option>
            <option value="10">Within 10 miles</option>
            <option value="25">Within 25 miles</option>
            <option value="50">Within 50 miles</option>
          </select>

          <select
            className="filter-input"
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
          >
            <option value="">Remote</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select
            className="filter-input"
            value={moreFilter}
            onChange={(e) => setMoreFilter(e.target.value)}
          >
            <option value="">More Filters</option>
            <option value="deadline">Deadline Soon</option>
          </select>

          <button className="save-search-button">Save Search</button>

          <button className="filter-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="jobs-content">
          <div className="map-placeholder">
            <JobMap
              jobs={jobs}
              selectedJob={selectedJob}
              savedJobIds={savedJobIds}
              onSaveJob={handleSaveJob}
            />
          </div>

          <div className="jobs-list-section">
            <div className="jobs-list-header">
              <h1>Job Results</h1>
              <p>{jobs.length} results</p>
            </div>

            <div className="jobs-list">
              {jobs.length === 0 ? (
                <p className="no-jobs">No jobs found.</p>
              ) : (
                jobs.map((job) => (
                  <div
                    className="job-card"
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="job-card-top">
                      <div>
                        <h2>{job.jobTitle}</h2>
                        <p className="company">{job.companyName}</p>
                        <p className="location">{job.address}</p>
                      </div>

                      <span className="job-status">New</span>
                    </div>

                    <p className="salary">{job.salaryRange}</p>

                    <p className="description">
                      {job.jobDescription?.length > 130
                        ? job.jobDescription.substring(0, 130) + "..."
                        : job.jobDescription}
                    </p>

                    <div className="job-card-bottom">
                      <div className="job-tags">
                        {job.employmentType && <span>{job.employmentType}</span>}
                      </div>

                      <div className="job-actions">
                        <button
                          className={
                            savedJobIds.includes(job._id)
                              ? "save-job-btn saved"
                              : "save-job-btn"
                          }
                          onClick={(e) => handleSaveJob(job, e)}
                          disabled={savedJobIds.includes(job._id)}
                        >
                          {savedJobIds.includes(job._id) ? "Saved" : "Save"}
                        </button>

                        <a
                          href={job.applicationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="apply-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Apply
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobsPage;