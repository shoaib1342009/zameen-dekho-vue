
import { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface PropertyContextType {
  userProperties: Property[];
  addProperty: (property: Omit<Property, 'id'>) => void;
  getAllProperties: () => Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [userProperties, setUserProperties] = useState<Property[]>([]);

  const addProperty = (property: Omit<Property, 'id'>) => {
    const newProperty = {
      ...property,
      id: Date.now(), // Simple ID generation
    };
    setUserProperties(prev => [...prev, newProperty]);
    
    // Store in localStorage for persistence
    const existingProperties = JSON.parse(localStorage.getItem('userProperties') || '[]');
    existingProperties.push(newProperty);
    localStorage.setItem('userProperties', JSON.stringify(existingProperties));
  };

  const getAllProperties = () => {
    // Get properties from localStorage on first load
    const storedProperties = JSON.parse(localStorage.getItem('userProperties') || '[]');
    return [...userProperties, ...storedProperties];
  };

  return (
    <PropertyContext.Provider value={{ userProperties, addProperty, getAllProperties }}>
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
