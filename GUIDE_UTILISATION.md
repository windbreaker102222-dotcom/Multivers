# Guide d'utilisation - MULTIVERS E-Commerce

## 📋 Table des matières
1. [Guide Administrateur](#guide-administrateur)
2. [Guide Client](#guide-client)
3. [Configuration technique](#configuration-technique)

---

## 🔧 Guide Administrateur

### Accès à l'interface d'administration

1. **Connexion**
   - Rendez-vous sur : `https://multivers-shop.vercel.app/auth/login`
   - Connectez-vous avec un compte administrateur
   - Vous serez automatiquement redirigé vers `/admin/dashboard`

2. **Navigation**
   - **Dashboard** : Vue d'ensemble des statistiques
   - **Produits** : Gestion complète des produits
   - **Catégories** : Organisation des catégories
   - **Commandes** : Suivi des commandes clients

### 📊 Dashboard - Vue d'ensemble

**Statistiques affichées :**
- Nombre total de produits actifs
- Nombre de catégories
- Commandes en attente
- Total des commandes

**Actions rapides disponibles :**
- Gérer les produits
- Gérer les catégories
- Voir les commandes
- Aperçu de la boutique côté client

**Commandes récentes :**
- Affichage des 5 dernières commandes
- Statuts : En attente, Contacté, Terminé
- Informations client et produit

### 🏷️ Gestion des Catégories

#### Créer une catégorie
1. Aller dans **Admin > Catégories**
2. Cliquer sur **"Ajouter une catégorie"**
3. Remplir les champs :
   - **Nom** : Nom de la catégorie (obligatoire)
   - **Description** : Description optionnelle
4. Cliquer sur **"Créer"**

#### Modifier une catégorie
1. Dans la liste des catégories, cliquer sur **"Modifier"**
2. Mettre à jour les informations
3. Cliquer sur **"Mettre à jour"**

#### Supprimer une catégorie
1. Cliquer sur **"Supprimer"** dans la liste
2. Confirmer la suppression
⚠️ **Attention** : Vérifiez qu'aucun produit n'est associé à cette catégorie

### 🛍️ Gestion des Produits

#### Créer un produit
1. Aller dans **Admin > Produits**
2. Cliquer sur **"Ajouter un produit"**
3. Remplir le formulaire :
   - **Nom** : Nom du produit (obligatoire)
   - **Description** : Description détaillée
   - **Prix** : Prix en FCFA (obligatoire)
   - **Catégorie** : Sélectionner dans la liste déroulante
   - **Image** : Télécharger une image (formats : JPG, PNG, WebP)
   - **Statut** : Actif/Inactif
4. Cliquer sur **"Créer le produit"**

#### Modifier un produit
1. Dans la liste des produits, cliquer sur **"Modifier"**
2. Mettre à jour les informations nécessaires
3. Pour changer l'image : sélectionner un nouveau fichier
4. Cliquer sur **"Mettre à jour"**

#### Gérer le statut des produits
- **Actif** : Visible dans la boutique
- **Inactif** : Masqué de la boutique (brouillon)

#### Supprimer un produit
1. Cliquer sur **"Supprimer"** dans la liste
2. Confirmer la suppression
⚠️ **Attention** : Cette action est irréversible

### 📦 Gestion des Commandes

#### Visualiser les commandes
1. Aller dans **Admin > Commandes**
2. Voir la liste complète avec :
   - Informations produit
   - Données client (nom, téléphone)
   - Message du client
   - Date de commande
   - Statut actuel

#### Traiter une commande
1. **Statuts disponibles :**
   - **En attente** : Nouvelle commande non traitée
   - **Contacté** : Client contacté, en cours de traitement
   - **Terminé** : Commande finalisée

2. **Changer le statut :**
   - Cliquer sur le menu déroulant du statut
   - Sélectionner le nouveau statut
   - La mise à jour est automatique

#### Contacter un client
- Utiliser le numéro de téléphone affiché
- Le bouton WhatsApp ouvre directement une conversation
- Message pré-rempli avec les détails de la commande

---

## 🛒 Guide Client

### Navigation sur la boutique

#### Page d'accueil
- **URL** : `https://multivers-shop.vercel.app/`
- **Actions disponibles :**
  - Découvrir le catalogue
  - Se connecter/s'inscrire

#### Catalogue des produits
- **URL** : `/shop`
- **Fonctionnalités :**
  - Voir tous les produits actifs
  - Filtrer par catégorie (sidebar)
  - Rechercher des produits (barre de recherche)
  - Voir les détails d'un produit

### 🔍 Recherche et navigation

#### Utiliser la recherche
1. Utiliser la barre de recherche en haut de page
2. Taper le nom du produit recherché
3. Appuyer sur Entrée ou cliquer sur la loupe
4. Les résultats s'affichent dans le catalogue

#### Filtrer par catégorie
1. Dans le catalogue, utiliser la sidebar gauche
2. Cliquer sur une catégorie pour filtrer
3. Seuls les produits de cette catégorie s'affichent
4. La description de la catégorie s'affiche si disponible

### 🛍️ Consulter un produit

#### Page produit
- **Informations affichées :**
  - Image du produit
  - Nom et description
  - Prix en FCFA
  - Catégorie
  - Bouton de commande WhatsApp

#### Commander un produit
1. Sur la page produit, cliquer sur **"Commander via WhatsApp"**
2. WhatsApp s'ouvre automatiquement
3. Message pré-rempli avec :
   - Nom du produit
   - Prix
   - Lien vers le produit
4. Compléter avec vos informations personnelles
5. Envoyer le message à l'administrateur

### 📱 Commande via WhatsApp

#### Processus de commande
1. **Message automatique généré :**
   ```
   Bonjour ! Je suis intéressé(e) par ce produit :
   
   📦 [Nom du produit]
   💰 Prix : [Prix] FCFA
   🔗 Lien : [URL du produit]
   
   Pouvez-vous me donner plus d'informations ?
   ```

2. **Informations à fournir :**
   - Votre nom complet
   - Votre adresse de livraison
   - Quantité souhaitée
   - Questions éventuelles

3. **Suivi de commande :**
   - L'administrateur vous contactera
   - Confirmation des détails
   - Modalités de paiement et livraison

### 🔐 Authentification (optionnelle)

#### Créer un compte
1. Aller sur `/auth/register`
2. Remplir :
   - Email
   - Mot de passe
   - Confirmation du mot de passe
3. Valider l'inscription

#### Se connecter
1. Aller sur `/auth/login`
2. Saisir email et mot de passe
3. Se connecter

⚠️ **Note** : L'authentification n'est pas obligatoire pour consulter et commander des produits.

---

## ⚙️ Configuration technique

### 🗄️ Base de données Supabase

#### Tables principales
- **profiles** : Gestion des utilisateurs et rôles
- **categories** : Catégories de produits
- **products** : Catalogue des produits
- **orders** : Commandes clients
- **app_settings** : Paramètres de l'application

#### Rôles utilisateurs
- **admin** : Accès complet à l'interface d'administration
- **client** : Accès standard à la boutique

### 🔧 Variables d'environnement

#### Configuration Supabase
```typescript
environment = {
  supabase: {
    url: 'https://yytgochkxcdobxffacln.supabase.co',
    anonKey: '[SUPABASE_ANON_KEY]'
  },
  whatsapp: {
    adminPhone: '+22891933619'
  }
}
```

### 📱 Intégration WhatsApp

#### Configuration
- **Numéro administrateur** : +228 91 93 36 19
- **Format des liens** : `https://wa.me/[NUMERO]?text=[MESSAGE]`
- **Encodage** : Messages automatiquement encodés pour URL

#### Messages types
- **Commande produit** : Informations produit + lien
- **Contact administrateur** : Message direct depuis les commandes

### 🚀 Déploiement Vercel

#### Configuration
- **Framework** : Angular 19.2.0
- **Build** : `ng build --configuration production`
- **Output** : `dist/multivers/browser`
- **Domaine** : `https://multivers-shop.vercel.app`

#### Fonctionnalités
- ✅ Déploiement automatique sur push GitHub
- ✅ HTTPS gratuit
- ✅ CDN mondial
- ✅ Support Angular SPA

---

## 🔍 Référencement Google (SEO)

### 📈 Optimisation pour les moteurs de recherche

#### Configuration SEO actuelle
L'application MULTIVERS est optimisée pour le référencement avec :
- **URLs propres** : `/shop`, `/shop/product/[id]`, `/shop/category/[id]`
- **Structure HTML sémantique** : balises appropriées (h1, h2, nav, main, footer)
- **Meta tags** : title, description pour chaque page
- **Images optimisées** : alt tags et compression automatique

#### Bonnes pratiques implémentées

**1. Structure des URLs**
```
✅ https://multivers-shop.vercel.app/shop
✅ https://multivers-shop.vercel.app/shop/product/123
✅ https://multivers-shop.vercel.app/shop/category/electronique
```

**2. Contenu optimisé**
- **Titres de pages** : Descriptifs et uniques
- **Descriptions produits** : Détaillées et riches en mots-clés
- **Noms de catégories** : Clairs et recherchables
- **Images** : Noms de fichiers descriptifs et alt tags

### 🚀 Améliorer le référencement

#### Pour les administrateurs

**1. Optimisation des produits**
- **Noms descriptifs** : "iPhone 14 Pro Max 256GB Noir" au lieu de "iPhone"
- **Descriptions riches** : Inclure caractéristiques, avantages, utilisation
- **Mots-clés pertinents** : Termes que vos clients recherchent
- **Images de qualité** : Noms explicites (ex: "iphone-14-pro-max-noir.jpg")

**2. Gestion des catégories**
- **Noms SEO-friendly** : "Smartphones et Téléphones" au lieu de "Phones"
- **Descriptions détaillées** : Expliquer le contenu de chaque catégorie
- **Hiérarchie logique** : Organiser par popularité et pertinence

**3. Contenu régulier**
- **Nouveaux produits** : Ajouter régulièrement du contenu frais
- **Mise à jour descriptions** : Améliorer les textes existants
- **Gestion stock** : Désactiver les produits non disponibles

#### Actions techniques recommandées

**1. Google Search Console**
```bash
# Ajouter votre site à Google Search Console
1. Aller sur https://search.google.com/search-console
2. Ajouter la propriété : https://multivers-shop.vercel.app
3. Vérifier la propriété via balise HTML ou DNS
4. Soumettre le sitemap : /sitemap.xml
```

**2. Google My Business**
- **Créer un profil** pour votre boutique physique
- **Ajouter photos** de vos produits et magasin
- **Collecter avis clients** pour améliorer la réputation
- **Publier régulièrement** actualités et promotions

**3. Réseaux sociaux**
- **Facebook Business** : Page professionnelle
- **Instagram Shopping** : Catalogue produits
- **WhatsApp Business** : Communication client optimisée

### 📊 Suivi et analytics

#### Métriques importantes
- **Trafic organique** : Visiteurs depuis Google
- **Mots-clés positionnés** : Termes sur lesquels vous apparaissez
- **Taux de conversion** : Visiteurs → Commandes WhatsApp
- **Temps de chargement** : Performance des pages

#### Outils recommandés
- **Google Analytics** : Suivi du trafic et comportement
- **Google Search Console** : Performance dans les résultats
- **PageSpeed Insights** : Optimisation de la vitesse
- **Google Keyword Planner** : Recherche de mots-clés

### 🎯 Stratégie de contenu

#### Mots-clés cibles (exemple Togo)
- **Génériques** : "boutique en ligne Togo", "e-commerce Lomé"
- **Produits** : "smartphone pas cher Togo", "électronique Lomé"
- **Locaux** : "livraison Lomé", "paiement mobile money"
- **Marques** : "[Marque] officiel Togo", "revendeur agréé"

#### Contenu à créer
- **Descriptions catégories** : Guides d'achat par catégorie
- **FAQ produits** : Questions fréquentes clients
- **Guides utilisation** : Comment choisir, utiliser vos produits
- **Actualités** : Nouveautés, promotions, conseils

### 📱 SEO mobile et local

#### Optimisation mobile
- ✅ **Design responsive** : Adapté tous écrans
- ✅ **Vitesse de chargement** : Optimisée pour mobile
- ✅ **Navigation tactile** : Boutons et liens accessibles
- ✅ **WhatsApp intégré** : Commande en un clic

#### Référencement local
- **Google My Business** : Profil complet avec adresse
- **Avis clients** : Encourager les retours positifs
- **Contenu local** : Mentionner Lomé, Togo dans les textes
- **Numéro local** : +228 visible et cliquable

### 🔧 Optimisations techniques

#### Performance
- ✅ **CDN Vercel** : Distribution mondiale rapide
- ✅ **Compression images** : Formats optimisés (WebP)
- ✅ **Cache navigateur** : Headers de mise en cache
- ✅ **HTTPS** : Sécurité et confiance Google

#### Structure technique
- ✅ **Sitemap XML** : Plan du site pour Google
- ✅ **Robots.txt** : Instructions pour les crawlers
- ✅ **Schema.org** : Données structurées e-commerce
- ✅ **Open Graph** : Partage réseaux sociaux optimisé

---

## 📞 Support et contact

### Informations de contact
- **Email** : contact@multivers.com
- **Téléphone** : +228 91 93 36 19
- **WhatsApp** : +228 91 93 36 19
- **Localisation** : Lomé, Togo

### Assistance technique
- **GitHub** : Repository du projet
- **Vercel** : Dashboard de déploiement
- **Supabase** : Dashboard de base de données

---

*Guide créé pour MULTIVERS E-Commerce - Version 1.0*
