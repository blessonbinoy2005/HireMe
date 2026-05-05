import { useEffect, useState } from "react";
import useProfileSave from "./useProfileSave";

function SkillsList({ skills, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [items, setItems] = useState(skills || []);
    const [draft, setDraft] = useState("");
    const { save, saving, error } = useProfileSave(onSaved);

    useEffect(() => { setItems(skills || []); }, [skills]);

    const addSkill = () => {
        const trimmed = draft.trim();
        if (!trimmed) return;
        let exists = false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].toLowerCase() === trimmed.toLowerCase()) {
                exists = true;
                break;
            }
        }
        if (exists) {
            setDraft("");
            return;
        }
        setItems([...items, trimmed]);
        setDraft("");
    };

    const removeSkill = (i) => {
        const next = [];
        for (let j = 0; j < items.length; j++) {
            if (j !== i) next.push(items[j]);
        }
        setItems(next);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await save({ skills: items });
            setEditing(false);
            setDraft("");
        } catch (err) {
            console.error("save failed", err);
        }
    };

    const cancel = () => {
        setEditing(false);
        setItems(skills || []);
        setDraft("");
    };

    return (
        <section className="profile-card">
            <header className="profile-card-header">
                <h2>Skills</h2>
                {!editing && (
                    <button className="btn-outline" onClick={() => setEditing(true)}>Edit</button>
                )}
            </header>

            {editing ? (
                <form onSubmit={onSubmit}>
                    <div className="profile-grid">
                        <div className="profile-field profile-grid-full">
                            <label className="profile-label">Add a skill</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    className="profile-input"
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder="e.g. React, then press Enter"
                                />
                                <button type="button" className="btn-outline" onClick={addSkill}>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {items.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                            {items.map((s, i) => (
                                <span key={i} className="profile-chip">
                                    {s}
                                    <button
                                        type="button"
                                        className="profile-chip-remove"
                                        onClick={() => removeSkill(i)}
                                        aria-label={`Remove ${s}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {error && <div className="profile-alert">{error}</div>}
                    <div className="profile-actions">
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? "Saving…" : "Save"}
                        </button>
                        <button type="button" className="btn-outline" onClick={cancel}>Cancel</button>
                    </div>
                </form>
            ) : (skills || []).length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skills.map((s, i) => (
                        <span key={i} className="profile-chip">{s}</span>
                    ))}
                </div>
            ) : (
                <div className="profile-empty-text">No skills added yet.</div>
            )}
        </section>
    );
}

export default SkillsList;
