import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AboutCard from "../components/profile/AboutCard";
import LocationCard from "../components/profile/LocationCard";
import ContactCard from "../components/profile/ContactCard";
import EducationList from "../components/profile/EducationList";
import ExperienceList from "../components/profile/ExperienceList";
import SkillsList from "../components/profile/SkillsList";
import "../css/profile.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const token = localStorage.getItem("token");
        axios
            .get(`${API_BASE}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setProfile(res.data.data.profile))
            .catch((err) => setLoadError(err.response?.data?.error?.message || "Failed to load profile."))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <div className="profile-empty-page">
                <h1>You're not signed in.</h1>
                <p><Link to="/login" className="link-gold">Log in</Link> to view your profile.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="profile-empty-page"><p>Loading…</p></div>;
    }

    const handleSaved = (updated) => setProfile(updated);

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>My Profile</h1>
            </header>

            {loadError && <div className="profile-alert">{loadError}</div>}

            <section className="profile-card">
                <header className="profile-card-header">
                    <h2>Account</h2>
                </header>
                <div className="profile-grid">
                    <div className="profile-field">
                        <div className="profile-label">Name</div>
                        <div className="profile-value">{user.firstName} {user.lastName}</div>
                    </div>
                    <div className="profile-field">
                        <div className="profile-label">Email</div>
                        <div className="profile-value">{user.email}</div>
                    </div>
                    <div className="profile-field">
                        <div className="profile-label">Role</div>
                        <div className="profile-value">{user.role}</div>
                    </div>
                </div>
            </section>

            <AboutCard profile={profile} onSaved={handleSaved} />
            <LocationCard profile={profile} onSaved={handleSaved} />
            <ContactCard profile={profile} onSaved={handleSaved} />
            <EducationList education={profile?.education || []} onSaved={handleSaved} />
            <ExperienceList experience={profile?.experience || []} onSaved={handleSaved} />
            <SkillsList skills={profile?.skills || []} onSaved={handleSaved} />
        </div>
    );
}

export default Profile;
