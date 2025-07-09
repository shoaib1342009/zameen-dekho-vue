
import { useState, useEffect } from 'react';
import { useProperty } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPrice, formatRentPrice } from '@/utils/priceFormatter';
import { useWishlist } from '@/contexts/WishlistContext';
import AuthModal from '@/components/AuthModal';

const Play = () => {
  const { properties, loading } = useProperty();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Filter properties that have videos
  const propertiesWithVideos = properties.filter(property => property.video_url);

  const handleContactSeller = (property: any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const phone = property.seller_phone || '+919876543210';
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (property: any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const phone = property.seller_phone || '919876543210';
    const message = `Hi! I'm interested in ${property.title}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleViewDetails = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const toggleLike = (property: any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    toggleWishlist(property.id.toString());
  };

  const formatPropertyPrice = (price: string | number, label: string) => {
    const priceStr = price.toString();
    if (label.toLowerCase().includes('rent')) {
      return formatRentPrice(priceStr);
    }
    return formatPrice(priceStr);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentVideoIndex < propertiesWithVideos.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
      } else if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex(currentVideoIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, propertiesWithVideos.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading video properties...</p>
        </div>
      </div>
    );
  }

  if (propertiesWithVideos.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Video Properties Available</h2>
          <p className="text-gray-400 mb-6">Properties with video content will appear here</p>
          <Button onClick={() => navigate('/')} className="bg-white text-black hover:bg-gray-200">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {propertiesWithVideos.map((property, index) => (
          <div key={property.id} className="h-screen w-full snap-start relative">
            {/* Video Player */}
            <div className="absolute inset-0">
              <video
                src={property.video_url}
                className="w-full h-full object-cover"
                controls
                loop
                muted
                autoPlay={index === currentVideoIndex}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            </div>

            {/* Property Information Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-end justify-between">
                {/* Property Details */}
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      {property.listing_type}
                    </span>
                    <span className="px-2 py-1 bg-blue-500 rounded-full text-xs">
                      {property.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  
                  <div className="text-2xl font-bold text-white mb-2">
                    {formatPropertyPrice(property.price, property.listing_type)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-white/80 mb-2">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.beds} beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.baths} baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.sqft?.toLocaleString()} sqft</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-white/80 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleViewDetails(property)}
                      size="sm"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                      variant="outline"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleContactSeller(property)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      onClick={() => handleWhatsApp(property)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => toggleLike(property)}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Heart className={cn(
                      "w-6 h-6 transition-colors",
                      isInWishlist(property.id.toString()) ? "fill-red-500 text-red-500" : "text-white"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Play;
