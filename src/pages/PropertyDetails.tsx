
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Bed, Bath, Square, Phone, MessageCircle, Wifi, Car, Dumbbell, Shield, TreePine, Waves } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockProperties } from '@/data/mockData';
import { formatPrice, formatRentPrice } from '@/utils/priceFormatter';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import AuthModal from '@/components/AuthModal';
import PropertyImageCarousel from '@/components/PropertyImageCarousel';

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  security: Shield,
  garden: TreePine,
  pool: Waves,
};

const amenityLabels = {
  wifi: 'WiFi',
  parking: 'Parking',
  gym: 'Gymnasium',
  security: '24/7 Security',
  garden: 'Garden',
  pool: 'Swimming Pool',
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [ctaTransform, setCtaTransform] = useState(0);

  const propertyId = id ? parseInt(id, 10) : null;
  const property = propertyId ? mockProperties.find(p => p.id === propertyId) : null;

  const isLiked = property ? isInWishlist(property.id) : false;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle scroll animation for CTA buttons
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      
      if (currentScrollY > 100) { // Only animate after scrolling past header
        if (scrollDiff > 0) {
          // Scrolling down - move buttons down
          setCtaTransform(prev => Math.min(prev + scrollDiff * 0.3, 80));
        } else {
          // Scrolling up - move buttons up
          setCtaTransform(prev => Math.max(prev + scrollDiff * 0.3, 0));
        }
      } else {
        setCtaTransform(0);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    window.location.href = 'tel:+919876543210';
  };

  const handleWhatsApp = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    window.open('https://wa.me/919876543210?text=Hi, I am interested in this property', '_blank');
  };

  const formatPropertyPrice = (price: string, label: string) => {
    if (label.toLowerCase().includes('rent')) {
      return formatRentPrice(price);
    }
    return formatPrice(price);
  };

  const images = property.images || [property.image];

  return (
    <>
      <div className="min-h-screen bg-background">
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

        {/* Image Gallery - increased height to 2.5x */}
        <div className="relative h-[35rem] sm:h-[40rem] overflow-hidden">
          <PropertyImageCarousel 
            images={images} 
            alt="Property"
            className="w-full h-full"
          />
          
          {/* Labels with proper spacing from top */}
          <div className="absolute top-6 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">{property.label}</span>
          </div>
          <div className="absolute top-6 right-4 px-2 py-1 bg-zameen-gradient rounded-full">
            <span className="text-white text-xs font-medium">{property.tag}</span>
          </div>
        </div>

        {/* Property Information - minimal top spacing */}
        <div className="p-4 pt-2 space-y-6 pb-32">
          {/* Price and Basic Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-foreground">
                {formatPropertyPrice(property.price, property.label)}
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
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
            <div className="text-lg font-medium text-foreground mb-1">{property.type}</div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{property.address}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">by {property.builder}</div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities?.map((amenity) => {
                const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                return (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border dark:bg-card dark:border-border">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {amenityLabels[amenity as keyof typeof amenityLabels]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

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

        {/* Contact Buttons - Fixed position with scroll animation */}
        <div 
          className="fixed bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border p-4 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${ctaTransform}px)` }}
        >
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Button
              onClick={handleCall}
              variant="outline"
              className="flex items-center gap-2 h-12 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
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

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default PropertyDetails;
