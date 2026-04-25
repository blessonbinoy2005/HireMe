import { useEffect, useState } from "react";
import useProfileSave from "./useProfileSave";

const STATUS_OPTIONS = [
    { value: "", label: "-" },
    { value: "student", label: "Student" },
    { value: "new-grad", label: "New grad" },
    { value: "unemployed", label: "Unemployed" },
    { value: "employed", label: "Employed" },
];

function statusLabel(value) {
    return STATUS_OPTIONS.find((o) => o.value === value)?.label || "-";
}

function AboutCard({ profile, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [headline, setHeadline] = useState(profile?.headline || "");
    const [status, setStatus] = useState(profile?.currentStatus || "");
    const { save, saving, error } = useProfileSave(onSaved);

    useEffect(() => {
        setHeadline(profile?.headline || "");
        setStatus(profile?.currentStatus || "");
    }, [profile?.headline, profile?.currentStatus]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await save({ headline, currentStatus: status });
            setEditing(false);
        } catch (err) {
            console.error("save failed", err);
        }
    };

    const cancel = () => {
        setEditing(false);
        setHeadline(profile?.headline || "");
        setStatus(profile?.currentStatus || "");
    };

    return (
        <section className="profile-card">
            <header className="profile-card-header">
                <h2>About</h2>
                {!editing && (
                    <button className="btn-outline" onClick={() => setEditing(true)}>Edit</button>
                )}
            </header>

            {editing ? (
                <form onSubmit={onSubmit}>
                    <div className="profile-grid">
                        <div className="profile-field profile-grid-full">
                            <label className="profile-label" htmlFor="headline">Headline</label>
                            <input
                                id="headline"
                                className="profile-input"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                placeholder="e.g. Aspiring Software Engineer"
                            />
                        </div>
                        <div className="profile-field profile-grid-full">
                            <label className="profile-label" htmlFor="currentStatus">Current status</label>
                            <select
                                id="currentStatus"
                                className="profile-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {error && <div className="profile-alert">{error}</div>}
                    <div className="profile-actions">
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? "Saving…" : "Save"}
                        </button>
                        <button type="button" className="btn-outline" onClick={cancel}>Cancel</button>
                    </div>
                </form>
            ) : (
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
            )}
        </section>
    );
}

export default AboutCard;
