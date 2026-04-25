import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function JobMap({ jobs }) {
  return (
    <MapContainer
      center={[42.6526, -73.7562]}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {jobs
        .filter((job) => job.latitude && job.longitude)
        .map((job) => (
          <Marker key={job._id} position={[job.latitude, job.longitude]}>
            <Popup>
              <div className="map-job-card">
                <h3>{job.jobTitle}</h3>

                <p className="map-company">{job.companyName}</p>
                <p className="map-location">📍 {job.address}</p>

                <p className="map-salary">{job.salaryRange}</p>

                <p className="map-description">
                  {job.jobDescription?.length > 100
                    ? job.jobDescription.substring(0, 100) + "..."
                    : job.jobDescription}
                </p>

                {job.employmentType && (
                  <span className="map-tag">{job.employmentType}</span>
                )}

                <a
                  href={job.applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="map-apply-btn"
                >
                  Apply
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export default JobMap;