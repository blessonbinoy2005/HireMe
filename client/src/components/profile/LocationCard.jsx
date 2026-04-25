import { useEffect, useState } from "react";
import useProfileSave from "../../hooks/useProfileSave";
import COUNTRIES from "../../utils/countries";

function LocationCard({ profile, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [city, setCity] = useState(profile?.locationCity || "");
    const [country, setCountry] = useState(profile?.country || "");
    const [zip, setZip] = useState(profile?.zipCode || "");
    const { save, saving, error } = useProfileSave(onSaved);

    useEffect(() => {
        setCity(profile?.locationCity || "");
        setCountry(profile?.country || "");
        setZip(profile?.zipCode || "");
    }, [profile?.locationCity, profile?.country, profile?.zipCode]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await save({ locationCity: city, country, zipCode: zip });
            setEditing(false);
        } catch {}
    };

    const cancel = () => {
        setEditing(false);
        setCity(profile?.locationCity || "");
        setCountry(profile?.country || "");
        setZip(profile?.zipCode || "");
    };

    return (
        <section className="profile-card">
            <header className="profile-card-header">
                <h2>Location</h2>
                {!editing && (
                    <button className="btn-outline" onClick={() => setEditing(true)}>Edit</button>
                )}
            </header>

            {editing ? (
                <form onSubmit={onSubmit}>
                    <div className="profile-grid">
                        <div className="profile-field">
                            <label className="profile-label" htmlFor="locationCity">City</label>
                            <input
                                id="locationCity"
                                className="profile-input"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Albany"
                            />
                        </div>
                        <div className="profile-field">
                            <label className="profile-label" htmlFor="country">Country / Region</label>
                            <select
                                id="country"
                                className="profile-select"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                <option value="">— Select country —</option>
                                {COUNTRIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="profile-field profile-grid-full">
                            <label className="profile-label" htmlFor="zipCode">ZIP / Postal code</label>
                            <input
                                id="zipCode"
                                className="profile-input"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                placeholder="12203"
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
                    <div className="profile-field">
                        <div className="profile-label">City</div>
                        <div className="profile-value">{profile?.locationCity || "—"}</div>
                    </div>
                    <div className="profile-field">
                        <div className="profile-label">Country / Region</div>
                        <div className="profile-value">{profile?.country || "—"}</div>
                    </div>
                    <div className="profile-field profile-grid-full">
                        <div className="profile-label">ZIP / Postal code</div>
                        <div className="profile-value">{profile?.zipCode || "—"}</div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default LocationCard;
