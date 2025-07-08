
import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Waves, Dumbbell, Gamepad2, Bus, Camera, Zap, Wifi, Car, Shield, TreePine, Coffee, Utensils, Wind, Sun, Users, Baby, Dog, Music } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const bannerImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop',
    title: 'Find Your Dream Home',
    subtitle: 'Discover amazing properties in Mumbai'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1920&h=1080&fit=crop',
    title: 'Premium Properties',
    subtitle: 'Luxury living at its finest'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop',
    title: 'Modern Living Spaces',
    subtitle: 'Contemporary homes for modern families'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=1080&fit=crop',
    title: 'Waterfront Homes',
    subtitle: 'Wake up to stunning ocean views'
  }
];

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedBHK: string;
  setSelectedBHK: (value: string) => void;
  selectedPropertyType: string;
  setSelectedPropertyType: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (value: string[]) => void;
}

const propertyTypes = ['Apartment/Flat', 'Bungalow', 'Land', 'Villa', 'Townhouse', 'Studio'];
const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK'];

const amenities = [
  { name: 'Pool', icon: Waves },
  { name: 'Gym', icon: Dumbbell },
  { name: 'Play Area', icon: Gamepad2 },
  { name: 'Bus Stop', icon: Bus },
  { name: 'CCTV', icon: Camera },
  { name: 'Lift', icon: Zap },
  { name: 'WiFi', icon: Wifi },
  { name: 'Parking', icon: Car },
  { name: 'Security', icon: Shield },
  { name: 'Garden', icon: TreePine },
  { name: 'Cafe', icon: Coffee },
  { name: 'Restaurant', icon: Utensils },
  { name: 'AC', icon: Wind },
  { name: 'Solar', icon: Sun },
  { name: 'Club', icon: Users },
  { name: 'Daycare', icon: Baby },
  { name: 'Pet Area', icon: Dog },
  { name: 'Music Room', icon: Music },
];

const HeroBanner = ({
  searchQuery,
  setSearchQuery,
  selectedBHK,
  setSelectedBHK,
  selectedPropertyType,
  setSelectedPropertyType,
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities,
}: HeroBannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showBHKDropdown, setShowBHKDropdown] = useState(false);
  const [showPriceBubble, setShowPriceBubble] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const formatPriceValue = (value: number) => {
    if (value >= 10) {
      return `₹${(value).toFixed(2)} Cr`;
    } else {
      return `₹${(value * 10).toFixed(2)} L`;
    }
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(newAmenities);
  };

  return (
    <div className="relative h-screen overflow-hidden rounded-3xl border-2 border-border/50 dark:border-border/30 m-4">
      {/* Background Images */}
      {bannerImages.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 rounded-3xl overflow-hidden ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-full max-w-4xl px-6">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              {bannerImages[currentSlide].title}
            </h1>
            <p className="text-xl text-white/90">
              {bannerImages[currentSlide].subtitle}
            </p>
          </div>

          {/* Combined Search and Filter Section - Frosted Glass */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/20">
            <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              {/* Search Bar - Always Visible */}
              <div className="flex items-center gap-2">
                {/* Property Type - 1/5 width - Only show when filter is open */}
                {isFilterOpen && (
                  <div className="relative flex-1 max-w-[20%]">
                    <button
                      onClick={() => setShowPropertyTypeDropdown(!showPropertyTypeDropdown)}
                      className="w-full px-2 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 flex items-center justify-between text-sm"
                    >
                      <span className="font-medium truncate">Property Type</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform flex-shrink-0",
                        showPropertyTypeDropdown && "rotate-180"
                      )} />
                    </button>
                    
                    {showPropertyTypeDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-md border border-white/30 rounded-lg shadow-lg z-20">
                        {propertyTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedPropertyType(type);
                              setShowPropertyTypeDropdown(false);
                            }}
                            className="w-full px-2 py-2 text-left hover:bg-white/20 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm text-gray-800"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* BHK - 1/5 width - Only show when filter is open */}
                {isFilterOpen && (
                  <div className="relative flex-1 max-w-[20%]">
                    <button
                      onClick={() => setShowBHKDropdown(!showBHKDropdown)}
                      className="w-full px-2 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 flex items-center justify-between text-sm"
                    >
                      <span className="font-medium truncate">{selectedBHK}</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform flex-shrink-0",
                        showBHKDropdown && "rotate-180"
                      )} />
                    </button>
                    
                    {showBHKDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-md border border-white/30 rounded-lg shadow-lg z-20">
                        {bhkOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSelectedBHK(option);
                              setShowBHKDropdown(false);
                            }}
                            className="w-full px-2 py-2 text-left hover:bg-white/20 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm text-gray-800"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Search Bar - 3/5 width */}
                <div className={`relative ${isFilterOpen ? 'flex-1 max-w-[60%]' : 'flex-1'}`}>
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-1.5 pr-20 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <CollapsibleTrigger asChild>
                      <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors">
                        <Filter className="w-4 h-4 text-white" />
                      </button>
                    </CollapsibleTrigger>
                    <button className="p-1.5 bg-blue-600/80 backdrop-blur-sm rounded-md hover:bg-blue-700/80 transition-colors">
                      <Search className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Filter Content - Price Range and Amenities */}
              <CollapsibleContent>
                {isFilterOpen && (
                  <div className="mt-3 pt-3 border-t border-white/20 space-y-3">
                    {/* Price Range */}
                    <div 
                      className="relative px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"
                      onMouseEnter={() => setShowPriceBubble(true)}
                      onMouseLeave={() => setShowPriceBubble(false)}
                      onTouchStart={() => setShowPriceBubble(true)}
                      onTouchEnd={() => setShowPriceBubble(false)}
                    >
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.05"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseFloat(e.target.value)])}
                        className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #7F00FF 0%, #00FFFF ${(priceRange[0] - 1) / 9 * 100}%, rgba(255,255,255,0.3) ${(priceRange[0] - 1) / 9 * 100}%, rgba(255,255,255,0.3) 100%)`
                        }}
                      />
                      {showPriceBubble && (
                        <div 
                          className="absolute -top-8 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium z-20"
                          style={{
                            left: `${(priceRange[0] - 1) / 9 * 100}%`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          {formatPriceValue(priceRange[0])}
                        </div>
                      )}
                    </div>

                    {/* Amenities - Horizontal Scroll */}
                    <div className="w-full">
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                        {amenities.map((amenity) => {
                          const IconComponent = amenity.icon;
                          const isSelected = selectedAmenities.includes(amenity.name);
                          
                          return (
                            <button
                              key={amenity.name}
                              onClick={() => toggleAmenity(amenity.name)}
                              className={cn(
                                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all border-2",
                                isSelected
                                  ? "bg-white/20 border-white text-white shadow-lg"
                                  : "bg-white/10 border-white/30 text-white/70 hover:border-white/50"
                              )}
                            >
                              <IconComponent className="w-5 h-5" strokeWidth={2} />
                            </button>
                          );
                        })}
                      </div>
                      
                      {selectedAmenities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedAmenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="px-2 py-1 bg-white/20 text-white text-xs rounded-full border border-white/30"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
