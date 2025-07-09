import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Bed, Bath, Square, Phone, MessageCircle, Wifi, Car, Dumbbell, Shield, TreePine, Waves } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatPrice, formatRentPrice } from '@/utils/priceFormatter';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useProperty } from '@/contexts/PropertyContext';
import AuthModal from '@/components/AuthModal';
import PropertyImageCarousel from '@/components/PropertyImageCarousel';
import VideoPlayer from '@/components/VideoPlayer';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getPropertyById } = useProperty();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const propertyId = id ? parseInt(id, 10) : null;
  const property = propertyId ? getPropertyById(propertyId) : null;

  const isLiked = property ? isInWishlist(property.id) : false;

  // Handle scroll for CTA button animations
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/listings')} className="bg-zameen-gradient text-white">
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const toggleLike = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    toggleWishlist(property.id);
  };

  const handleCall = () => {
    window.location.href = 'tel:+919876543210';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in ${property.title} priced at ${formatPropertyPrice(property.price, property.label)}`);
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  const formatPropertyPrice = (price: string, label: string) => {
    if (label.toLowerCase().includes('rent')) {
      return formatRentPrice(price);
    }
    return formatPrice(price);
  };

  const handleContactSeller = () => {
    handleCall();
  };

  const handleWhatsAppFromVideo = () => {
    handleWhatsApp();
  };

  const amenityIcons: { [key: string]: any } = {
    'Swimming Pool': Waves,
    'Gym': Dumbbell,
    'WiFi': Wifi,
    'Parking': Car,
    'Security': Shield,
    'Garden': TreePine,
    'Internet': Wifi,
    'Club House': TreePine,
  };

  const images = property.images || [property.image];

  // Calculate button position based on scroll - reverse direction
  const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
  const buttonTransform = scrollDirection === 'down' ? Math.min(scrollY * 0.3, 80) : 0;

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>
            
            <h1 className="text-sm sm:text-base font-semibold text-foreground truncate px-2">
              {property.title}
            </h1>
            
            <button
              onClick={toggleLike}
              className="p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale"
            >
              <Heart className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} />
            </button>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative h-[50vh] sm:h-[60vh] w-full overflow-hidden">
          <PropertyImageCarousel
            images={images}
            alt={property.title}
            className="w-full h-full"
          />
          
          {/* Labels positioned inside the image area */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">{property.label}</span>
          </div>
          
          <div className="absolute top-4 right-4 px-3 py-1 bg-zameen-gradient rounded-full">
            <span className="text-white text-sm font-medium">{property.tag}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Price and Basic Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {formatPropertyPrice(property.price, property.label)}
                </h2>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
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
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">About this property</h3>
            <p className="text-muted-foreground leading-relaxed">
              {property.description || `Beautiful ${property.beds} bedroom ${property.type.toLowerCase()} located in ${property.location}. This property offers modern amenities and is perfect for ${property.label.toLowerCase().includes('rent') ? 'rental' : 'purchase'}.`}
            </p>
          </div>

          {/* Builder Info */}
          {property.builder && (
            <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-1">Built by</h3>
              <p className="text-muted-foreground">{property.builder}</p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || TreePine;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconComponent className="w-4 h-4 text-primary" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Video Section */}
          {property.videoUrl && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Property Video</h3>
              <VideoPlayer 
                video={{
                  id: property.id,
                  videoUrl: property.videoUrl,
                  property: {
                    title: property.title,
                    price: property.price,
                    location: property.location,
                    seller: property.seller || 'Property Owner'
                  }
                }}
                onContactSeller={handleContactSeller}
                onWhatsApp={handleWhatsAppFromVideo}
              />
            </div>
          )}
        </div>

        {/* CTA Buttons with scroll-matched animation */}
        <div 
          className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-40 px-4 transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${buttonTransform}px)`
          }}
        >
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4 bg-background/95 backdrop-blur-sm rounded-t-2xl shadow-lg p-4">
              <Button
                onClick={handleCall}
                variant="outline"
                className="flex items-center justify-center gap-2 bg-background text-foreground border-border hover:bg-muted/20"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">Call</span>
              </Button>
              <Button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default PropertyDetails;
