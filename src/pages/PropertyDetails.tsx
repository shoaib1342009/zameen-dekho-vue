
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Bed, Bath, Square, Phone, MessageCircle, Wifi, Car, Dumbbell, Shield, TreePine, Waves } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPrice, formatRentPrice } from '@/utils/priceFormatter';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useProperty } from '@/contexts/PropertyContext';
import AuthModal from '@/components/AuthModal';
import PropertyImageCarousel from '@/components/PropertyImageCarousel';

const amenityIcons = {
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'Parking': Car,
  'Security': Shield,
  'Garden': TreePine,
  'Internet': Wifi,
  'wifi': Wifi,
  'parking': Car,
  'gym': Dumbbell,
  'security': Shield,
  'garden': TreePine,
  'pool': Waves,
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { properties, loading } = useProperty();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const property = properties.find(p => p.id === id);

  const isLiked = property ? isInWishlist(property.id) : false;

  // Handle scroll for CTA button animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h2>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
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
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const phone = property.seller_phone || '+919876543210';
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const phone = property.seller_phone || '919876543210';
    const message = `Hi, I am interested in ${property.title}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const formatPropertyPrice = (price: string | number, label: string) => {
    const priceStr = price.toString();
    if (label.toLowerCase().includes('rent')) {
      return formatRentPrice(priceStr);
    }
    return formatPrice(priceStr);
  };

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.cover_image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'];

  // Calculate button position based on scroll
  const buttonTransform = Math.min(scrollY * 0.5, 100);

  return (
    <>
      <div className="min-h-screen bg-background pb-32 sm:pb-4">
        {/* Header */}
        <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl tap-scale"
            >
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <span className="text-lg font-semibold text-foreground">Property Details</span>
            <button
              onClick={toggleLike}
              className="p-2 rounded-xl tap-scale"
            >
              <Heart className={cn(
                "w-6 h-6 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} />
            </button>
          </div>
        </div>

        {/* Enhanced Image Gallery with proper height */}
        <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
          <PropertyImageCarousel 
            images={images} 
            alt="Property"
            className="w-full h-full"
          />
          
          {/* Labels positioned inside the image area */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">{property.listing_type}</span>
          </div>
          <div className="absolute top-4 right-4 px-2 py-1 bg-zameen-gradient rounded-full">
            <span className="text-white text-xs font-medium">{property.tag}</span>
          </div>
        </div>

        {/* Property Information - directly connected to image */}
        <div className="p-4 space-y-6">
          {/* Price and Basic Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-foreground">
                {formatPropertyPrice(property.price, property.listing_type)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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
            <div className="text-lg font-medium text-foreground mb-1">{property.property_type}</div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{property.address || property.location}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">by {property.builder}</div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity: any, index: number) => {
                  const IconComponent = amenityIcons[amenity.name as keyof typeof amenityIcons] || Wifi;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map Placeholder */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Location</h3>
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Map view will be displayed here</p>
              </div>
            </div>
          </div>
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
                className="flex items-center gap-2 h-12 text-green-500 hover:bg-green-500 hover:text-white"
              >
                <Phone className="w-5 h-5" />
                Call
              </Button>
              <Button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 h-12 bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
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
