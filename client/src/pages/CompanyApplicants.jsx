import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../css/companies.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

function formatDate(d) {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString();
}

function CompanyApplicants() {
    const { user } = useAuth();
    const { companyID, jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openNotesId, setOpenNotesId] = useState(null);
    const [notesDraft, setNotesDraft] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        async function load() {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_BASE}/api/jobs/${jobId}/applicants`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApplicants(res.data.data.applicants || []);
            } catch (err) {
                setError(err.response?.data?.error?.message || "Failed to load applicants.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [user, jobId]);

    function replaceApplicant(updated) {
        const next = [];
        for (let i = 0; i < applicants.length; i++) {
            if (applicants[i]._id === updated._id) {
                next.push(updated);
            } else {
                next.push(applicants[i]);
            }
        }
        setApplicants(next);
    }

    async function handleStatusChange(applicationId, newStatus) {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `${API_BASE}/api/jobs/${jobId}/applicants/${applicationId}`,
                { applicationStatus: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            replaceApplicant(res.data.data.application);
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to update status.");
        }
    }

    function toggleNotes(a) {
        if (openNotesId === a._id) {
            setOpenNotesId(null);
            setNotesDraft("");
        } else {
            setOpenNotesId(a._id);
            setNotesDraft(a.recruiterNotes || "");
        }
    }

    async function saveNotes(applicationId) {
        setSavingNotes(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `${API_BASE}/api/jobs/${jobId}/applicants/${applicationId}`,
                { recruiterNotes: notesDraft },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            replaceApplicant(res.data.data.application);
            setOpenNotesId(null);
            setNotesDraft("");
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to save notes.");
        } finally {
            setSavingNotes(false);
        }
    }

    if (!user) {
        return (
            <div className="companies-empty-page">
                <h1>You're not signed in.</h1>
                <p>
                    <Link to="/login" className="link-gold">Log in</Link> to view applicants.
                </p>
            </div>
        );
    }

    if (loading) {
        return <div className="companies-empty-page"><p>Loading…</p></div>;
    }

    return (
        <div className="companies-page">
            <header className="companies-header">
                <div>
                    <Link to={`/company/${companyID}`} className="link-gold">
                        ← Back to company
                    </Link>
                    <h1>Applicants</h1>
                </div>
                <span className="companies-role-badge">
                    {applicants.length} {applicants.length === 1 ? "applicant" : "applicants"}
                </span>
            </header>

            {error && <div className="companies-alert">{error}</div>}

            {applicants.length === 0 ? (
                <section className="companies-card">
                    <p className="companies-empty-text">No applicants yet for this job.</p>
                </section>
            ) : (
                <section className="companies-list">
                    {applicants.map((a) => {
                        const seeker = a.userId;
                        const fullName = seeker
                            ? `${seeker.firstName} ${seeker.lastName}`
                            : "Unknown applicant";
                        const isOpen = openNotesId === a._id;
                        const hasNote = (a.recruiterNotes || "").trim().length > 0;
                        return (
                            <div
                                key={a._id}
                                className="companies-row applicant-row"
                                style={{ cursor: "default", flexDirection: "column", alignItems: "stretch" }}
                            >
                                <div className="applicant-row-top">
                                    <div className="companies-row-main">
                                        <div className="companies-row-name">
                                            {seeker?._id ? (
                                                <Link
                                                    to={`/applicants/${seeker._id}`}
                                                    className="link-gold"
                                                >
                                                    {fullName}
                                                </Link>
                                            ) : (
                                                fullName
                                            )}
                                        </div>
                                        {seeker?.email && (
                                            <div className="companies-row-meta">{seeker.email}</div>
                                        )}
                                        {a.flagCreatedDate && (
                                            <div className="companies-row-meta">
                                                Applied {formatDate(a.flagCreatedDate)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="applicant-row-actions">
                                        <button
                                            type="button"
                                            className="applicant-notes-toggle"
                                            onClick={() => toggleNotes(a)}
                                        >
                                            {isOpen ? "Hide notes" : hasNote ? "View notes" : "Add notes"}
                                        </button>
                                        <select
                                            className={`applicant-status-select applicant-status-${a.applicationStatus}`}
                                            value={a.applicationStatus}
                                            onChange={(e) => handleStatusChange(a._id, e.target.value)}
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="interview">Interview</option>
                                            <option value="offer">Offer</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="applicant-notes-panel">
                                        <textarea
                                            className="companies-textarea"
                                            value={notesDraft}
                                            onChange={(e) => setNotesDraft(e.target.value)}
                                            placeholder="Notes about this applicant (visible to your team)…"
                                        />
                                        <div className="companies-actions">
                                            <button
                                                type="button"
                                                className="btn-primary"
                                                onClick={() => saveNotes(a._id)}
                                                disabled={savingNotes}
                                            >
                                                {savingNotes ? "Saving…" : "Save notes"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-outline"
                                                onClick={() => toggleNotes(a)}
                                                disabled={savingNotes}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>
            )}
        </div>
    );
}

export default CompanyApplicants;
