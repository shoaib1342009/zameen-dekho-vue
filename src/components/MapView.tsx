
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProperties } from '@/data/mockData';
import { useProperty } from '@/contexts/PropertyContext';
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
  id: string; // Changed to string to match Supabase UUID
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

// Location coordinates for Mumbai areas
const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  'Andheri West': { lat: 19.1334, lng: 72.8267 },
  'Panvel': { lat: 18.9894, lng: 73.1113 },
  'Ulwe': { lat: 18.9515, lng: 73.0374 },
  'Uran': { lat: 18.8773, lng: 72.9386 },
  'Colaba': { lat: 18.9067, lng: 72.8147 },
  'Kurla': { lat: 19.0728, lng: 72.8826 },
  'Seawoods': { lat: 19.0197, lng: 73.0169 },
  'Rasayni': { lat: 18.9064, lng: 73.0033 },
  'Taloja': { lat: 19.0518, lng: 73.1040 }
};

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const navigate = useNavigate();
  const { getAllProperties } = useProperty();

  // Get all properties (mock + user added)
  const allProperties = [...mockProperties, ...getAllProperties()];

  // Convert properties to map format
  const mapProperties: MapProperty[] = allProperties.map((prop) => {
    // Handle both location and address properties safely
    const locationKey = ('location' in prop && prop.location) || prop.address.split(',')[0];
    const coordinates = locationCoordinates[locationKey] || { lat: 19.0760 + (Math.random() - 0.5) * 0.1, lng: 72.8777 + (Math.random() - 0.5) * 0.1 };
    
    // Handle different property types from mock data vs Supabase
    const getPropertyType = (property: any) => {
      if ('property_type' in property) return property.property_type;
      if ('type' in property) return property.type;
      return 'Property';
    };

    const getPropertyImage = (property: any) => {
      if ('cover_image_url' in property && property.cover_image_url) return property.cover_image_url;
      if ('images' in property && property.images && property.images.length > 0) return property.images[0];
      if ('image' in property && property.image) return property.image;
      return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';
    };
    
    return {
      id: prop.id.toString(), // Convert to string
      name: `${prop.builder} ${getPropertyType(prop)}`,
      developer: prop.builder,
      lat: coordinates.lat + (Math.random() - 0.5) * 0.01, // Small random offset
      lng: coordinates.lng + (Math.random() - 0.5) * 0.01,
      price_range: prop.price.toString(),
      type: getPropertyType(prop),
      city: ('location' in prop && prop.location) || prop.address.split(',').pop()?.trim() || 'Mumbai',
      rera_status: Math.random() > 0.3 ? 'Registered' : 'Pending',
      status: Math.random() > 0.4 ? 'Under Construction' : 'Ready',
      thumbnail: getPropertyImage(prop),
      beds: prop.beds,
      baths: prop.baths,
      sqft: prop.sqft,
      address: prop.address
    };
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on Mumbai
    const map = L.map(mapContainer.current).setView([19.0760, 72.8777], 11);
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
          <div class="text-lg font-bold text-blue-600 mb-2">₹${parseInt(property.price_range).toLocaleString()}</div>
          <button onclick="window.viewPropertyDetails('${property.id}')" class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Details
          </button>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markers.addLayer(marker);
    });

    map.addLayer(markers);

    // Add global function for property details
    (window as any).viewPropertyDetails = (id: string) => {
      navigate(`/property/${id}`);
    };

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      delete (window as any).viewPropertyDetails;
    };
  }, [navigate, mapProperties.length]);

  const handleViewDetails = (propertyId: string) => {
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
                  <p className="font-semibold text-blue-600 text-sm">₹{parseInt(property.price_range).toLocaleString()}</p>
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
