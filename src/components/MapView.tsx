
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProperties } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProperty {
  id: number;
  name: string;
  developer: string;
  lat: number;
  lng: number;
  price_range: string;
  type: string;
  city: string;
  rera_status: 'Registered' | 'Pending';
  status: 'Ready' | 'Under Construction';
  thumbnail: string;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
}

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const navigate = useNavigate();

  // Convert mock properties to map format
  const mapProperties: MapProperty[] = mockProperties.map((prop, index) => ({
    id: prop.id,
    name: `${prop.builder} ${prop.type}`,
    developer: prop.builder,
    lat: 28.6139 + (Math.random() - 0.5) * 0.5, // Delhi area with random offset
    lng: 77.2090 + (Math.random() - 0.5) * 0.5,
    price_range: prop.price,
    type: prop.type,
    city: prop.address.split(',').pop()?.trim() || 'Delhi',
    rera_status: Math.random() > 0.3 ? 'Registered' : 'Pending',
    status: Math.random() > 0.4 ? 'Under Construction' : 'Ready',
    thumbnail: prop.image || prop.images?.[0] || '',
    beds: prop.beds,
    baths: prop.baths,
    sqft: prop.sqft,
    address: prop.address
  }));

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    const map = L.map(mapContainer.current).setView([20.5937, 78.9629], 5); // India center
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create marker cluster group
    const markers = L.markerClusterGroup();
    markersRef.current = markers;

    // Add markers for each property
    mapProperties.forEach((property) => {
      const marker = L.marker([property.lat, property.lng]);
      
      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <img src="${property.thumbnail}" alt="${property.name}" class="w-full h-24 object-cover rounded mb-2" />
          <h3 class="font-semibold text-lg mb-1">${property.name}</h3>
          <p class="text-sm text-gray-600 mb-1">${property.developer}</p>
          <p class="text-sm text-gray-600 mb-2">${property.city}</p>
          <div class="flex gap-2 mb-2">
            <span class="px-2 py-1 text-xs rounded ${property.rera_status === 'Registered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">${property.rera_status}</span>
            <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">${property.status}</span>
          </div>
          <div class="text-lg font-bold text-blue-600 mb-2">${property.price_range}</div>
          <button onclick="window.viewPropertyDetails(${property.id})" class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Details
          </button>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markers.addLayer(marker);
    });

    map.addLayer(markers);

    // Add global function for property details
    (window as any).viewPropertyDetails = (id: number) => {
      navigate(`/property/${id}`);
    };

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      delete (window as any).viewPropertyDetails;
    };
  }, [navigate]);

  const handleViewDetails = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  const handlePropertySelect = (property: MapProperty) => {
    setSelectedProperty(property);
    if (mapRef.current) {
      mapRef.current.setView([property.lat, property.lng], 15);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Map and Property List */}
      <div className="flex-1 flex">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />
        </div>

        {/* Property List Panel - Desktop Only */}
        <div className="hidden lg:block w-80 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Properties ({mapProperties.length})</h3>
            <div className="space-y-4">
              {mapProperties.map((property) => (
                <div
                  key={property.id}
                  className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePropertySelect(property)}
                >
                  <img
                    src={property.thumbnail}
                    alt={property.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <h4 className="font-medium text-sm mb-1">{property.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{property.city}</p>
                  <div className="flex gap-1 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {property.rera_status}
                    </Badge>
                  </div>
                  <p className="font-semibold text-blue-600 text-sm">{property.price_range}</p>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(property.id);
                    }}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-xs"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
