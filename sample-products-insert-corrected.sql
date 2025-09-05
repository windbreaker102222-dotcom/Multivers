-- =====================================================
-- INSERTION DE 10 PRODUITS PAR CATÉGORIE
-- Version corrigée avec recherche dynamique des IDs de catégories
-- =====================================================

-- Catégorie: Électronique
INSERT INTO public.products (name, description, price, category_id, is_active, stock_quantity, sku, tags) 
SELECT 
  v.name, v.description, v.price, c.id, v.is_active, v.stock_quantity, v.sku, v.tags
FROM (VALUES
  ('iPhone 15 Pro Max', 'Smartphone Apple iPhone 15 Pro Max 256GB avec puce A17 Pro et caméra 48MP', 1299.99, true, 25, 'IP15PM-256', ARRAY['apple', 'smartphone', 'premium']),
  ('MacBook Air M3', 'Ordinateur portable Apple MacBook Air 13" avec puce M3 et 16GB RAM', 1499.99, true, 15, 'MBA-M3-16', ARRAY['apple', 'laptop', 'ultrabook']),
  ('Samsung Galaxy Tab S9', 'Tablette Samsung Galaxy Tab S9 11" 256GB avec S Pen inclus', 799.99, true, 20, 'TAB-S9-256', ARRAY['samsung', 'tablet', 'android']),
  ('AirPods Pro 2', 'Écouteurs sans fil Apple AirPods Pro 2ème génération avec réduction de bruit', 279.99, true, 50, 'APP2-USB-C', ARRAY['apple', 'earbuds', 'wireless']),
  ('Sony WH-1000XM5', 'Casque audio sans fil Sony avec réduction de bruit active premium', 399.99, true, 30, 'SONY-XM5', ARRAY['sony', 'headphones', 'noise-cancelling']),
  ('Nintendo Switch OLED', 'Console de jeu Nintendo Switch OLED avec écran 7 pouces', 349.99, true, 40, 'NSW-OLED', ARRAY['nintendo', 'gaming', 'console']),
  ('Canon EOS R6 Mark II', 'Appareil photo hybride Canon EOS R6 Mark II 24.2MP avec stabilisation', 2499.99, true, 8, 'EOS-R6M2', ARRAY['canon', 'camera', 'photography']),
  ('Apple Watch Series 9', 'Montre connectée Apple Watch Series 9 GPS 45mm avec bracelet sport', 449.99, true, 35, 'AW9-GPS-45', ARRAY['apple', 'smartwatch', 'fitness']),
  ('Samsung 55" QLED 4K', 'Téléviseur Samsung QLED 55" 4K UHD avec Quantum Dot et HDR10+', 1199.99, true, 12, 'SAM-Q55-4K', ARRAY['samsung', 'tv', 'qled']),
  ('Dyson V15 Detect', 'Aspirateur sans fil Dyson V15 Detect avec technologie laser', 749.99, true, 18, 'DYS-V15-DET', ARRAY['dyson', 'vacuum', 'cordless'])
) AS v(name, description, price, is_active, stock_quantity, sku, tags)
CROSS JOIN public.categories c
WHERE c.name = 'Électronique';

-- Catégorie: Sucrerie
INSERT INTO public.products (name, description, price, category_id, is_active, stock_quantity, sku, tags) 
SELECT 
  v.name, v.description, v.price, c.id, v.is_active, v.stock_quantity, v.sku, v.tags
