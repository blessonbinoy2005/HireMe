import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) {
      navigate("/jobs"); // show all jobs if empty
      return;
    }
    navigate(`/jobs?keyword=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home-container">
      

      <h1 className="home-title">Find Jobs Near You</h1>
      <p className="home-subtitle">
        Explore opportunities on an interactive map
      </p>

    
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search jobs, companies, or locations"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    
      <button className="map-chip" onClick={() => navigate("/jobs")}>
        🗺️ View Jobs on Map
      </button>

    </div>
  );
}

export default Home;