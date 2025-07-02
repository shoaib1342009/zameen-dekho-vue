
import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockProperties } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

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
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const navigate = useNavigate();

  // Convert mock properties to map format
  const mapProperties: MapProperty[] = mockProperties.map((prop, index) => ({
    id: prop.id,
    name: `${prop.builder} Project ${prop.id}`,
    developer: prop.builder,
    lat: 28.6139 + (Math.random() - 0.5) * 0.5, // Delhi area with random offset
    lng: 77.2090 + (Math.random() - 0.5) * 0.5,
    price_range: prop.price,
    type: prop.type,
    city: prop.address.split(',').pop()?.trim() || 'Delhi',
    rera_status: Math.random() > 0.3 ? 'Registered' : 'Pending',
    status: Math.random() > 0.4 ? 'Under Construction' : 'Ready',
    thumbnail: prop.image,
    beds: prop.beds,
    baths: prop.baths,
    sqft: prop.sqft,
    address: prop.address
  }));

  const filteredProperties = mapProperties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All' || property.city === selectedCity;
    const matchesType = selectedType === 'All' || property.type === selectedType;
    
    return matchesSearch && matchesCity && matchesType;
  });

  const cities = Array.from(new Set(mapProperties.map(p => p.city)));
  const types = Array.from(new Set(mapProperties.map(p => p.type)));

  useEffect(() => {
    if (!mapContainer.current) return;

    // Simple map placeholder (you would integrate actual Mapbox here)
    const mapElement = mapContainer.current;
    mapElement.innerHTML = `
      <div class="w-full h-full bg-gray-100 relative flex items-center justify-center">
        <div class="text-center p-4">
          <h3 class="text-lg font-semibold mb-2">Interactive Map View</h3>
          <p class="text-sm text-gray-600 mb-4">Map integration requires Mapbox API key</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${filteredProperties.slice(0, 6).map(prop => `
              <div class="bg-white p-2 rounded shadow cursor-pointer hover:shadow-md transition-shadow" 
                   onclick="window.selectProperty(${prop.id})">
                <div class="w-full h-16 bg-gray-200 rounded mb-2"></div>
                <div class="text-xs font-medium">${prop.name}</div>
                <div class="text-xs text-gray-600">${prop.city}</div>
                <div class="text-xs font-semibold text-blue-600">${prop.price_range}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Add global function for property selection
    (window as any).selectProperty = (id: number) => {
      const property = mapProperties.find(p => p.id === id);
      if (property) {
        setSelectedProperty(property);
      }
    };

    return () => {
      delete (window as any).selectProperty;
    };
  }, [filteredProperties]);

  const handleViewDetails = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Search and Filters */}
      <div className="p-4 bg-white border-b space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by location or project name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Prices</SelectItem>
              <SelectItem value="low">Under ₹50L</SelectItem>
              <SelectItem value="mid">₹50L - ₹1Cr</SelectItem>
              <SelectItem value="high">Above ₹1Cr</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map and Property List */}
      <div className="flex-1 flex">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Property Info Popup */}
          {selectedProperty && (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
              
              <img
                src={selectedProperty.thumbnail}
                alt={selectedProperty.name}
                className="w-full h-32 object-cover rounded mb-3"
              />
              
              <h3 className="font-semibold text-lg mb-1">{selectedProperty.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedProperty.developer}</p>
              <p className="text-sm text-gray-600 mb-2">{selectedProperty.address}</p>
              
              <div className="flex gap-2 mb-3">
                <Badge variant={selectedProperty.rera_status === 'Registered' ? 'default' : 'secondary'}>
                  {selectedProperty.rera_status}
                </Badge>
                <Badge variant="outline">{selectedProperty.status}</Badge>
              </div>
              
              <div className="text-lg font-bold text-blue-600 mb-3">
                {selectedProperty.price_range}
              </div>
              
              <Button 
                onClick={() => handleViewDetails(selectedProperty.id)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View Details
              </Button>
            </div>
          )}
        </div>

        {/* Property List Panel - Desktop Only */}
        <div className="hidden lg:block w-80 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Properties ({filteredProperties.length})</h3>
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedProperty(property)}
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
