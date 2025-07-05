
import { useState } from 'react';
import PropertyCard from './PropertyCard';
import { mockProperties } from '@/data/mockData';
import { Button } from '@/components/ui/button';

const FeaturedListings = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  
  // Show first 4 properties as featured initially
  const featuredProperties = mockProperties.slice(0, visibleCount);
  const hasMore = visibleCount < mockProperties.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, mockProperties.length));
  };

  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      <h3 className="text-lg sm:text-xl font-bold text-foreground">Featured Properties</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button 
            onClick={loadMore}
            variant="outline"
            className="px-6 py-2 text-sm"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeaturedListings;
