
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface FilterSectionProps {
  selectedBHK: string;
  setSelectedBHK: (bhk: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
}

const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
const amenities = ['Parking', 'Gym', 'Pool', 'Garden', 'Security', 'Lift'];

const formatPrice = (value: number) => {
  if (value >= 100) {
    return `₹${(value / 100).toFixed(2)} Cr`;
  } else {
    return `₹${value.toFixed(2)} L`;
  }
};

const FilterSection = ({
  selectedBHK,
  setSelectedBHK,
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities
}: FilterSectionProps) => {
  const [showPriceTooltip, setShowPriceTooltip] = useState(false);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div className="space-y-6">
      {/* BHK Filter */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Property Type</h3>
        <div className="flex flex-wrap gap-2">
          {bhkOptions.map((bhk) => (
            <Button
              key={bhk}
              variant={selectedBHK === bhk ? "default" : "outline"}
              onClick={() => setSelectedBHK(bhk)}
              className="rounded-full"
            >
              {bhk}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Price Range</h3>
        <div className="px-3">
          <div className="relative">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              min={1}
              step={1}
              className="w-full"
              onPointerDown={() => setShowPriceTooltip(true)}
              onPointerUp={() => setShowPriceTooltip(false)}
            />
            {(showPriceTooltip || 'ontouchstart' in window) && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-medium z-10">
                {formatPrice(priceRange[0])}
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>₹1 L</span>
            <span className="font-medium text-foreground">{formatPrice(priceRange[0])}</span>
            <span>₹10 Cr</span>
          </div>
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <Button
              key={amenity}
              variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
              onClick={() => toggleAmenity(amenity)}
              className="rounded-full text-sm"
            >
              {amenity}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
