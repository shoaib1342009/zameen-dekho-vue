
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

const mockWishlistProperties = [
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=300&fit=crop',
    label: 'Urban Living',
    price: '₹4,25,800',
    tag: 'Under Construction',
    beds: 2,
    baths: 2,
    sqft: 1450,
    type: 'Premium Apartment',
    address: '45 Park Avenue, Sector 15, Navi Mumbai',
    builder: 'Godrej Properties',
    isLiked: true,
  },
];

const Wishlist = () => {
  const [wishlistProperties, setWishlistProperties] = useState(mockWishlistProperties);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
        </div>

        {wishlistProperties.length > 0 ? (
          <div className="space-y-4">
            {wishlistProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No properties wishlisted yet
            </h3>
            <p className="text-sm text-muted-foreground/80">
              Start exploring properties and add your favorites here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
