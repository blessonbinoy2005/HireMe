/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import "../css/AT.css";

function ApplicationTracker() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9000/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:9000/api/applications/${id}`,
        { applicationStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchApplications();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const renderCards = (status) => {
    const filtered = applications.filter(
      (app) => app.applicationStatus === status
    );

    if (filtered.length === 0) {
      return <p className="empty-column-text">No applications</p>;
    }

    return filtered.map((app) => {
      const job = app.jobId;

      return (
        <div key={app._id} className="tracker-job-card">
          <h4>{job?.jobTitle || "Job title missing"}</h4>
          <span>{job?.companyName || "Company missing"}</span>

          <p>{job?.address || "Location not specified"}</p>

          <select
            value={app.applicationStatus}
            onChange={(e) => updateStatus(app._id, e.target.value)}
          >
            <option value="saved">saved</option>
            <option value="applied">applied</option>
            <option value="interview">interview</option>
            <option value="offer">offer</option>
            <option value="rejected">rejected</option>
            <option value="withdrawn">withdrawn</option>
          </select>
        </div>
      );
    });
  };

  return (
    <>
      <Navbar />

      <div className="tracker-board">
        <div className="tracker-row-3">
          <div className="status-column">
            <h3>Saved</h3>
            {renderCards("saved")}
          </div>

          <div className="status-column">
            <h3>Applied</h3>
            {renderCards("applied")}
          </div>

          <div className="status-column">
            <h3>Interview</h3>
            {renderCards("interview")}
          </div>
        </div>

        <div className="tracker-row-2">
          <div className="status-column">
            <h3>Offer</h3>
            {renderCards("offer")}
          </div>

          <div className="status-column">
            <h3>Rejected</h3>
            {renderCards("rejected")}
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicationTracker;