FROM (VALUES
  ('Chocolat Noir 85%', 'Tablette chocolat noir 85% cacao origine Madagascar 100g', 8.99, true, 100, 'CHOC-NOIR-85', ARRAY['chocolate', 'dark', 'premium']),
  ('Bonbons Gélifiés Bio', 'Assortiment bonbons gélifiés bio aux fruits sans colorants', 5.99, true, 150, 'BONB-GEL-BIO', ARRAY['candy', 'organic', 'fruity']),
  ('Macarons Parisiens', 'Coffret 12 macarons parisiens saveurs assorties artisanales', 24.99, true, 50, 'MAC-PAR-12', ARRAY['macarons', 'french', 'artisan']),
  ('Miel Artisanal Lavande', 'Miel de lavande artisanal 250g récolté en Provence', 12.99, true, 80, 'MIEL-LAV-250', ARRAY['honey', 'lavender', 'artisan']),
  ('Caramels Beurre Salé', 'Caramels au beurre salé de Guérande faits main 200g', 9.99, true, 75, 'CAR-BS-200', ARRAY['caramel', 'salted-butter', 'handmade']),
  ('Nougat de Montélimar', 'Nougat tendre de Montélimar aux amandes et pistaches 150g', 14.99, true, 60, 'NOUG-MONT-150', ARRAY['nougat', 'almonds', 'traditional']),
  ('Pâtes de Fruits Premium', 'Pâtes de fruits premium aux saveurs exotiques coffret 300g', 18.99, true, 40, 'PAT-FRUIT-300', ARRAY['fruit-paste', 'exotic', 'premium']),
  ('Sucettes Artisanales', 'Sucettes artisanales colorées aux huiles essentielles bio', 3.99, true, 200, 'SUC-ART-BIO', ARRAY['lollipop', 'artisan', 'essential-oils']),
  ('Guimauves Vanille', 'Guimauves à la vanille bourbon faites maison 180g', 7.99, true, 90, 'GUIM-VAN-180', ARRAY['marshmallow', 'vanilla', 'homemade']),
  ('Réglisse Naturelle', 'Bâtons de réglisse naturelle sans additifs 100g', 6.99, true, 120, 'REG-NAT-100', ARRAY['licorice', 'natural', 'no-additives'])
) AS v(name, description, price, is_active, stock_quantity, sku, tags)
CROSS JOIN public.categories c
WHERE c.name = 'Sucrerie';

-- Catégorie: Maison & Jardin
INSERT INTO public.products (name, description, price, category_id, is_active, stock_quantity, sku, tags) 
SELECT 
  v.name, v.description, v.price, c.id, v.is_active, v.stock_quantity, v.sku, v.tags
FROM (VALUES
  ('Table Basse Industrielle', 'Table basse style industriel en métal et bois massif 120x60cm', 299.99, true, 12, 'TAB-IND-120', ARRAY['furniture', 'industrial', 'coffee-table']),
  ('Luminaire Suspension LED', 'Suspension LED moderne réglable en hauteur, éclairage 3000K', 159.99, true, 25, 'SUSP-LED-MOD', ARRAY['lighting', 'led', 'modern']),
  ('Plantes Dépolluantes Set', 'Lot de 5 plantes dépolluantes avec cache-pots assortis', 89.99, true, 30, 'PLANT-SET-5', ARRAY['plants', 'air-purifying', 'indoor']),
  ('Miroir Rond Doré', 'Miroir rond avec cadre doré vintage, diamètre 80cm, fixation murale', 199.99, true, 18, 'MIR-ROND-80', ARRAY['mirror', 'gold', 'vintage']),
  ('Coussin Velours Luxe', 'Coussin en velours premium 45x45cm, disponible 8 coloris', 49.99, true, 60, 'COUSS-VEL-45', ARRAY['cushion', 'velvet', 'luxury']),
  ('Barbecue Gaz 3 Brûleurs', 'Barbecue à gaz 3 brûleurs avec plancha et thermomètre intégré', 599.99, true, 8, 'BBQ-GAZ-3B', ARRAY['bbq', 'gas', 'outdoor']),
  ('Tapis Berbère Authentique', 'Tapis berbère fait main 200x300cm en laine naturelle', 449.99, true, 10, 'TAP-BERB-200', ARRAY['rug', 'handmade', 'wool']),
  ('Étagère Murale Design', 'Étagère murale design en chêne massif, 5 niveaux, 180cm hauteur', 329.99, true, 15, 'ETAG-CHENE-5', ARRAY['shelf', 'oak', 'wall-mounted']),
  ('Jardinière Verticale', 'Jardinière verticale 7 étages pour herbes aromatiques et légumes', 129.99, true, 22, 'JARD-VERT-7', ARRAY['planter', 'vertical', 'herbs']),
  ('Diffuseur Huiles Essentielles', 'Diffuseur ultrasonique 500ml avec 7 couleurs LED et minuterie', 79.99, true, 35, 'DIFF-HE-500', ARRAY['diffuser', 'aromatherapy', 'led'])
) AS v(name, description, price, is_active, stock_quantity, sku, tags)
CROSS JOIN public.categories c
WHERE c.name = 'Maison & Jardin';

