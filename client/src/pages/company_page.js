import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/CompanyPage.css";

function CompanyPage() {
  const { companyID } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  const emptyForm = {
    jobTitle: "",
    jobDescription: "",
    salaryRange: "",
    address: "",
    employmentType: "",
    applicationLink: "",
    applicationDeadlineDate: "",
    latitude: "",
    longitude: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchCompanyInfo = () => {
    axios
      .get(`http://localhost:9000/api/jobs/company-info/${companyID}`)
      .then((res) => setCompany(res.data))
      .catch((err) => console.error(err));
  };

  const fetchCompanyJobs = () => {
    axios
      .get(`http://localhost:9000/api/jobs/${companyID}`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCompanyInfo();
    fetchCompanyJobs();
  }, [companyID]);

  const clearForm = () => {
    setEditingJob(null);
    setFormData(emptyForm);
  };

  const handleEdit = (job) => {
    setEditingJob(job._id);

    setFormData({
      jobTitle: job.jobTitle || "",
      jobDescription: job.jobDescription || "",
      salaryRange: job.salaryRange || "",
      address: job.address || "",
      employmentType: job.employmentType || "",
      applicationLink: job.applicationLink || "",
      applicationDeadlineDate: job.applicationDeadlineDate
        ? job.applicationDeadlineDate.substring(0, 10)
        : "",
      latitude: job.latitude || "",
      longitude: job.longitude || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddJob = (e) => {
    e.preventDefault();

    axios
      .post(`http://localhost:9000/api/jobs/${companyID}`, formData)
      .then((res) => {
        setJobs([res.data, ...jobs]);
        clearForm();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:9000/api/jobs/${editingJob}`, formData)
      .then((res) => {
        setJobs(jobs.map((job) => (job._id === editingJob ? res.data : job)));
        clearForm();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="company-page">
      <div className="company-header">
        <div>
          <h1>Company Dashboard</h1>
          <p>Manage your company profile and job postings.</p>
        </div>

        <span>{jobs.length} jobs posted</span>
      </div>

      <div className="company-info-card">
        <div className="company-card-header">
          <h2>{company ? company.companyName : "Loading company..."}</h2>
          <button onClick={() => navigate(`/company/${companyID}/edit`)}>
            Edit
          </button>
        </div>

        <div className="company-info-grid">
          <p>
            <strong>Location:</strong>{" "}
            {company?.companyLocation || "No location added"}
          </p>

          <p>
            <strong>Website:</strong>{" "}
            {company?.companyWebsite ? (
              <a href={company.companyWebsite} target="_blank" rel="noreferrer">
                {company.companyWebsite}
              </a>
            ) : (
              "No website added"
            )}
          </p>
        </div>
      </div>

      <div className="company-layout">
        <form
          className="job-form-card"
          onSubmit={editingJob ? handleUpdate : handleAddJob}
        >
          <h2>{editingJob ? "Edit Job" : "Add New Job"}</h2>

          <input
            name="jobTitle"
            placeholder="Job title"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />

          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            required
          >
            <option value="">Select Employment Type</option>
            <option value="Internship Remote">Internship Remote</option>
            <option value="Internship Hybrid">Internship Hybrid</option>
            <option value="Internship On-site">Internship On-site</option>
            <option value="Full-time Remote">Full-time Remote</option>
            <option value="Full-time Hybrid">Full-time Hybrid</option>
            <option value="Full-time On-site">Full-time On-site</option>
            <option value="Part-time Remote">Part-time Remote</option>
            <option value="Part-time Hybrid">Part-time Hybrid</option>
            <option value="Part-time On-site">Part-time On-site</option>
            <option value="Contract Remote">Contract Remote</option>
            <option value="Contract Hybrid">Contract Hybrid</option>
            <option value="Contract On-site">Contract On-site</option>
          </select>

          <select
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
          >
            <option value="">Select Pay</option>
            <option value="$15/hr">$15/hr</option>
            <option value="$18/hr">$18/hr</option>
            <option value="$20/hr">$20/hr</option>
            <option value="$22/hr">$22/hr</option>
            <option value="$25/hr">$25/hr</option>
            <option value="$28/hr">$28/hr</option>
            <option value="$30/hr">$30/hr</option>
            <option value="$50K - $70K">$50K - $70K</option>
            <option value="$60K - $75K">$60K - $75K</option>
            <option value="$70K - $90K">$70K - $90K</option>
            <option value="$85K - $110K">$85K - $110K</option>
            <option value="$95K - $120K">$95K - $120K</option>
            <option value="$100K+">$100K+</option>
          </select>

          <input
            name="address"
            placeholder="Location ex: Albany, NY"
            value={formData.address}
            onChange={handleChange}
          />

          <textarea
            name="jobDescription"
            placeholder="Job description"
            value={formData.jobDescription}
            onChange={handleChange}
            required
          />

          <input
            name="applicationLink"
            placeholder="Application link"
            value={formData.applicationLink}
            onChange={handleChange}
          />

          <input
            name="applicationDeadlineDate"
            type="date"
            value={formData.applicationDeadlineDate}
            onChange={handleChange}
          />

          <div className="two-inputs">
            <input
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
            />

            <input
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit">
              {editingJob ? "Save Changes" : "Add Job"}
            </button>

            {editingJob && (
              <button type="button" className="cancel-btn" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="company-jobs-list">
          <h2>Your Job Posts</h2>

          {jobs.length === 0 ? (
            <p className="empty-text">No jobs found for this company.</p>
          ) : (
            jobs.map((job) => (
              <div className="company-job-card" key={job._id}>
                <div className="company-job-card-top">
                  <div>
                    <h3>{job.jobTitle}</h3>
                    <p>{job.jobDescription}</p>
                  </div>

                  <button onClick={() => handleEdit(job)}>Edit</button>
                </div>

                <div className="company-job-info">
                  {job.employmentType && <span>{job.employmentType}</span>}
                  {job.salaryRange && <span>{job.salaryRange}</span>}
                  {job.address && <span>{job.address}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyPage;