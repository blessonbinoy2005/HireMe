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
            const res = await axios.get("http://localhost:9000/api/applications");
            console.log("APPLICATIONS FROM DB:", res.data); // 👈 add this
            setApplications(res.data);
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        }
    };

    const updateStatus = async (id, newStatus) => {
        await axios.post("http://localhost:9000/api/updateStatus", {
            id,
            status: newStatus,
        });
        fetchApplications();
    };

    const renderCards = (status) => {
        const filtered = applications.filter((a) => a.status === status);

        if (filtered.length === 0) {
            return <p className="empty-column-text">No applications</p>;
        }

        return filtered.map((app) => (
            <div key={app._id} className="tracker-job-card">
                <h4>{app.role}</h4>
                <span>{app.company}</span>

                <p>{app.location}</p>

                <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                >
                    {["Saved", "Applied", "Interview", "Offer", "Rejected"].map(
                        (s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        )
                    )}
                </select>
            </div>
        ));
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
                        {renderCards("Saved")}
                    </div>

                    <div className="status-column">
                        <h3>Applied</h3>
                        {renderCards("Applied")}
                    </div>

                    <div className="status-column">
                        <h3>Interview</h3>
                        {renderCards("Interview")}
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="tracker-row-2">
                    <div className="status-column">
                        <h3>Offer</h3>
                        {renderCards("Offer")}
                    </div>

                    <div className="status-column">
                        <h3>Rejected</h3>
                        {renderCards("Rejected")}
                    </div>
                </div>

            </div>
        </>
    );
}

export default ApplicationTracker;