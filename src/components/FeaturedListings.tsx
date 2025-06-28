
import PropertyCard from './PropertyCard';

const featuredProperties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&crop=center',
    label: 'For Sale',
    price: '8500000',
    tag: 'New',
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: 'Apartment',
    address: 'Sector 15, Nerul, Navi Mumbai',
    builder: 'Lodha Group',
    isLiked: false,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&crop=center',
    label: 'For Rent',
    price: '25000',
    tag: 'Hot',
    beds: 3,
    baths: 2,
    sqft: 1450,
    type: 'Villa',
    address: 'Sector 22, Kharghar, Navi Mumbai',
    builder: 'Godrej Properties',
    isLiked: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&crop=center',
    label: 'For Sale',
    price: '12000000',
    tag: 'Premium',
    beds: 3,
    baths: 3,
    sqft: 1800,
    type: 'Penthouse',
    address: 'Sector 8, Vashi, Navi Mumbai',
    builder: 'Tata Housing',
    isLiked: false,
  },
];

const FeaturedListings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Featured Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedListings;
