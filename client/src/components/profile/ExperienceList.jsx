import { useEffect, useState } from "react";
import useProfileSave from "../../hooks/useProfileSave";

const EMPTY_ROW = {
    title: "",
    company: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
};

const TYPE_OPTIONS = [
    { value: "", label: "-" },
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "internship", label: "Internship" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
];

function typeLabel(value) {
    return TYPE_OPTIONS.find((o) => o.value === value)?.label || "";
}

function ExperienceList({ experience, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [rows, setRows] = useState(experience || []);
    const { save, saving, error } = useProfileSave(onSaved);

    useEffect(() => { setRows(experience || []); }, [experience]);

    const updateRow = (i, patch) =>
        setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

    const addRow = () => setRows([...rows, { ...EMPTY_ROW }]);
    const removeRow = (i) => setRows(rows.filter((_, j) => j !== i));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await save({ experience: rows });
            setEditing(false);
        } catch (err) {
            console.error("save failed", err);
        }
    };

    const cancel = () => {
        setEditing(false);
        setRows(experience || []);
    };

    return (
        <section className="profile-card">
            <header className="profile-card-header">
                <h2>Experience</h2>
                {!editing && (
                    <button className="btn-outline" onClick={() => setEditing(true)}>Edit</button>
                )}
            </header>

            {editing ? (
                <form onSubmit={onSubmit}>
                    {rows.map((row, i) => (
                        <div key={i} className="profile-row">
                            <div className="profile-grid">
                                <div className="profile-field">
                                    <label className="profile-label">Title</label>
                                    <input
                                        className="profile-input"
                                        value={row.title}
                                        onChange={(e) => updateRow(i, { title: e.target.value })}
                                        placeholder="Software Engineer Intern"
                                    />
                                </div>
                                <div className="profile-field">
                                    <label className="profile-label">Company</label>
                                    <input
                                        className="profile-input"
                                        value={row.company}
                                        onChange={(e) => updateRow(i, { company: e.target.value })}
                                        placeholder="TechNova"
                                    />
                                </div>
                                <div className="profile-field">
                                    <label className="profile-label">Type</label>
                                    <select
                                        className="profile-select"
                                        value={row.employmentType}
                                        onChange={(e) => updateRow(i, { employmentType: e.target.value })}
                                    >
                                        {TYPE_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="profile-field">
                                    <label className="profile-label">Location</label>
                                    <input
                                        className="profile-input"
                                        value={row.location}
                                        onChange={(e) => updateRow(i, { location: e.target.value })}
                                        placeholder="Albany, NY"
                                    />
                                </div>
                                <div className="profile-field">
                                    <label className="profile-label">Start date</label>
                                    <input
                                        type="date"
                                        className="profile-input"
                                        value={row.startDate}
                                        onChange={(e) => updateRow(i, { startDate: e.target.value })}
                                    />
                                </div>
                                <div className="profile-field">
                                    <label className="profile-label">End date</label>
                                    <input
                                        type="date"
                                        className="profile-input"
                                        value={row.endDate}
                                        disabled={row.current}
                                        onChange={(e) => updateRow(i, { endDate: e.target.value })}
                                    />
                                </div>
                                <div className="profile-field profile-grid-full">
                                    <label className="profile-checkbox-row">
                                        <input
                                            type="checkbox"
                                            checked={row.current}
                                            onChange={(e) =>
                                                updateRow(i, {
                                                    current: e.target.checked,
                                                    endDate: e.target.checked ? "" : row.endDate,
                                                })
                                            }
                                        />
                                        <span>I currently work here</span>
                                    </label>
                                </div>
                                <div className="profile-field profile-grid-full">
                                    <label className="profile-label">Description</label>
                                    <textarea
                                        className="profile-textarea"
                                        value={row.description}
                                        onChange={(e) => updateRow(i, { description: e.target.value })}
                                        placeholder="What did you build?"
                                    />
                                </div>
                            </div>
                            <div className="profile-row-actions">
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={() => removeRow(i)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" className="profile-add" onClick={addRow}>
                        + Add experience
                    </button>

                    {error && <div className="profile-alert">{error}</div>}
                    <div className="profile-actions">
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? "Saving…" : "Save"}
                        </button>
                        <button type="button" className="btn-outline" onClick={cancel}>Cancel</button>
                    </div>
                </form>
            ) : experience && experience.length > 0 ? (
                experience.map((x, i) => (
                    <div key={i} className="profile-row-view">
                        <div className="profile-value">
                            <strong>{x.title || "-"}</strong>
                            {x.company && <span> · {x.company}</span>}
                        </div>
                        {(x.employmentType || x.location) && (
                            <div className="profile-muted">
                                {typeLabel(x.employmentType)}
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
                            <div className="profile-value" style={{ marginTop: 6 }}>{x.description}</div>
                        )}
                    </div>
                ))
            ) : (
                <div className="profile-empty-text">No experience added yet.</div>
            )}
        </section>
    );
}

export default ExperienceList;
