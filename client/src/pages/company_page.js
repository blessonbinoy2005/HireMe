import axios from "axios";
import React, { useEffect, useState } from "react";

function CompanyPage() {
  const [companyID, setCompanyID] = useState("");
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
  });

  useEffect(() => {
    const storedID = localStorage.getItem("companyID");
    if (storedID) setCompanyID(storedID);
  }, []);

  useEffect(() => {
    if (!companyID) return;

    axios
      .get(`http://localhost:9000/api/jobs/${companyID}`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, [companyID]);

  const handleEdit = (job) => {
    setEditingJob(job._id);

    setFormData({
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (jobID) => {
    axios
      .put(`http://localhost:9000/api/jobs/${jobID}`, formData)
      .then((res) => {
        setJobs(
          jobs.map((job) => (job._id === jobID ? res.data : job))
        );

        setEditingJob(null);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Company Dashboard</h2>

      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
          }}
        >
          {editingJob === job._id ? (
            <>
              <input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />

              <br />
              <br />

              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
              />

              <br />
              <br />

              <button onClick={() => handleUpdate(job._id)}>Save</button>
            </>
          ) : (
            <>
              <h3>{job.jobTitle}</h3>
              <p>{job.jobDescription}</p>
              <p>
                <b>Salary:</b> {job.salaryRange}
              </p>
              <p>
                <b>Location:</b> {job.address}
              </p>

              <button onClick={() => handleEdit(job)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default CompanyPage;