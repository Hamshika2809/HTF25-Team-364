import { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, X, Loader2 } from 'lucide-react';

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

export default function HospitalMap({ onClose }: HospitalMapProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          fetchNearbyHospitals(location);
        },
        () => {
          setLoading(false);
          setHospitals(getMockHospitals());
        }
      );
    } else {
      setLoading(false);
      setHospitals(getMockHospitals());
    }
  }, []);

  const fetchNearbyHospitals = async (location: { lat: number; lng: number }) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setHospitals(getMockHospitals());
    setLoading(false);
  };

  const getMockHospitals = (): Hospital[] => [
    {
      name: 'City General Hospital',
      address: '123 Main Street, Downtown',
      distance: '0.8 km',
      phone: '+1 (555) 123-4567',
      latitude: 40.7128,
      longitude: -74.006,
    },
    {
      name: 'St. Mary\'s Medical Center',
      address: '456 Oak Avenue, Midtown',
      distance: '1.2 km',
      phone: '+1 (555) 234-5678',
      latitude: 40.7138,
      longitude: -74.007,
    },
    {
      name: 'Memorial Hospital',
      address: '789 Elm Street, Uptown',
      distance: '2.1 km',
      phone: '+1 (555) 345-6789',
      latitude: 40.7148,
      longitude: -74.008,
    },
    {
      name: 'Community Health Clinic',
      address: '321 Pine Road, Westside',
      distance: '2.5 km',
      phone: '+1 (555) 456-7890',
      latitude: 40.7158,
      longitude: -74.009,
    },
  ];

  const openInMaps = (hospital: Hospital) => {
    const query = encodeURIComponent(hospital.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
              <p className="text-gray-600">Finding hospitals near you...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hospitals.map((hospital, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{
                    animation: `fadeInUp 0.5s ease-out forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{hospital.name}</h3>
                      <p className="text-gray-600 mb-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-500" />
                        {hospital.address}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-500" />
                        {hospital.phone}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-full text-sm">
                        {hospital.distance}
                      </span>
                      <button
                        onClick={() => openInMaps(hospital)}
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
          )}
        </div>
      </div>
    </div>
  );
}
