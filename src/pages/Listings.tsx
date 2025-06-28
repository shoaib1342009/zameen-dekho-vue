
import { useState } from 'react';
import FilterSection from '@/components/FilterSection';
import PropertyCard from '@/components/PropertyCard';

const mockProperties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
    label: 'Bright Spaces',
    price: '3715600',
    tag: 'Ready Possession',
    beds: 3,
    baths: 2,
    sqft: 1822,
    type: 'New Construction',
    address: '18909 Schultz Ln UNIT 1102, Round Rock, TX',
    builder: 'Prestige Group',
    isLiked: false,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=300&fit=crop',
    label: 'Urban Living',
    price: '4258000',
    tag: 'Under Construction',
    beds: 2,
    baths: 2,
    sqft: 1450,
    type: 'Premium Apartment',
    address: '45 Park Avenue, Sector 15, Navi Mumbai',
    builder: 'Godrej Properties',
    isLiked: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=300&fit=crop',
    label: 'Sky Heights',
    price: '2950000',
    tag: 'Ready to Move',
    beds: 4,
    baths: 3,
    sqft: 2100,
    type: 'Luxury Villa',
    address: '23 Marina Drive, Belapur, Navi Mumbai',
    builder: 'Lodha Group',
    isLiked: false,
  },
];

const Listings = () => {
  const [selectedBHK, setSelectedBHK] = useState('2 BHK');
  const [priceRange, setPriceRange] = useState([2.55]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

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
          <h3 className="text-lg font-semibold text-foreground">
            Available Properties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
