# Configuration Multivers E-commerce

## 1. Installation des dépendances

```bash
npm install @supabase/supabase-js
```

## 2. Configuration Supabase

### Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez votre URL et clé anonyme

### Mettre à jour les variables d'environnement
Dans `src/environments/environment.ts` et `environment.prod.ts`:
```typescript
export const environment = {
  production: false, // true pour prod
  supabase: {
    url: 'https://votre-projet.supabase.co',
    anonKey: 'votre-cle-anonyme'
  },
  whatsapp: {
    adminPhone: '+33123456789' // Votre numéro WhatsApp
  }
};
```

## 3. Création des tables Supabase

Exécutez ces requêtes SQL dans l'éditeur Supabase :

```sql
-- Table des profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'client')) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Table des catégories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_message TEXT,
  status TEXT CHECK (status IN ('pending', 'contacted', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Configuration Row Level Security (RLS)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour categories (lecture publique, écriture admin)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politiques pour products (lecture publique des actifs, écriture admin)
CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Only admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politiques pour orders (création publique, gestion admin)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view and manage orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

## 5. Configuration Storage

```sql
-- Créer un bucket pour les images produits
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Politique pour upload d'images (admin seulement)
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politique pour lecture publique des images
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');
```

## 6. Créer le premier admin

Après avoir configuré les tables, créez votre premier compte admin :

1. Allez sur `/auth/register`
2. Créez un compte avec votre email
3. Dans Supabase, mettez à jour manuellement le rôle :

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre-email@example.com';
```

## 7. Lancer l'application

```bash
ng serve
```

L'application sera disponible sur `http://localhost:4200`

## Structure des URLs

- `/shop` - Catalogue client
- `/shop/category/:id` - Produits par catégorie  
- `/shop/product/:id` - Détail produit
- `/admin` - Dashboard admin
- `/admin/categories` - Gestion catégories
- `/admin/products` - Gestion produits
- `/admin/orders` - Gestion commandes
- `/auth/login` - Connexion admin
- `/auth/register` - Inscription admin
