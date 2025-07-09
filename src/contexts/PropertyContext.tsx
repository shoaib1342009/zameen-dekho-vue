
import { createContext, useContext, ReactNode } from 'react';
import { useSupabaseProperties, useUserProperties, Property } from '@/hooks/useSupabaseProperties';

interface PropertyContextType {
  properties: Property[];
  userProperties: Property[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  refetchUserProperties: () => void;
  addProperty: (property: any) => void; // Legacy method for compatibility
  getAllProperties: () => Property[]; // Legacy method for compatibility
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const { properties, loading, error, refetch } = useSupabaseProperties();
  const { userProperties, loading: userLoading, refetch: refetchUserProperties } = useUserProperties();

  // Legacy compatibility methods
  const addProperty = (property: any) => {
    // This is handled by the actual form submission in SupabaseListPropertyModal
    console.log('addProperty called - properties are now added via Supabase');
  };

  const getAllProperties = () => {
    return properties;
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      userProperties, 
      loading: loading || userLoading, 
      error, 
      refetch,
      refetchUserProperties,
      addProperty,
      getAllProperties
    }}>
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
