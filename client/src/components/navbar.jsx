import React from "react";


function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-left">
                <a className="nav-link" href="/">Jobs</a>
                <a className="nav-link" href="#results">Map</a>
                <a className="nav-link" href="#">Saved</a>
            </div>
            
            <div className="nav-center">
                <a className="logo" href="/">
                    <div className="logo-icon">H</div>
                    <span>HireMe</span>
                </a>
            </div>
        </nav>
    )
}

export default Navbar

