
import { useState } from 'react';
import { ChevronDown, Waves, Dumbbell, Gamepad2, Bus, Camera, Zap } from 'lucide-react';
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
    <div className="space-y-6">
      {/* BHK Selector and Price Range in Same Row */}
      <div className="flex items-center gap-4">
        {/* BHK Selector */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowBHKDropdown(!showBHKDropdown)}
            className="px-4 py-4 bg-card text-foreground rounded-2xl border border-border flex items-center gap-2 tap-scale min-w-[120px]"
          >
            <span className="font-medium">{selectedBHK}</span>
            <ChevronDown className={cn(
              "w-5 h-5 transition-transform",
              showBHKDropdown && "rotate-180"
            )} />
          </button>
          
          {showBHKDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-lg z-10 animate-scale-in">
              {bhkOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedBHK(option);
                    setShowBHKDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-muted/20 first:rounded-t-2xl last:rounded-b-2xl transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Slider */}
        <div className="flex-1 relative">
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
                className="absolute -top-8 bg-black text-white px-2 py-1 rounded text-xs font-medium"
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

      {/* Amenities - Line Icons with Blue Glow */}
      <div className="grid grid-cols-6 gap-4">
        {amenities.map((amenity) => {
          const IconComponent = amenity.icon;
          const isSelected = selectedAmenities.includes(amenity.name);
          
          return (
            <button
              key={amenity.name}
              onClick={() => toggleAmenity(amenity.name)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all tap-scale border-2",
                isSelected
                  ? "bg-blue-500/10 border-blue-500 text-blue-500 shadow-lg shadow-blue-500/25"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              <IconComponent className="w-5 h-5" strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterSection;
