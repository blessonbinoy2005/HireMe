/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/navbar";
import "../css/AT.css";

import { useNavigate } from "react-router-dom";

function ApplicationTracker() {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

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
        const token = localStorage.getItem("token");
        await axios.patch(
            `http://localhost:9000/api/applications/${id}`,
            { applicationStatus: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchApplications();
    };

    const renderCards = (status) => {
        const filtered = applications.filter((a) => a.applicationStatus === status);

        if (filtered.length === 0) {
            return <p className="empty-column-text">No applications</p>;
        }

        return filtered.map((app) => {
            const job = app.jobId;
            return (
                <div key={app._id} className="tracker-job-card">
                    <h4>{job?.jobTitle}</h4>
                    <span>{job?.companyName}</span>

                    <p>{job?.address}</p>

                    <select
                        value={app.applicationStatus}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                    >
                        {["saved", "applied", "interview", "offer", "rejected"].map(
                            (s) => (
                                <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            )
                        )}
                    </select>
                </div>
            );
        });
    };

    return (
        <>
            <Navbar />
            <header>
                <h1>Application Tracker</h1>

                <div className="tracker-actions">
                    <button className="save-job-btn" onClick={() => navigate("/jobs")}>
                        + Save Job
                    </button>
                </div>
            </header>

            {/* BOARD */}
            <div className="tracker-board">

                {/* ROW 1 */}
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

                {/* ROW 2 */}
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