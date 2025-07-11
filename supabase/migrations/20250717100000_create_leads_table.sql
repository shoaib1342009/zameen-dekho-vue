-- Create leads table
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL, -- Or ON DELETE CASCADE if leads should be deleted with property
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads table

-- Allow public insert (e.g., from a contact form)
CREATE POLICY "Allow public insert for leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Allow property owners to read leads for their properties
CREATE POLICY "Allow property owners to read their leads"
  ON public.leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.properties p
      WHERE p.id = leads.property_id AND p.user_id = auth.uid()
    )
  );

-- Allow service_role to read all leads (for admin/backend purposes)
-- This policy is typically implicitly handled by Supabase for service_role users,
-- but explicitly defining it can be good for clarity or specific needs.
-- Note: If you want to restrict service_role, you'd need to be more specific.
-- For now, we assume service_role should have full access.
CREATE POLICY "Allow service_role full access to leads"
  ON public.leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Optional: Add an index for faster lookups on property_id
CREATE INDEX idx_leads_property_id ON public.leads(property_id);
