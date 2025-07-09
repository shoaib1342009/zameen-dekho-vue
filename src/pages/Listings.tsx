
import { useState } from 'react';
import { Grid, Map as MapIcon } from 'lucide-react';
import FilterSection from '@/components/FilterSection';
import PropertyCard from '@/components/PropertyCard';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { useProperty } from '@/contexts/PropertyContext';

const Listings = () => {
  const [selectedBHK, setSelectedBHK] = useState('All');
  const [selectedPropertyType, setSelectedPropertyType] = useState('All');
  const [priceRange, setPriceRange] = useState([10]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  const { properties, loading, error } = useProperty();

  // Filter properties based on selected filters
  const filteredProperties = properties.filter(property => {
    // BHK filter
    const bhkMatch = selectedBHK === 'All' || property.beds.toString() === selectedBHK.charAt(0);
    
    // Property type filter
    const typeMatch = selectedPropertyType === 'All' || property.property_type === selectedPropertyType;
    
    // Price filter (convert to crores for comparison)
    const priceInCr = parseInt(property.price.toString()) / 10000000;
    const priceMatch = priceInCr <= priceRange[0];
    
    // Amenities filter
    const amenitiesMatch = selectedAmenities.length === 0 || 
      selectedAmenities.some(amenity => 
        property.amenities?.some((propAmenity: any) => propAmenity.name === amenity)
      );
    
    return bhkMatch && typeMatch && priceMatch && amenitiesMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading properties: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

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