-- Catégorie: Sport & Loisirs
INSERT INTO public.products (name, description, price, category_id, is_active, stock_quantity, sku, tags) 
SELECT 
  v.name, v.description, v.price, c.id, v.is_active, v.stock_quantity, v.sku, v.tags
FROM (VALUES
  ('Vélo Électrique Urbain', 'Vélo électrique urbain autonomie 80km, moteur 250W, batterie amovible', 1299.99, true, 10, 'VELO-ELEC-URB', ARRAY['ebike', 'urban', 'electric']),
  ('Tapis de Yoga Premium', 'Tapis de yoga antidérapant 6mm en TPE écologique avec sangle', 69.99, true, 45, 'TAP-YOGA-6MM', ARRAY['yoga', 'mat', 'eco-friendly']),
  ('Haltères Ajustables 40kg', 'Set d''haltères ajustables 5-40kg par haltère avec support inclus', 399.99, true, 15, 'HALT-ADJ-40', ARRAY['dumbbells', 'adjustable', 'fitness']),
  ('Raquette Tennis Pro', 'Raquette de tennis professionnelle cordée, poids 300g, grip L3', 189.99, true, 25, 'RAQ-TEN-PRO', ARRAY['tennis', 'racket', 'professional']),
  ('Sac de Couchage 4 Saisons', 'Sac de couchage 4 saisons -15°C, garnissage duvet, ultra-léger', 249.99, true, 20, 'SAC-COUCH-4S', ARRAY['sleeping-bag', 'camping', 'down']),
  ('Montre GPS Running', 'Montre GPS multisport avec cardio-fréquencemètre et navigation', 299.99, true, 30, 'MON-GPS-RUN', ARRAY['gps-watch', 'running', 'multisport']),
  ('Planche Paddle Gonflable', 'Stand Up Paddle gonflable 320cm avec pompe et pagaie incluses', 399.99, true, 12, 'SUP-GONF-320', ARRAY['sup', 'inflatable', 'water-sport']),
  ('Ballon Football Officiel', 'Ballon de football officiel FIFA taille 5, cuir synthétique', 39.99, true, 80, 'BAL-FOOT-FIFA', ARRAY['football', 'official', 'fifa']),
  ('Casque Vélo Urbain LED', 'Casque vélo urbain avec éclairage LED intégré et clignotants', 89.99, true, 40, 'CASQ-VEL-LED', ARRAY['helmet', 'bike', 'led']),
  ('Canne à Pêche Télescopique', 'Canne à pêche télescopique 3.6m carbone avec moulinet inclus', 149.99, true, 28, 'CANNE-TELE-36', ARRAY['fishing', 'telescopic', 'carbon'])
) AS v(name, description, price, is_active, stock_quantity, sku, tags)
CROSS JOIN public.categories c
WHERE c.name = 'Sport & Loisirs';

-- Ajout des nouvelles catégories manquantes
INSERT INTO public.categories (name, description, is_active) VALUES
  ('Sucrerie', 'Confiseries, chocolats et douceurs sucrées', true),
  ('T-Shirt Premium', 'Collection premium de t-shirts haute qualité', true),
  ('vêtements', 'Mode et vêtements pour tous', true)
ON CONFLICT (name) DO NOTHING;

-- Catégorie: T-Shirt Premium
INSERT INTO public.products (name, description, price, category_id, is_active, stock_quantity, sku, tags) 
SELECT 
  v.name, v.description, v.price, c.id, v.is_active, v.stock_quantity, v.sku, v.tags
