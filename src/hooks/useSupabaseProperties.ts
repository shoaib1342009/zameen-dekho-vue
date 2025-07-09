
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, Json } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export type Property = Tables<'properties'> & {
  images: string[];
  amenities: { name: string; icon: string; }[];
};

export type Amenity = Tables<'amenities'>;

// Helper function to safely convert Json to string array
const jsonToStringArray = (jsonData: Json): string[] => {
  if (Array.isArray(jsonData)) {
    return jsonData.filter((item): item is string => typeof item === 'string');
  }
  return [];
};

// Helper function to safely convert Json to amenities array
const jsonToAmenitiesArray = (jsonData: Json): { name: string; icon: string; }[] => {
  if (Array.isArray(jsonData)) {
    return jsonData.filter((item): item is { name: string; icon: string; } => 
      typeof item === 'object' && item !== null && 
      typeof (item as any).name === 'string' && 
      typeof (item as any).icon === 'string'
    );
  }
  return [];
};

export const useSupabaseProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_properties_with_details');
      
      if (error) throw error;
      
      const formattedProperties: Property[] = data.map(prop => ({
        ...prop,
        images: jsonToStringArray(prop.images),
        amenities: jsonToAmenitiesArray(prop.amenities)
      }));
      
      setProperties(formattedProperties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return { properties, loading, error, refetch: fetchProperties };
};

export const useAmenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const { data, error } = await supabase
          .from('amenities')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setAmenities(data || []);
      } catch (err) {
        console.error('Error fetching amenities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  return { amenities, loading };
};

export const useUserProperties = () => {
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserProperties = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_properties_with_details');
      
      if (error) throw error;
      
      const userProps: Property[] = data.filter(prop => prop.user_id === user.id).map(prop => ({
        ...prop,
        images: jsonToStringArray(prop.images),
        amenities: jsonToAmenitiesArray(prop.amenities)
      }));
      
      setUserProperties(userProps);
    } catch (err) {
      console.error('Error fetching user properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProperties();
  }, [user]);

  return { userProperties, loading, refetch: fetchUserProperties };
};
