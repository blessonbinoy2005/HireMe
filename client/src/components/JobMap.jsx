import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function JobMap() {
  return (
    <div style={{ height: "500px" }}>
      <MapContainer
        center={[42.6526, -73.7562]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[42.6526, -73.7562]}>
          <Popup>Albany, NY</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default JobMap;