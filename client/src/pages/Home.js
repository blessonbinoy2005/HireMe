import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css"


function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/jobs?keyword=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search jobs, companies, or locations"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default Home;