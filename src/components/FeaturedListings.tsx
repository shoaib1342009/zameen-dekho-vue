import PropertyCard from './PropertyCard';
import { mockProperties } from '@/data/mockData';

const FeaturedListings = () => {
  // Show first 3 properties as featured
  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      <h3 className="text-lg sm:text-xl font-bold text-foreground">Featured Properties</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedListings;