-- =====================================================
-- MULTIVERS E-COMMERCE DATABASE SETUP SCRIPT
-- Supabase PostgreSQL Complete Setup
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. PROFILES TABLE (extends auth.users)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- =====================================================
-- 2. CATEGORIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for categories
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);

-- =====================================================
-- 3. PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  sku TEXT UNIQUE,
  weight DECIMAL(8,2), -- in kg
  dimensions JSONB, -- {length, width, height}
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING gin(to_tsvector('french', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON public.products USING gin(to_tsvector('french', description));
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING gin(tags);

-- =====================================================
-- 4. ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  client_message TEXT,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'completed')),
  admin_notes TEXT,
  delivery_address TEXT,
  delivery_date DATE,
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_product ON public.orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_client_phone ON public.orders(client_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON public.orders(delivery_date);

-- =====================================================
-- 5. ORDER_ITEMS TABLE (for future multi-product orders)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- =====================================================
-- 6. ANALYTICS TABLE (for tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'product_view', 'whatsapp_click', 'order_created', etc.
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  client_ip INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_product ON public.analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);

-- =====================================================
-- 7. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Orders policies
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Order items policies
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Analytics policies
CREATE POLICY "Anyone can insert analytics" ON public.analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON public.analytics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 9. STORAGE BUCKETS
-- =====================================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for products bucket
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 10. FUNCTIONS AND PROCEDURES
-- =====================================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get product with category
CREATE OR REPLACE FUNCTION public.get_product_with_category(product_uuid UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  image_url TEXT,
  category_id UUID,
  is_active BOOLEAN,
  stock_quantity INTEGER,
  sku TEXT,
  weight DECIMAL,
  dimensions JSONB,
  tags TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.name, p.description, p.price, p.image_url, p.category_id, 
    p.is_active, p.stock_quantity, p.sku, p.weight, p.dimensions, p.tags,
    p.created_at, p.updated_at, c.name as category_name
  FROM public.products p
  LEFT JOIN public.categories c ON p.category_id = c.id
  WHERE p.id = product_uuid AND p.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to search products
CREATE OR REPLACE FUNCTION public.search_products(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  image_url TEXT,
  category_id UUID,
  category_name TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.name, p.description, p.price, p.image_url, p.category_id,
    c.name as category_name,
    ts_rank(
      to_tsvector('french', p.name || ' ' || COALESCE(p.description, '')),
      plainto_tsquery('french', search_term)
    ) as rank
  FROM public.products p
  LEFT JOIN public.categories c ON p.category_id = c.id
  WHERE 
    p.is_active = true AND
    (
      to_tsvector('french', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('french', search_term)
      OR p.tags && ARRAY[search_term]
    )
  ORDER BY rank DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. SAMPLE DATA
-- =====================================================

-- Insert sample categories
INSERT INTO public.categories (id, name, description, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Électronique', 'Smartphones, ordinateurs, accessoires tech', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Vêtements', 'Mode homme, femme et enfant', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Maison & Jardin', 'Décoration, mobilier, jardinage', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Sport & Loisirs', 'Équipements sportifs et loisirs', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (id, name, description, price, image_url, category_id, is_active, stock_quantity, sku, tags) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'iPhone 15 Pro',
    'Smartphone Apple iPhone 15 Pro avec puce A17 Pro, appareil photo professionnel et design en titane.',
    1199.99,
    'https://via.placeholder.com/400x400/007ACC/FFFFFF?text=iPhone+15+Pro',
    '550e8400-e29b-41d4-a716-446655440001',
    true,
    50,
    'IPHONE15PRO-128',
    ARRAY['apple', 'smartphone', 'premium', 'titanium']
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'Samsung Galaxy S24',
    'Smartphone Samsung Galaxy S24 avec intelligence artificielle et appareil photo de 50MP.',
    899.99,
    'https://via.placeholder.com/400x400/28A745/FFFFFF?text=Galaxy+S24',
    '550e8400-e29b-41d4-a716-446655440001',
    true,
    30,
    'GALAXY-S24-256',
    ARRAY['samsung', 'android', 'ai', 'camera']
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'T-Shirt Premium',
    'T-shirt en coton biologique, coupe moderne et confortable. Disponible en plusieurs couleurs.',
    39.99,
    'https://via.placeholder.com/400x400/DC3545/FFFFFF?text=T-Shirt',
    '550e8400-e29b-41d4-a716-446655440002',
    true,
    100,
    'TSHIRT-PREM-M',
    ARRAY['cotton', 'organic', 'comfortable', 'casual']
  ),
  (
    '660e8400-e29b-41d4-a716-446655440004',
    'Canapé Scandinave',
    'Canapé 3 places style scandinave en tissu gris clair, structure en bois massif.',
    799.99,
    'https://via.placeholder.com/400x400/6F42C1/FFFFFF?text=Canapé',
    '550e8400-e29b-41d4-a716-446655440003',
    true,
    5,
    'CANAPE-SCAND-3P',
    ARRAY['furniture', 'scandinavian', 'sofa', 'living-room']
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 12. VIEWS FOR EASY QUERYING
-- =====================================================

-- View for products with category information
CREATE OR REPLACE VIEW public.products_with_category AS
SELECT 
  p.*,
  c.name as category_name,
  c.description as category_description
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id;

-- View for orders with product and category information
CREATE OR REPLACE VIEW public.orders_detailed AS
SELECT 
  o.*,
  p.name as product_name,
  p.image_url as product_image,
  c.name as category_name
FROM public.orders o
LEFT JOIN public.products p ON o.product_id = p.id
LEFT JOIN public.categories c ON p.category_id = c.id;

-- =====================================================
-- 13. PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_active_category ON public.products(category_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_orders_pending ON public.orders(created_at DESC) WHERE status = 'pending';

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_products_category_active_price ON public.products(category_id, is_active, price);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at DESC);

-- =====================================================
-- 14. SECURITY FUNCTIONS
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log analytics events
CREATE OR REPLACE FUNCTION public.log_analytics(
  event_type_param TEXT,
  product_id_param UUID DEFAULT NULL,
  category_id_param UUID DEFAULT NULL,
  metadata_param JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  analytics_id UUID;
BEGIN
  INSERT INTO public.analytics (event_type, product_id, category_id, metadata)
  VALUES (event_type_param, product_id_param, category_id_param, metadata_param)
  RETURNING id INTO analytics_id;
  
  RETURN analytics_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 15. FINAL SETUP COMMANDS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create admin user function (to be called after first user registration)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SCRIPT COMPLETION
-- =====================================================

-- Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to app_settings
CREATE POLICY "Admin can manage app settings" ON public.app_settings
  FOR ALL USING (public.is_admin());

-- Create policy for public read access to app settings
CREATE POLICY "Public can read app settings" ON public.app_settings
  FOR SELECT USING (true);

-- Insert default settings
INSERT INTO public.app_settings (key, value) VALUES 
  ('home_background_image', '')
  ON CONFLICT (key) DO NOTHING;

-- Create view for products with category information
CREATE OR REPLACE VIEW public.products_with_category AS
SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  p.image_url,
  p.category_id,
  p.is_active,
  p.stock_quantity,
  p.sku,
  p.weight,
  p.dimensions,
  p.tags,
  p.created_at,
  p.updated_at,
  c.name as category_name,
  c.description as category_description
FROM
  products p
  LEFT JOIN categories c ON p.category_id = c.id;

-- Verify tables creation
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created: profiles, categories, products, orders, order_items, analytics, app_settings';
  RAISE NOTICE 'Storage bucket created: products';
  RAISE NOTICE 'RLS policies enabled and configured';
  RAISE NOTICE 'Sample data inserted';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create your first admin user by registering in the app';
  RAISE NOTICE '2. Run: SELECT public.make_user_admin(''your-email@example.com'');';
  RAISE NOTICE '3. Start using the application!';
END $$;
