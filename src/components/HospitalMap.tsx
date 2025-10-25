import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Phone, X, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Hospital {
  name: string;
  address: string;
  distance: string;
  phone: string;
  latitude: number;
  longitude: number;
}

interface HospitalMapProps {
  onClose: () => void;
}

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Auto-fit markers
function FitBounds({
  hospitals,
  userLocation,
}: {
  hospitals: { latitude: number; longitude: number }[];
  userLocation?: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!map || hospitals.length === 0) return;
    const bounds = L.latLngBounds([]);
    hospitals.forEach((h) => bounds.extend([h.latitude, h.longitude]));
    if (userLocation) bounds.extend([userLocation.lat, userLocation.lng]);
    map.flyToBounds(bounds, { padding: [50, 50] });
  }, [map, hospitals, userLocation]);
  return null;
}

// Distance helper
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

// Convert city to coordinates using Nominatim
async function fetchCoordinates(city: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    city
  )}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

// Fetch hospitals from Overpass API, only with address
async function fetchNearbyHospitals(location: { lat: number; lng: number }) {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${location.lat},${location.lng});
      node["amenity"="clinic"](around:5000,${location.lat},${location.lng});
    );
    out body;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url);
  const data = await res.json();

  const hospitals: Hospital[] = data.elements
    .map((el: any) => ({
      name: el.tags.name || "Unnamed Hospital",
      address:
        el.tags["addr:full"] ||
        (el.tags["addr:housenumber"] && el.tags["addr:street"]
          ? `${el.tags["addr:housenumber"]} ${el.tags["addr:street"]}`
          : ""),
      distance: `${getDistanceKm(location.lat, location.lng, el.lat, el.lon)} km`,
      phone: el.tags.phone || el.tags["contact:phone"] || "",
      latitude: el.lat,
      longitude: el.lon,
    }))
    .filter((h) => h.address); // Only include hospitals with address

  return hospitals;
}

export default function HospitalMap({ onClose }: HospitalMapProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [activeHospitalIndex, setActiveHospitalIndex] = useState<number | null>(null);
  const [manualCity, setManualCity] = useState("");
  const mapRef = useRef<L.Map | null>(null);
  const hospitalRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          const fetched = await fetchNearbyHospitals(loc);
          setHospitals(fetched);
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  const handleManualSearch = async () => {
    if (!manualCity) return;
    setLoading(true);
    const coords = await fetchCoordinates(manualCity);
    if (!coords) {
      alert("Could not find that location");
      setLoading(false);
      return;
    }
    setUserLocation(coords);
    const fetched = await fetchNearbyHospitals(coords);
    setHospitals(fetched);
    setLoading(false);
  };

  const openInMaps = (hospital: Hospital) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-400 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Nearby Hospitals</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
              <p className="text-gray-600">Finding hospitals near you...</p>
            </div>
          ) : (
            <>
              {!userLocation && (
                <div className="mb-6 flex flex-col md:flex-row gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Enter your city..."
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="border p-2 rounded flex-1"
                  />
                  <button
                    onClick={handleManualSearch}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Search
                  </button>
                </div>
              )}

              {userLocation && hospitals.length === 0 && (
                <p className="text-gray-600 text-center py-12">
                  No hospitals with address information found nearby.
                </p>
              )}

              {userLocation && hospitals.length > 0 && (
                <>
                  {/* Map */}
                  <div className="w-full h-96 mb-6 rounded-2xl overflow-hidden shadow-lg border border-green-100">
                    <MapContainer
                      center={[userLocation.lat, userLocation.lng]}
                      zoom={14}
                      whenCreated={(map) => (mapRef.current = map)}
                      className="w-full h-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap contributors"
                      />
                      <FitBounds hospitals={hospitals} userLocation={userLocation} />

                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={L.icon({
                          iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
                          iconSize: [32, 32],
                          iconAnchor: [16, 32],
                        })}
                      >
                        <Popup>You are here</Popup>
                      </Marker>

                      {hospitals.map((h, i) => (
                        <Marker
                          key={i}
                          position={[h.latitude, h.longitude]}
                          icon={L.icon({
                            iconUrl:
                              activeHospitalIndex === i
                                ? "https://cdn-icons-png.flaticon.com/512/190/190411.png"
                                : "https://cdn-icons-png.flaticon.com/512/854/854878.png",
                            iconSize: [32, 32],
                            iconAnchor: [16, 32],
                          })}
                          eventHandlers={{
                            click: () => {
                              setActiveHospitalIndex(i);
                              hospitalRefs.current[i]?.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              hospitalRefs.current[i]?.classList.add("ring-4", "ring-green-300");
                              setTimeout(() => {
                                hospitalRefs.current[i]?.classList.remove(
                                  "ring-4",
                                  "ring-green-300"
                                );
                              }, 1500);
                            },
                          }}
                        >
                          <Popup>
                            <strong>{h.name}</strong>
                            <br />
                            {h.address}
                            <br />
                            {h.phone && <>📞 {h.phone}</>}
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>

                  {/* Hospital List */}
                  <div className="space-y-4">
                    {hospitals.map((hospital, index) => (
                      <div
                        key={index}
                        ref={(el) => (hospitalRefs.current[index] = el)}
                        onClick={() => {
                          setActiveHospitalIndex(index);
                          mapRef.current?.flyTo([hospital.latitude, hospital.longitude], 16, {
                            duration: 1.2,
                          });
                        }}
                        className={`bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
                          activeHospitalIndex === index ? "ring-2 ring-green-400" : ""
                        }`}
                        style={{
                          animation: `fadeInUp 0.5s ease-out forwards`,
                          animationDelay: `${index * 0.1}s`,
                          opacity: 0,
                        }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {hospital.name}
                            </h3>
                            <p className="text-gray-600 mb-1 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-500" />
                              {hospital.address}
                            </p>
                            {hospital.phone && (
                              <p className="text-gray-600 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-500" />
                                {hospital.phone}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-full text-sm">
                              {hospital.distance}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openInMaps(hospital);
                              }}
                              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                              <Navigation className="w-4 h-4" />
                              Get Directions
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