FROM (VALUES
  ('T-Shirt Coton Bio Blanc', 'T-shirt premium en coton biologique certifié, coupe moderne', 29.99, true, 100, 'TSHIRT-BIO-W', ARRAY['cotton', 'organic', 'white']),
  ('T-Shirt Graphique Vintage', 'T-shirt avec design graphique vintage, impression sérigraphie', 34.99, true, 80, 'TSHIRT-VINT-G', ARRAY['graphic', 'vintage', 'print']),
  ('T-Shirt Oversize Noir', 'T-shirt oversize en coton premium, style streetwear moderne', 39.99, true, 90, 'TSHIRT-OVER-B', ARRAY['oversize', 'black', 'streetwear']),
  ('T-Shirt Rayé Marine', 'T-shirt rayé marinière en coton français, coupe classique', 32.99, true, 70, 'TSHIRT-RAY-M', ARRAY['striped', 'marine', 'classic']),
  ('T-Shirt Sport Tech', 'T-shirt technique respirant pour sport, séchage rapide', 44.99, true, 60, 'TSHIRT-TECH-S', ARRAY['sport', 'technical', 'breathable']),
  ('T-Shirt Col V Gris', 'T-shirt col V en coton mélangé, coupe ajustée élégante', 27.99, true, 85, 'TSHIRT-COLV-G', ARRAY['v-neck', 'grey', 'fitted']),
  ('T-Shirt Poche Beige', 'T-shirt avec poche poitrine, style décontracté chic', 31.99, true, 75, 'TSHIRT-POCH-B', ARRAY['pocket', 'beige', 'casual']),
  ('T-Shirt Longues Manches', 'T-shirt manches longues en jersey de coton, confort optimal', 36.99, true, 65, 'TSHIRT-LONG-J', ARRAY['long-sleeve', 'jersey', 'comfort']),
  ('T-Shirt Brodé Logo', 'T-shirt avec logo brodé discret, qualité premium', 42.99, true, 55, 'TSHIRT-BROD-L', ARRAY['embroidered', 'logo', 'premium']),
  ('T-Shirt Tie-Dye', 'T-shirt tie-dye fait main, chaque pièce unique', 38.99, true, 45, 'TSHIRT-TIE-D', ARRAY['tie-dye', 'handmade', 'unique'])
) AS v(name, description, price, is_active, stock_quantity, sku, tags)
CROSS JOIN public.categories c
WHERE c.name = 'T-Shirt Premium';

-- Catégorie: vêtements
INSERT INTO public.products (name, description, price, category_id, is_active, stock_quantity, sku, tags) 
SELECT 
  v.name, v.description, v.price, c.id, v.is_active, v.stock_quantity, v.sku, v.tags
FROM (VALUES
  ('Jean Slim Fit Premium', 'Jean homme coupe slim en denim stretch premium, taille haute', 89.99, true, 60, 'JEAN-SLIM-M', ARRAY['denim', 'men', 'slim-fit']),
  ('Robe d''été Florale', 'Robe femme d''été en viscose avec motifs floraux, coupe évasée', 69.99, true, 45, 'ROBE-ETE-F', ARRAY['dress', 'women', 'summer']),
  ('Chemise Oxford Classique', 'Chemise homme en coton Oxford, col boutonné, coupe regular', 59.99, true, 80, 'CHEM-OXF-M', ARRAY['shirt', 'men', 'cotton']),
  ('Blazer Femme Moderne', 'Blazer femme coupe moderne en polyester recyclé, parfait bureau', 129.99, true, 25, 'BLAZ-MOD-F', ARRAY['blazer', 'women', 'office']),
  ('Sneakers Urbaines', 'Baskets unisexe en cuir végétal avec semelle recyclée', 119.99, true, 70, 'SNEAK-URB-U', ARRAY['shoes', 'unisex', 'sustainable']),
  ('Pull Cachemire Doux', 'Pull femme en cachemire mélangé, col rond, disponible 5 couleurs', 149.99, true, 30, 'PULL-CASH-F', ARRAY['sweater', 'women', 'cashmere']),
  ('Short Sport Homme', 'Short homme de sport en polyester technique avec poches zippées', 39.99, true, 90, 'SHORT-SP-M', ARRAY['shorts', 'men', 'sport']),
  ('Veste Cuir Vintage', 'Veste en cuir véritable style vintage, doublure satin, coupe ajustée', 299.99, true, 15, 'VEST-CUIR-V', ARRAY['jacket', 'leather', 'vintage']),
  ('Lingerie Set Premium', 'Ensemble lingerie femme en dentelle française avec armatures', 79.99, true, 40, 'LING-PREM-F', ARRAY['lingerie', 'women', 'lace']),
  ('Costume 3 Pièces', 'Costume homme 3 pièces en laine mélangée, coupe slim moderne', 399.99, true, 20, 'COST-3P-M', ARRAY['suit', 'men', 'formal'])
) AS v(name, description, price, is_active, stock_quantity, sku, tags)
CROSS JOIN public.categories c
WHERE c.name = 'vêtements';
