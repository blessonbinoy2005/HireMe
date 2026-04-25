import { useEffect, useState } from "react";
import useProfileSave from "../../hooks/useProfileSave";

function ContactCard({ profile, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [phone, setPhone] = useState(profile?.phoneNumber || "");
    const [resume, setResume] = useState(profile?.resume || "");
    const { save, saving, error } = useProfileSave(onSaved);

    useEffect(() => {
        setPhone(profile?.phoneNumber || "");
        setResume(profile?.resume || "");
    }, [profile?.phoneNumber, profile?.resume]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await save({ phoneNumber: phone, resume });
            setEditing(false);
        } catch (err) {
            console.error("save failed", err);
        }
    };

    const cancel = () => {
        setEditing(false);
        setPhone(profile?.phoneNumber || "");
        setResume(profile?.resume || "");
    };

    return (
        <section className="profile-card">
            <header className="profile-card-header">
                <h2>Contact &amp; Resume</h2>
                {!editing && (
                    <button className="btn-outline" onClick={() => setEditing(true)}>Edit</button>
                )}
            </header>

            {editing ? (
                <form onSubmit={onSubmit}>
                    <div className="profile-grid">
                        <div className="profile-field profile-grid-full">
                            <label className="profile-label" htmlFor="phoneNumber">Phone number</label>
                            <input
                                id="phoneNumber"
                                className="profile-input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(518) 555-1234"
                            />
                        </div>
                        <div className="profile-field profile-grid-full">
                            <label className="profile-label" htmlFor="resume">Resume URL</label>
                            <input
                                id="resume"
                                className="profile-input"
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                                placeholder="https://…"
                            />
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
                        <div className="profile-label">Phone number</div>
                        <div className="profile-value">{profile?.phoneNumber || "-"}</div>
                    </div>
                    <div className="profile-field profile-grid-full">
                        <div className="profile-label">Resume</div>
                        <div className="profile-value">
                            {profile?.resume ? (
                                <a href={profile.resume} target="_blank" rel="noreferrer" className="link-gold">
                                    {profile.resume}
                                </a>
                            ) : (
                                "-"
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ContactCard;
