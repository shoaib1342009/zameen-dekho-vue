import { useState } from 'react';
import { ChevronDown, Waves, Dumbbell, Gamepad2, Bus, Camera, Zap, Wifi, Car, Shield, TreePine, Coffee, Utensils, Wind, Sun, Users, Baby, Dog, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSectionProps {
  selectedBHK: string;
  setSelectedBHK: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (value: string[]) => void;
}

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

const FilterSection = ({
  selectedBHK,
  setSelectedBHK,
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities,
}: FilterSectionProps) => {
  const [showBHKDropdown, setShowBHKDropdown] = useState(false);
  const [showPriceBubble, setShowPriceBubble] = useState(false);

  const toggleAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(newAmenities);
  };

  const formatPriceValue = (value: number) => {
    if (value >= 10) {
      return `₹${(value).toFixed(2)} Cr`;
    } else {
      return `₹${(value * 10).toFixed(2)} L`;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* BHK Selector and Price Range - Always in same row */}
      <div className="flex items-center gap-3 w-full">
        {/* BHK Selector - Takes 1/3 space */}
        <div className="relative w-1/3 flex-shrink-0">
          <button
            onClick={() => setShowBHKDropdown(!showBHKDropdown)}
            className="w-full px-2 sm:px-3 py-3 sm:py-4 bg-card text-foreground rounded-xl sm:rounded-2xl border border-border flex items-center justify-between gap-1 sm:gap-2 tap-scale text-sm sm:text-base"
          >
            <span className="font-medium truncate">{selectedBHK}</span>
            <ChevronDown className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-transform flex-shrink-0",
              showBHKDropdown && "rotate-180"
            )} />
          </button>
          
          {showBHKDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl sm:rounded-2xl shadow-lg z-10 animate-scale-in">
              {bhkOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedBHK(option);
                    setShowBHKDropdown(false);
                  }}
                  className="w-full px-2 sm:px-3 py-2.5 sm:py-3 text-left hover:bg-muted/20 first:rounded-t-xl first:sm:rounded-t-2xl last:rounded-b-xl last:sm:rounded-b-2xl transition-colors text-sm sm:text-base"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Slider - Takes 2/3 space */}
        <div className="flex-1 w-2/3 relative">
          <div 
            className="relative"
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
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #7F00FF 0%, #00FFFF ${(priceRange[0] - 1) / 9 * 100}%, #374151 ${(priceRange[0] - 1) / 9 * 100}%, #374151 100%)`
              }}
            />
            {/* Price Bubble - Visible on hover and touch */}
            {showPriceBubble && (
              <div 
                className="absolute -top-8 bg-black text-white px-2 py-1 rounded text-xs font-medium z-20"
                style={{
                  left: `${(priceRange[0] - 1) / 9 * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {formatPriceValue(priceRange[0])}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amenities - Horizontal Scroll with Small Icons */}
      <div className="w-full">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2">
          {amenities.map((amenity) => {
            const IconComponent = amenity.icon;
            const isSelected = selectedAmenities.includes(amenity.name);
            
            return (
              <button
                key={amenity.name}
                onClick={() => toggleAmenity(amenity.name)}
                className={cn(
                  "flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all tap-scale border-2",
                  isSelected
                    ? "bg-blue-500/10 border-blue-500 text-blue-500 shadow-lg shadow-blue-500/25"
                    : "bg-card border-border text-muted-foreground hover:border-muted-foreground/50 dark:bg-card dark:border-border dark:text-muted-foreground"
                )}
              >
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
              </button>
            );
          })}
        </div>
        
        {/* Selected amenities indicator */}
        {selectedAmenities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedAmenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full border border-blue-500/20"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;