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
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:9000/api/applications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setApplications(res.data);
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    await axios.patch(
      `http://localhost:9000/api/applications/${id}`,
      { applicationStatus: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchApplications();
  };

  const editNotes = async (id, current) => {
    const newNote = prompt("Edit notes:", current || "");
    if (newNote !== null) {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:9000/api/applications/${id}`,
        { notes: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    }
  };

  const removeApp = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:9000/api/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchApplications();
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
          <div className="tracker-card-header">
            <div>
              <h4>{job?.jobTitle}</h4>
              <span>{job?.companyName}</span>
            </div>

            <button onClick={() => removeApp(app._id)}>×</button>
          </div>

          <p>{job?.address}</p>

          <p className="notes-text">
            {app.notes || "No notes"}
          </p>

          <div className="tracker-card-actions">
            <select
              value={app.applicationStatus}
              onChange={(e) => updateStatus(app._id, e.target.value)}
            >
              {["saved", "applied", "interview", "offer", "rejected"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>

            <button onClick={() => editNotes(app._id, app.notes)}>
              Notes
            </button>

            {app.applicationLink && (
              <a
                href={app.applicationLink}
                target="_blank"
                rel="noreferrer"
              >
                Apply
              </a>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Navbar />

      <div className="tracker-page">
        <h1>Application Tracker</h1>

        <div className="tracker-board">
          {["saved", "applied", "interview", "offer", "rejected"].map(
            (status) => (
              <div className="status-column" key={status}>
                <h3>{status.toUpperCase()}</h3>
                {renderCards(status)}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default ApplicationTracker;