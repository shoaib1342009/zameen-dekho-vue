
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  { name: 'Pool', icon: '🏊' },
  { name: 'Gym', icon: '💪' },
  { name: 'Play Area', icon: '🎮' },
  { name: 'Bus Stop', icon: '🚌' },
  { name: 'CCTV', icon: '📹' },
  { name: 'Lift', icon: '🛗' },
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

  const toggleAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(newAmenities);
  };

  return (
    <div className="space-y-6">
      {/* BHK Selector */}
      <div className="relative">
        <button
          onClick={() => setShowBHKDropdown(!showBHKDropdown)}
          className="w-full px-4 py-4 bg-card text-foreground rounded-2xl border border-border flex items-center justify-between tap-scale"
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
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Price Range: ₹{priceRange[0].toFixed(2)} L
        </label>
        <div className="relative">
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
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Amenities</label>
        <div className="grid grid-cols-3 gap-3">
          {amenities.map((amenity) => (
            <button
              key={amenity.name}
              onClick={() => toggleAmenity(amenity.name)}
              className={cn(
                "flex flex-col items-center py-3 px-2 rounded-xl border transition-all tap-scale",
                selectedAmenities.includes(amenity.name)
                  ? "bg-zameen-gradient border-transparent text-white"
                  : "bg-card border-border text-foreground hover:border-primary/50"
              )}
            >
              <span className="text-xl mb-1">{amenity.icon}</span>
              <span className="text-xs font-medium">{amenity.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
