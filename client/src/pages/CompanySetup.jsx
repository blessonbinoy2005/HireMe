import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../css/companies.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

const SIZE_OPTIONS = [
    { value: "", label: "-" },
    { value: "1-10", label: "1-10" },
    { value: "11-50", label: "11-50" },
    { value: "51-200", label: "51-200" },
    { value: "201-1000", label: "201-1000" },
    { value: "1000+", label: "1000+" },
];

function CompanySetup() {
    const { user, refreshMemberships } = useAuth();
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [industry, setIndustry] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [size, setSize] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!user) {
        return (
            <div className="companies-empty-page">
                <h1>You're not signed in.</h1>
                <p>
                    <Link to="/login" className="link-gold">Log in</Link> to create a company.
                </p>
            </div>
        );
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!companyName.trim()) {
            setError("Company name is required.");
            return;
        }
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${API_BASE}/api/companies`,
                {
                    companyName,
                    description,
                    industry,
                    companyWebsite,
                    companyLocation,
                    logoUrl,
                    size,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const company = res.data.data.company;
            refreshMemberships();
            navigate(`/company/${company._id}`);
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to create company.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="companies-page">
            <header className="companies-header">
                <h1>Create a company</h1>
            </header>

            <section className="companies-card">
                <form onSubmit={onSubmit}>
                    <div className="companies-grid">
                        <div className="companies-field companies-field-full">
                            <label className="companies-label" htmlFor="companyName">
                                Company name *
                            </label>
                            <input
                                id="companyName"
                                className="companies-input"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Acme Inc."
                                required
                            />
                        </div>

                        <div className="companies-field companies-field-full">
                            <label className="companies-label" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="companies-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What does your company do?"
                            />
                        </div>

                        <div className="companies-field">
                            <label className="companies-label" htmlFor="industry">Industry</label>
                            <input
                                id="industry"
                                className="companies-input"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                placeholder="e.g. Technology"
                            />
                        </div>

                        <div className="companies-field">
                            <label className="companies-label" htmlFor="size">Company size</label>
                            <select
                                id="size"
                                className="companies-select"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            >
                                {SIZE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="companies-field">
                            <label className="companies-label" htmlFor="companyWebsite">
                                Website
                            </label>
                            <input
                                id="companyWebsite"
                                className="companies-input"
                                value={companyWebsite}
                                onChange={(e) => setCompanyWebsite(e.target.value)}
                                placeholder="https://"
                            />
                        </div>

                        <div className="companies-field">
                            <label className="companies-label" htmlFor="companyLocation">
                                Location
                            </label>
                            <input
                                id="companyLocation"
                                className="companies-input"
                                value={companyLocation}
                                onChange={(e) => setCompanyLocation(e.target.value)}
                                placeholder="Albany, NY"
                            />
                        </div>

                        <div className="companies-field companies-field-full">
                            <label className="companies-label" htmlFor="logoUrl">Logo URL</label>
                            <input
                                id="logoUrl"
                                className="companies-input"
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                placeholder="https://"
                            />
                        </div>
                    </div>

                    {error && <div className="companies-alert">{error}</div>}

                    <div className="companies-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Creating…" : "Create company"}
                        </button>
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={() => navigate("/companies")}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default CompanySetup;
