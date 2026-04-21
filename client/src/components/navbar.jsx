import React from "react";
import { Link } from "react-router-dom";


function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link className="nav-link" to="/">Jobs</Link>
                <a className="nav-link" href="#results">Map</a>
                <a className="nav-link" href="#">Saved</a>
                <a className="nav-link" href="#">Tracker</a>
            </div>

            <div className="nav-center">
                <Link className="logo" to="/">
                    <div className="logo-icon">H</div>
                    <span>HireMe</span>
                </Link>
            </div>

            <div className="nav-right">
                <Link className="nav-link" to="/login">Log in</Link>
                <Link to="/signup">
                    <button className="signup-btn">Sign up</button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar

