import { Heart } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import { mockProperties } from '@/data/mockData';
import { useState } from 'react';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistItems } = useWishlist();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Get properties that are in the wishlist
  const wishlistProperties = mockProperties.filter(property => 
    wishlistItems.includes(property.id)
  );

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-6">
            <Heart className="w-24 h-24 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Your Wishlist Awaits</h2>
            <p className="text-muted-foreground mb-6">Please login to view and manage your saved properties</p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-zameen-gradient text-white"
            >
              Login to View Wishlist
            </Button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Wishlist</h1>
          <span className="text-sm text-muted-foreground">
            ({wishlistProperties.length} properties)
          </span>
        </div>

        {wishlistProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {wishlistProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No properties wishlisted yet
            </h3>
            <p className="text-sm text-muted-foreground/80 mb-4">
              Start exploring properties and add your favorites here
            </p>
            <Button 
              onClick={() => window.location.href = '/listings'}
              className="bg-zameen-gradient text-white"
            >
              Browse Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;