import { useState } from 'react';
import FilterSection from '@/components/FilterSection';
import PropertyCard from '@/components/PropertyCard';
import { mockProperties } from '@/data/mockData';

const Listings = () => {
  const [selectedBHK, setSelectedBHK] = useState('2 BHK');
  const [priceRange, setPriceRange] = useState([2.55]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Filter properties based on selected filters
  const filteredProperties = mockProperties.filter(property => {
    // BHK filter
    const bhkMatch = selectedBHK === 'All' || property.beds.toString() === selectedBHK.charAt(0);
    
    // Price filter (simplified)
    const priceInCr = parseInt(property.price) / 10000000;
    const priceMatch = priceInCr <= priceRange[0];
    
    return bhkMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 space-y-6">
        {/* Filter Section */}
        <FilterSection
          selectedBHK={selectedBHK}
          setSelectedBHK={setSelectedBHK}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />

        {/* Property Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Available Properties
            </h3>
            <span className="text-sm text-muted-foreground">
              {filteredProperties.length} properties found
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties match your filters. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;