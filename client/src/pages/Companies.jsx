import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../css/companies.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

function Companies() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [memberships, setMemberships] = useState([]);
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
                const res = await axios.get(`${API_BASE}/api/companies/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMemberships(res.data.data.memberships || []);
            } catch (err) {
                setError(err.response?.data?.error?.message || "Failed to load companies.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [user]);

    if (!user) {
        return (
            <div className="companies-empty-page">
                <h1>You're not signed in.</h1>
                <p>
                    <Link to="/login" className="link-gold">Log in</Link> to manage companies.
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
                <h1>Companies</h1>
                <button
                    className="btn-primary"
                    onClick={() => navigate("/companies/new")}
                >
                    Create a company
                </button>
            </header>

            {error && <div className="companies-alert">{error}</div>}

            {memberships.length === 0 ? (
                <section className="companies-card">
                    <p className="companies-empty-text">
                        You're not part of any company yet.
                    </p>
                    <p>Create a new company to start posting jobs.</p>
                </section>
            ) : (
                <section className="companies-list">
                    {memberships.map((m) => (
                        <button
                            key={m.company._id}
                            type="button"
                            className="companies-row"
                            onClick={() => navigate(`/company/${m.company._id}`)}
                        >
                            <div className="companies-row-main">
                                <div className="companies-row-name">
                                    {m.company.companyName}
                                </div>
                                {m.company.industry && (
                                    <div className="companies-row-meta">
                                        {m.company.industry}
                                    </div>
                                )}
                                {m.company.companyLocation && (
                                    <div className="companies-row-meta">
                                        {m.company.companyLocation}
                                    </div>
                                )}
                            </div>
                            <div className={`companies-role-badge role-${m.role}`}>
                                {m.role}
                            </div>
                        </button>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Companies;
