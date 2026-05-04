import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../css/navbar.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

function Navbar() {
    const { user, logout, membershipsVersion } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [memberships, setMemberships] = useState([]);
    const wrapRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);

    useEffect(() => {
        if (!user) {
            setMemberships([]);
            return;
        }
        const token = localStorage.getItem("token");
        axios
            .get(`${API_BASE}/api/companies/mine`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setMemberships(res.data.data.memberships || []))
            .catch(() => setMemberships([]));
    }, [user, membershipsVersion]);

    const handleLogout = () => {
        setOpen(false);
        logout();
        navigate("/");
    };

    const initial = user?.firstName?.[0]?.toUpperCase() || "?";

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link className="nav-link" to="/">Jobs</Link>
                <Link className="nav-link" to="/jobs">Map</Link>
                <Link className="nav-link" to="/tracker">Tracker</Link>
            </div>

            <div className="nav-center">
                <Link className="logo" to="/">
                    <div className="logo-icon">H</div>
                    <span>HireMe</span>
                </Link>
            </div>

            <div className="nav-right">
                {user ? (
                    <div className="profile-wrap" ref={wrapRef}>
                        <button
                            type="button"
                            className="profile-chip"
                            onClick={() => setOpen((o) => !o)}
                        >
                            <div className="profile-avatar">{initial}</div>
                            <span className="profile-name">{user.firstName}</span>
                        </button>

                        {open && (
                            <div className="profile-dropdown">
                                <div className="profile-email">
                                    Signed in as<br />
                                    <strong>{user.email}</strong>
                                </div>
                                <Link
                                    className="profile-item"
                                    to="/profile"
                                    onClick={() => setOpen(false)}
                                >
                                    My Profile
                                </Link>

                                <div className="profile-section-divider" />
                                <Link
                                    className="profile-section-header"
                                    to="/companies"
                                    onClick={() => setOpen(false)}
                                >
                                    Companies
                                </Link>
                                {memberships.map((m) => (
                                    <Link
                                        key={m.company._id}
                                        className="profile-item profile-subitem"
                                        to={`/company/${m.company._id}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        {m.company.companyName}
                                    </Link>
                                ))}
                                <Link
                                    className="profile-item profile-subitem profile-create"
                                    to="/companies/new"
                                    onClick={() => setOpen(false)}
                                >
                                    + Create a company
                                </Link>

                                <div className="profile-section-divider" />
                                <button
                                    type="button"
                                    className="profile-item profile-logout"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link className="nav-link" to="/login">Log in</Link>
                        <Link to="/signup">
                            <button className="signup-btn">Sign up</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;