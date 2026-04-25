import { useEffect, useState } from "react";
import useProfileSave from "../../hooks/useProfileSave";

const EMPTY_ROW = {
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
};

function EducationList({ education, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [rows, setRows] = useState(education || []);
    const { save, saving, error } = useProfileSave(onSaved);

    useEffect(() => { setRows(education || []); }, [education]);

    const updateRow = (i, patch) =>
        setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

    const addRow = () => setRows([...rows, { ...EMPTY_ROW }]);
    const removeRow = (i) => setRows(rows.filter((_, j) => j !== i));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await save({ education: rows });
            setEditing(false);
        } catch {}
    };

    const cancel = () => {
        setEditing(false);
        setRows(education || []);
    };

    return (
        <section className="profile-card">
            <header className="profile-card-header">
                <h2>Education</h2>
                {!editing && (
                    <button className="btn-outline" onClick={() => setEditing(true)}>Edit</button>
                )}
            </header>

            {editing ? (
                <form onSubmit={onSubmit}>
                    {rows.map((row, i) => (
                        <div key={i} className="profile-row">
                            <div className="profile-grid">
                                <div className="profile-field profile-grid-full">
                                    <label className="profile-label">School</label>
                                    <input
                                        className="profile-input"
                                        value={row.school}
                                        onChange={(e) => updateRow(i, { school: e.target.value })}
                                        placeholder="University at Albany"
                                    />
                                </div>
                                <div className="profile-field">
                                    <label className="profile-label">Degree</label>
                                    <input
                                        className="profile-input"
                                        value={row.degree}
                                        onChange={(e) => updateRow(i, { degree: e.target.value })}
                                        placeholder="B.S."
                                    />
                                </div>
                                <div className="profile-field">
                                    <label className="profile-label">Field</label>
                                    <input
                                        className="profile-input"
                                        value={row.field}
                                        onChange={(e) => updateRow(i, { field: e.target.value })}
                                        placeholder="Computer Science"
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
                                        <span>Currently studying here</span>
                                    </label>
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
                        + Add education
                    </button>

                    {error && <div className="profile-alert">{error}</div>}
                    <div className="profile-actions">
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? "Saving…" : "Save"}
                        </button>
                        <button type="button" className="btn-outline" onClick={cancel}>Cancel</button>
                    </div>
                </form>
            ) : education && education.length > 0 ? (
                education.map((e, i) => (
                    <div key={i} className="profile-row-view">
                        <div className="profile-value"><strong>{e.school || "—"}</strong></div>
                        {(e.degree || e.field) && (
                            <div className="profile-value">
                                {e.degree}{e.degree && e.field ? ", " : ""}{e.field}
                            </div>
                        )}
                        {(e.startDate || e.endDate || e.current) && (
                            <div className="profile-muted">
                                {e.startDate || "?"} — {e.current ? "Present" : (e.endDate || "?")}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="profile-empty-text">No education added yet.</div>
            )}
        </section>
    );
}

export default EducationList;
