
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images?: string[];
  label: string;
  tag: string;
  address: string;
  builder: string;
  description: string;
  amenities?: string[];
  videoUrl?: string;
  seller?: string;
  isLiked: boolean;
}

interface PropertyContextType {
  userProperties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'isLiked'>) => void;
  getAllProperties: () => Property[];
  getPropertyById: (id: number) => Property | undefined;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// Initial properties in specified locations
const initialProperties: Property[] = [
  {
    id: 1001,
    title: "Luxurious 3BHK in Andheri West",
    price: "25000000",
    location: "Andheri West",
    type: "Apartment/Flat",
    beds: 3,
    baths: 2,
    sqft: 1200,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "Premium",
    address: "Andheri West, Mumbai, Maharashtra",
    builder: "Lodha Developers",
    description: "Premium 3BHK apartment with modern amenities",
    amenities: ["Swimming Pool", "Gym", "Parking"],
    seller: "Lodha Developers",
    isLiked: false
  },
  {
    id: 1002,
    title: "Affordable 2BHK in Panvel",
    price: "8500000",
    location: "Panvel",
    type: "Apartment/Flat",
    beds: 2,
    baths: 2,
    sqft: 950,
    image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "Value",
    address: "Panvel, Navi Mumbai, Maharashtra",
    builder: "Tata Housing",
    description: "Well-planned 2BHK with great connectivity",
    amenities: ["Parking", "Security", "Garden"],
    seller: "Tata Housing",
    isLiked: false
  },
  {
    id: 1003,
    title: "Modern 3BHK in Ulwe",
    price: "12000000",
    location: "Ulwe",
    type: "Apartment/Flat",
    beds: 3,
    baths: 3,
    sqft: 1100,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "New",
    address: "Ulwe, Navi Mumbai, Maharashtra",
    builder: "Godrej Properties",
    description: "Contemporary living in upcoming area",
    amenities: ["Gym", "Swimming Pool", "Club House"],
    seller: "Godrej Properties",
    isLiked: false
  },
  {
    id: 1004,
    title: "Sea View 4BHK in Colaba",
    price: "45000000",
    location: "Colaba",
    type: "Apartment/Flat",
    beds: 4,
    baths: 4,
    sqft: 1800,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "Luxury",
    address: "Colaba, Mumbai, Maharashtra",
    builder: "Oberoi Realty",
    description: "Premium sea-facing apartment in South Mumbai",
    amenities: ["Sea View", "Concierge", "Valet Parking"],
    seller: "Oberoi Realty",
    isLiked: false
  },
  {
    id: 1005,
    title: "Family Home in Kurla",
    price: "15000000",
    location: "Kurla",
    type: "House/Villa",
    beds: 3,
    baths: 3,
    sqft: 1400,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "Family",
    address: "Kurla, Mumbai, Maharashtra",
    builder: "Hiranandani Group",
    description: "Perfect family home with spacious rooms",
    amenities: ["Garden", "Parking", "Security"],
    seller: "Hiranandani Group",
    isLiked: false
  },
  {
    id: 1006,
    title: "Premium 2BHK in Seawoods",
    price: "11000000",
    location: "Seawoods",
    type: "Apartment/Flat",
    beds: 2,
    baths: 2,
    sqft: 1000,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "Premium",
    address: "Seawoods, Navi Mumbai, Maharashtra",
    builder: "DLF Limited",
    description: "Well-designed apartment in prime location",
    amenities: ["Swimming Pool", "Gym", "Mall Access"],
    seller: "DLF Limited",
    isLiked: false
  },
  {
    id: 1007,
    title: "Spacious 3BHK in Rasayni",
    price: "9500000",
    location: "Rasayni",
    type: "Apartment/Flat",
    beds: 3,
    baths: 2,
    sqft: 1150,
    image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "Spacious",
    address: "Rasayni, Navi Mumbai, Maharashtra",
    builder: "Kalpataru Group",
    description: "Spacious apartment with great amenities",
    amenities: ["Club House", "Swimming Pool", "Parking"],
    seller: "Kalpataru Group",
    isLiked: false
  },
  {
    id: 1008,
    title: "Industrial Plot in Taloja",
    price: "18000000",
    location: "Taloja",
    type: "Plot/Land",
    beds: 0,
    baths: 0,
    sqft: 5000,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "Investment",
    address: "Taloja MIDC, Navi Mumbai, Maharashtra",
    builder: "MIDC",
    description: "Prime industrial plot for development",
    amenities: ["Road Access", "Utilities", "MIDC Approved"],
    seller: "MIDC",
    isLiked: false
  },
  {
    id: 1009,
    title: "Waterfront Villa in Uran",
    price: "22000000",
    location: "Uran",
    type: "House/Villa",
    beds: 4,
    baths: 4,
    sqft: 2200,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop"],
    label: "For Sale",
    tag: "Luxury",
    address: "Uran, Navi Mumbai, Maharashtra",
    builder: "Prestige Group",
    description: "Luxurious waterfront villa with private beach access",
    amenities: ["Private Beach", "Garden", "Boat Parking"],
    seller: "Prestige Group",
    isLiked: false
  }
];

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [userProperties, setUserProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Load properties from localStorage on mount
    const storedProperties = JSON.parse(localStorage.getItem('userProperties') || '[]');
    // Ensure loaded properties have isLiked field
    const propertiesWithLiked = storedProperties.map((prop: any) => ({
      ...prop,
      isLiked: prop.isLiked ?? false
    }));
    setUserProperties(propertiesWithLiked);
  }, []);

  const addProperty = (property: Omit<Property, 'id' | 'isLiked'>) => {
    // Generate a unique ID that doesn't conflict with existing ones
    const existingIds = [...initialProperties, ...userProperties].map(p => p.id);
    const newId = Math.max(...existingIds, 2000) + 1;
    
    const newProperty = {
      ...property,
      id: newId,
      isLiked: false,
    };
    
    const updatedProperties = [...userProperties, newProperty];
    setUserProperties(updatedProperties);
    
    // Store in localStorage for persistence
    localStorage.setItem('userProperties', JSON.stringify(updatedProperties));
  };

  const getAllProperties = () => {
    return [...initialProperties, ...userProperties];
  };

  const getPropertyById = (id: number) => {
    return [...initialProperties, ...userProperties].find(p => p.id === id);
  };

  return (
    <PropertyContext.Provider value={{ userProperties, addProperty, getAllProperties, getPropertyById }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
