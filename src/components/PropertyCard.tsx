
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Property {
  id: number;
  image: string;
  label: string;
  price: string;
  tag: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  address: string;
  builder: string;
  isLiked: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(property.isLiked);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 tap-scale">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.label}
          className="w-full h-full object-cover"
        />
        
        {/* Label */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full">
          <span className="text-white text-sm font-medium">{property.label}</span>
        </div>
        
        {/* Heart Icon */}
        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 p-2 bg-black/70 backdrop-blur-sm rounded-full tap-scale"
        >
          <Heart className={cn(
            "w-5 h-5 transition-colors",
            isLiked ? "fill-red-500 text-red-500" : "text-white"
          )} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Price and Tag */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">{property.price}</span>
          <span className="px-2 py-1 bg-zameen-gradient text-white text-xs font-medium rounded-full">
            {property.tag}
          </span>
        </div>

        {/* Property Details */}
        <div className="text-sm text-muted-foreground">
          {property.beds} bds | {property.baths} ba | {property.sqft.toLocaleString()} sqft - {property.type}
        </div>

        {/* Address */}
        <div className="text-sm text-muted-foreground">
          {property.address}
        </div>

        {/* Builder */}
        <div className="text-xs text-muted-foreground/80">
          {property.builder}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
