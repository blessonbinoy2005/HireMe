import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);

    const handleLogout = () => {
        setOpen(false);
        logout();
        navigate("/");
    };

    const initial = user?.firstName?.[0]?.toUpperCase() || "?";

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link className="nav-link" to="/">Home</Link>
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