
-- Create properties table
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  property_type TEXT NOT NULL DEFAULT 'Apartment/Flat',
  listing_type TEXT NOT NULL DEFAULT 'For Sale',
  beds INTEGER NOT NULL DEFAULT 1,
  baths INTEGER NOT NULL DEFAULT 1,
  sqft INTEGER NOT NULL DEFAULT 500,
  builder TEXT,
  tag TEXT DEFAULT 'New',
  cover_image_url TEXT,
  video_url TEXT,
  seller_phone TEXT,
  seller_email TEXT,
  seller_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE public.property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create amenities table
CREATE TABLE public.amenities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_amenities junction table
CREATE TABLE public.property_amenities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
  UNIQUE(property_id, amenity_id)
);

-- Insert default amenities
INSERT INTO public.amenities (name, icon) VALUES
  ('Swimming Pool', 'waves'),
  ('Gym', 'dumbbell'),
  ('Parking', 'car'),
  ('Security', 'shield'),
  ('Garden', 'tree-pine'),
  ('Elevator', 'arrow-up'),
  ('Power Backup', 'zap'),
  ('Water Supply', 'droplet'),
  ('Internet', 'wifi'),
  ('Club House', 'home'),
  ('Playground', 'gamepad-2'),
  ('CCTV', 'camera');

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Users can insert their own properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own properties" ON public.properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own properties" ON public.properties FOR DELETE USING (auth.uid() = user_id);

-- Property images policies
CREATE POLICY "Anyone can view property images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Users can insert images for their properties" ON public.property_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update images for their properties" ON public.property_images FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete images for their properties" ON public.property_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);

-- Amenities policies
CREATE POLICY "Anyone can view amenities" ON public.amenities FOR SELECT USING (true);

-- Property amenities policies
CREATE POLICY "Anyone can view property amenities" ON public.property_amenities FOR SELECT USING (true);
CREATE POLICY "Users can manage amenities for their properties" ON public.property_amenities FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update amenities for their properties" ON public.property_amenities FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete amenities for their properties" ON public.property_amenities FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Create storage bucket for property videos
INSERT INTO storage.buckets (id, name, public) VALUES ('property-videos', 'property-videos', true);

-- Storage policies for property images
CREATE POLICY "Anyone can view property images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Authenticated users can upload property images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'property-images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update their own property images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete their own property images" ON storage.objects FOR DELETE USING (
  bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for property videos
CREATE POLICY "Anyone can view property videos" ON storage.objects FOR SELECT USING (bucket_id = 'property-videos');
CREATE POLICY "Authenticated users can upload property videos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'property-videos' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update their own property videos" ON storage.objects FOR UPDATE USING (
  bucket_id = 'property-videos' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete their own property videos" ON storage.objects FOR DELETE USING (
  bucket_id = 'property-videos' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to get properties with images and amenities
CREATE OR REPLACE FUNCTION get_properties_with_details()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  price BIGINT,
  location TEXT,
  address TEXT,
  property_type TEXT,
  listing_type TEXT,
  beds INTEGER,
  baths INTEGER,
  sqft INTEGER,
  builder TEXT,
  tag TEXT,
  cover_image_url TEXT,
  video_url TEXT,
  seller_phone TEXT,
  seller_email TEXT,
  seller_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  images JSONB,
  amenities JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.title,
    p.description,
    p.price,
    p.location,
    p.address,
    p.property_type,
    p.listing_type,
    p.beds,
    p.baths,
    p.sqft,
    p.builder,
    p.tag,
    p.cover_image_url,
    p.video_url,
    p.seller_phone,
    p.seller_email,
    p.seller_name,
    p.created_at,
    p.updated_at,
    COALESCE(
      (SELECT jsonb_agg(pi.image_url) FROM public.property_images pi WHERE pi.property_id = p.id),
      '[]'::jsonb
    ) as images,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('name', a.name, 'icon', a.icon)) 
       FROM public.property_amenities pa 
       JOIN public.amenities a ON pa.amenity_id = a.id 
       WHERE pa.property_id = p.id),
      '[]'::jsonb
    ) as amenities
  FROM public.properties p
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;
