import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../css/profile.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

const STATUS_LABELS = {
    "": "-",
    student: "Student",
    "new-grad": "New grad",
    unemployed: "Unemployed",
    employed: "Employed",
};

function statusLabel(value) {
    return STATUS_LABELS[value] || "-";
}

function ApplicantProfile() {
    const { user } = useAuth();
    const { userId } = useParams();
    const [target, setTarget] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        async function load() {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_BASE}/api/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTarget(res.data.data.user);
                setProfile(res.data.data.profile);
            } catch (err) {
                setError(err.response?.data?.error?.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [user, userId]);

    if (!user) {
        return (
            <div className="profile-empty-page">
                <h1>You're not signed in.</h1>
                <p>
                    <Link to="/login" className="link-gold">Log in</Link> to view applicants.
                </p>
            </div>
        );
    }

    if (loading) {
        return <div className="profile-empty-page"><p>Loading…</p></div>;
    }

    if (error || !target) {
        return (
            <div className="profile-empty-page">
                <h1>Couldn't load profile.</h1>
                <p className="profile-muted">{error || "User not found."}</p>
            </div>
        );
    }

    const fullName = `${target.firstName} ${target.lastName}`;
    const education = profile?.education || [];
    const experience = profile?.experience || [];
    const skills = profile?.skills || [];

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>{fullName}</h1>
            </header>

            <section className="profile-card">
                <header className="profile-card-header">
                    <h2>About</h2>
                </header>
                <div className="profile-grid">
                    <div className="profile-field profile-grid-full">
                        <div className="profile-label">Headline</div>
                        <div className="profile-value">{profile?.headline || "-"}</div>
                    </div>
                    <div className="profile-field profile-grid-full">
                        <div className="profile-label">Current status</div>
                        <div className="profile-value">{statusLabel(profile?.currentStatus)}</div>
                    </div>
                </div>
            </section>

            <section className="profile-card">
                <header className="profile-card-header">
                    <h2>Location</h2>
                </header>
                <div className="profile-grid">
                    <div className="profile-field">
                        <div className="profile-label">City</div>
                        <div className="profile-value">{profile?.locationCity || "-"}</div>
                    </div>
                    <div className="profile-field">
                        <div className="profile-label">Country / Region</div>
                        <div className="profile-value">{profile?.country || "-"}</div>
                    </div>
                    <div className="profile-field profile-grid-full">
                        <div className="profile-label">ZIP / Postal code</div>
                        <div className="profile-value">{profile?.zipCode || "-"}</div>
                    </div>
                </div>
            </section>

            <section className="profile-card">
                <header className="profile-card-header">
                    <h2>Contact &amp; Resume</h2>
                </header>
                <div className="profile-grid">
                    <div className="profile-field profile-grid-full">
                        <div className="profile-label">Email</div>
                        <div className="profile-value">{target.email || "-"}</div>
                    </div>
                    <div className="profile-field profile-grid-full">
                        <div className="profile-label">Phone number</div>
                        <div className="profile-value">{profile?.phoneNumber || "-"}</div>
                    </div>
                    <div className="profile-field profile-grid-full">
                        <div className="profile-label">Resume</div>
                        <div className="profile-value">
                            {profile?.resume ? (
                                <a
                                    href={profile.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="link-gold"
                                >
                                    {profile.resume}
                                </a>
                            ) : (
                                "-"
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="profile-card">
                <header className="profile-card-header">
                    <h2>Education</h2>
                </header>
                {education.length > 0 ? (
                    education.map((e, i) => (
                        <div key={i} className="profile-row-view">
                            <div className="profile-value"><strong>{e.school || "-"}</strong></div>
                            {(e.degree || e.field) && (
                                <div className="profile-value">
                                    {e.degree}{e.degree && e.field ? ", " : ""}{e.field}
                                </div>
                            )}
                            {(e.startDate || e.endDate || e.current) && (
                                <div className="profile-muted">
                                    {e.startDate || "?"} - {e.current ? "Present" : (e.endDate || "?")}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="profile-empty-text">No education listed.</div>
                )}
            </section>

            <section className="profile-card">
                <header className="profile-card-header">
                    <h2>Experience</h2>
                </header>
                {experience.length > 0 ? (
                    experience.map((x, i) => (
                        <div key={i} className="profile-row-view">
                            <div className="profile-value">
                                <strong>{x.title || "-"}</strong>
                                {x.company && <span> · {x.company}</span>}
                            </div>
                            {(x.employmentType || x.location) && (
                                <div className="profile-muted">
                                    {x.employmentType}
                                    {x.employmentType && x.location ? " · " : ""}
                                    {x.location}
                                </div>
                            )}
                            {(x.startDate || x.endDate || x.current) && (
                                <div className="profile-muted">
                                    {x.startDate || "?"} - {x.current ? "Present" : (x.endDate || "?")}
                                </div>
                            )}
                            {x.description && (
                                <div className="profile-value" style={{ marginTop: 6 }}>
                                    {x.description}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="profile-empty-text">No experience listed.</div>
                )}
            </section>

            <section className="profile-card">
                <header className="profile-card-header">
                    <h2>Skills</h2>
                </header>
                {skills.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {skills.map((s, i) => (
                            <span key={i} className="profile-chip">{s}</span>
                        ))}
                    </div>
                ) : (
                    <div className="profile-empty-text">No skills listed.</div>
                )}
            </section>
        </div>
    );
}

export default ApplicantProfile;
