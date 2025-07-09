
import { useState } from 'react';
import PropertyCard from './PropertyCard';
import { useProperty } from '@/contexts/PropertyContext';
import { Button } from '@/components/ui/button';

const FeaturedListings = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const { properties, loading, error } = useProperty();
  
  const featuredProperties = properties.slice(0, visibleCount);
  const hasMore = visibleCount < properties.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, properties.length));
  };

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4 w-full">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">Featured Properties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
              <div className="h-48 bg-muted rounded-lg mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 sm:space-y-4 w-full">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">Featured Properties</h3>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error loading properties: {error}</p>
        </div>
      </div>
    );
  }

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
