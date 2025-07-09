
import { createContext, useContext, ReactNode } from 'react';
import { useSupabaseProperties, useUserProperties } from '@/hooks/useSupabaseProperties';

interface PropertyContextType {
  properties: any[];
  userProperties: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  refetchUserProperties: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const { properties, loading, error, refetch } = useSupabaseProperties();
  const { userProperties, loading: userLoading, refetch: refetchUserProperties } = useUserProperties();

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      userProperties, 
      loading: loading || userLoading, 
      error, 
      refetch,
      refetchUserProperties
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
