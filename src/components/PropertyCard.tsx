
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

const formatPrice = (priceString: string): string => {
  const numericValue = parseFloat(priceString.replace(/[₹,]/g, ''));
  
  if (isNaN(numericValue)) {
    return priceString;
  }
  
  if (numericValue >= 10000000) {
    return `₹${(numericValue / 10000000).toFixed(2)} Cr`;
  } else if (numericValue >= 100000) {
    return `₹${(numericValue / 100000).toFixed(2)} L`;
  } else if (numericValue >= 1000) {
    return `₹${(numericValue / 1000).toFixed(2)} K`;
  } else {
    return `₹${numericValue.toFixed(0)}`;
  }
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(property.isLiked);
  const navigate = useNavigate();

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 tap-scale w-full max-w-sm mx-auto sm:max-w-none">
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
          <span className="text-xl font-bold text-foreground">{formatPrice(property.price)}</span>
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

        {/* View Details Button */}
        <Button 
          onClick={handleViewDetails}
          className="w-full mt-3 bg-primary hover:bg-primary/90 text-white"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;
