import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../services/api';

export default function NearbyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [center, setCenter] = useState([12.9716, 77.5946]); // default

  const fetchNearby = async () => {
    try {
      const { data } = await api.get('/admin/complaints'); 
      const valid = (data.complaints || []).filter(c => c.location && c.location.coordinates);
      setComplaints(valid);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter([lat, lng]);
        fetchNearby(lat, lng);
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nearby Complaints</h1>
      <div className="h-[500px] rounded-xl overflow-hidden border border-gray-200 z-0 relative">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {complaints.map(c => (
            <Marker key={c._id} position={[c.location.coordinates[1], c.location.coordinates[0]]}>
              <Popup>
                <strong>{c.title}</strong><br/>
                Status: {c.status}<br/>
                Priority: {c.priority}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
