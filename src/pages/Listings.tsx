
import { useState } from 'react';
import { Grid, Map as MapIcon } from 'lucide-react';
import FilterSection from '@/components/FilterSection';
import PropertyCard from '@/components/PropertyCard';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/data/mockData';
import { useProperty } from '@/contexts/PropertyContext';

const Listings = () => {
  const [selectedBHK, setSelectedBHK] = useState('1 BHK');
  const [selectedPropertyType, setSelectedPropertyType] = useState('Apartment/Flat');
  const [priceRange, setPriceRange] = useState([2.55]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  const { getAllProperties } = useProperty();
  const allProperties = getAllProperties();

  // Combine mock properties with user properties
  const combinedProperties = [...mockProperties, ...allProperties];

  // More flexible filter logic
  const filteredProperties = combinedProperties.filter(property => {
    // BHK filter - make it more flexible
    let bhkMatch = true;
    if (selectedBHK && selectedBHK !== 'All') {
      const selectedBeds = parseInt(selectedBHK.charAt(0));
      bhkMatch = property.beds === selectedBeds;
    }
    
    // Property type filter - make it more flexible
    let typeMatch = true;
    if (selectedPropertyType && selectedPropertyType !== 'All') {
      typeMatch = property.type === selectedPropertyType;
    }
    
    // Price filter - convert to consistent format and make more flexible
    let priceMatch = true;
    if (priceRange && priceRange.length > 0) {
      const propertyPrice = parseInt(property.price) || 0;
      const maxPriceInRupees = priceRange[0] * 10000000; // Convert Cr to rupees
      priceMatch = propertyPrice <= maxPriceInRupees;
    }
    
    // Amenities filter - only filter if amenities are selected
    let amenitiesMatch = true;
    if (selectedAmenities && selectedAmenities.length > 0 && property.amenities) {
      amenitiesMatch = selectedAmenities.some(amenity => 
        property.amenities?.includes(amenity)
      );
    }
    
    return bhkMatch && typeMatch && priceMatch && amenitiesMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-3 sm:space-y-4">
        {/* Filter Section */}
        <FilterSection
          selectedBHK={selectedBHK}
          setSelectedBHK={setSelectedBHK}
          selectedPropertyType={selectedPropertyType}
          setSelectedPropertyType={setSelectedPropertyType}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Available Properties
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">
              {filteredProperties.length} properties found
            </span>
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2 px-3 py-1.5"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2 px-3 py-1.5"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Based on View Mode */}
        {viewMode === 'grid' ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {filteredProperties.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-muted-foreground">No properties match your filters. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <MapView />
        )}
      </div>
    </div>
  );
};

export default Listings;
