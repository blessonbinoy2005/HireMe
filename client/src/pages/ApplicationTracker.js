/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/navbar";
import "../css/AT.css";

function ApplicationTracker () {
        const [applications, setApplications] = useState([]);

    // Fetch data when the component loads
    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/applications');
            setApplications(res.data);
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.post(`http://localhost:9000/api/updateStatus`, { id, status: newStatus });
            // Refresh the list to move the card to the new column
            fetchApplications();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const promptEditNotes = (id, currentNotes) => {
        const newNote = prompt("Edit your notes:", currentNotes);
        if (newNote !== null) {
            axios.post(`http://localhost:9000/api/updateNotes`, { id, notes: newNote })
                .then(() => fetchApplications())
                .catch(() => alert("Error updating notes"));
        }
    };

    // Helper function to render cards for a specific status
    const renderCards = (status) => {
        const filtered = applications.filter(app => app.status === status);
        
        if (filtered.length === 0) {
            return <p style={{ color: '#b7bdd1', fontSize: '0.8rem', textAlign: 'center' }}>No applications</p>;
        }

        return filtered.map(app => (
            <div key={app._id} className="job-card">
                <div className="card-header">
                    <h4>{app.role}</h4>
                    <span className="company-tag">{app.company}</span>
                </div>

                <div className="card-body">
                    <p><strong>Location:</strong> {app.location || 'Not specified'}</p>
                    <p className="notes-text">
                        <strong>Notes:</strong> {app.notes || 'No notes yet'}
                    </p>
                </div>

                <div className="card-actions">
                    <select 
                        value={app.status} 
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                    >
                        {['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <button onClick={() => promptEditNotes(app._id, app.notes)}>
                        Edit
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <>
        <header>
            <h1>Application Tracker Dashboard</h1>
            <Navbar />
        </header>

         <div class="add-remove-jobs-buttons">
            <button>+ | Add Jobs</button>
            <button>- | Remove Jobs</button>
        </div>

        <div className="dashboard">
            <div className="apply-status">
                <div className="status-column">
                    <h3>Saved</h3>
                    <div id="saved-list">{renderCards('Saved')}</div>
                    <button>Save</button>
                </div>

                <div className="status-column">
                    <h3>Applied</h3>
                    <div id="applied-list">{renderCards('Applied')}</div>
                    <button>Apply</button>
                </div>

                <div className="status-column">
                    <h3>Interview</h3>
                    <div id="interview-list">{renderCards('Interview')}</div>
                    <button>Update</button>
                </div>
            </div>

            <div className="result-status">
                <div className="status-column">
                    <h3>Offer</h3>
                    <div id="offer-list">{renderCards('Offer')}</div>
                </div>

                <div className="status-column">
                    <h3>Rejected</h3>
                    <div id="rejected-list">{renderCards('Rejected')}</div>
                </div>
            </div>
        </div>
        </>
    );
}