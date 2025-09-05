-- =====================================================
-- FIX PROFILES TABLE RLS CIRCULAR DEPENDENCY
-- =====================================================

-- First, drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a security definer function to check admin role
-- This bypasses RLS for the role check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new profiles policies that avoid circular dependency
CREATE POLICY "Users can view their own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- Allow service role to access profiles for admin checks
CREATE POLICY "Service role can access profiles" ON public.profiles 
FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read profiles for role checks
CREATE POLICY "Authenticated users can read profiles for role checks" ON public.profiles 
FOR SELECT USING (auth.role() = 'authenticated');

-- Create a function to safely get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN COALESCE(user_role, 'client');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update other policies to use the new function instead of direct table access
-- Categories policies
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories 
FOR ALL USING (public.get_user_role() = 'admin');

-- Products policies  
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products 
FOR ALL USING (public.get_user_role() = 'admin');

-- Orders policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders 
FOR SELECT USING (public.get_user_role() = 'admin');
CREATE POLICY "Admins can update orders" ON public.orders 
FOR UPDATE USING (public.get_user_role() = 'admin');

-- Order items policies
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items 
FOR ALL USING (public.get_user_role() = 'admin');

-- Analytics policies
DROP POLICY IF EXISTS "Admins can view analytics" ON public.analytics;
CREATE POLICY "Admins can view analytics" ON public.analytics 
FOR SELECT USING (public.get_user_role() = 'admin');

-- Storage policies
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

CREATE POLICY "Admins can upload product images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'products' AND public.get_user_role() = 'admin'
);

CREATE POLICY "Admins can update product images" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'products' AND public.get_user_role() = 'admin'
);

CREATE POLICY "Admins can delete product images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'products' AND public.get_user_role() = 'admin'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Profiles RLS policies fixed successfully!';
  RAISE NOTICE 'Circular dependency resolved using security definer functions';
END $$;
