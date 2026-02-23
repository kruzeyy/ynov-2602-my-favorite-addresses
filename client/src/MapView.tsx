import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Address } from "./types";
import "leaflet/dist/leaflet.css";

// Fix default icon with Vite/React
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const FRANCE_CENTER: [number, number] = [46.6, 2.4];

function FitBounds({ addresses }: { addresses: Address[] }) {
  const map = useMap();
  useEffect(() => {
    if (addresses.length === 0) return;
    if (addresses.length === 1) {
      map.setView([addresses[0].lat, addresses[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(
      addresses.map((a) => [a.lat, a.lng] as L.LatLngTuple)
    );
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
  }, [map, addresses]);
  return null;
}

interface MapViewProps {
  addresses: Address[];
}

export default function MapView({ addresses }: MapViewProps) {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={FRANCE_CENTER}
        zoom={6}
        className="leaflet-map"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds addresses={addresses} />
        {addresses.map((addr) => (
          <Marker key={addr.id} position={[addr.lat, addr.lng]}>
            <Popup>
              <strong>{addr.name}</strong>
              {addr.description && <><br />{addr.description}</>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
