import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import { Category, Product } from '../../../../models/database.types';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="catalog-container">
      <!-- Hero Banner Professionnel -->

      <div class="catalog-content">
        <!-- Categories Slider -->
        <div class="categories-slider-container">
          <div class="slider-header">
            <h2>Catégories</h2>
            <p>Sélectionnez votre domaine</p>
          </div>
          
          <div class="categories-slider">
            <div class="category-slide" 
                 [class.active]="selectedCategory === null"
                 (click)="filterByCategory(null)">
              <div class="category-icon">
                <i class="fas fa-th-large"></i>
              </div>
              <span class="category-name">Tous les produits</span>
            </div>
            
            @for (category of categories; track category.id) {
              <div class="category-slide" 
                   [class.active]="selectedCategory === category.id"
                   (click)="filterByCategory(category.id)">
                <div class="category-icon">
                  <i [class]="getCategoryIcon(category.name)"></i>
                </div>
                <span class="category-name">{{ category.name }}</span>
              </div>
            }
          </div>
        </div>

        <div class="main-layout">

          <!-- Zone principale des produits -->
          <main class="products-main">
            <div class="products-header">
              <div class="header-content">
                <div class="header-title">
                  <h2>
                    @if (selectedCategory) {
                      {{ getCategoryName(selectedCategory) }}
                    } @else {
                      Catalogue complet
                    }
                  </h2>
                  <div class="breadcrumb">
                    <span>Accueil</span>
                    <i class="fas fa-chevron-right"></i>
                    <span>Catalogue</span>
                    @if (selectedCategory) {
                      <i class="fas fa-chevron-right"></i>
                      <span>{{ getCategoryName(selectedCategory) }}</span>
                    }
                  </div>
                </div>
                <div class="header-actions">
                  <div class="results-count">
                    <span class="count-number">{{ featuredProducts.length }}</span>
                    <span class="count-text">produits disponibles</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="products-grid">
              @for (product of featuredProducts; track product.id) {
                <div class="product-card" [routerLink]="['/shop/product', product.id]">
                  <div class="product-badge">
                    <span class="badge-new">DISPONIBLE</span>
                  </div>
                  <div class="product-image">
                    @if (product.image_url) {
                      <img [src]="product.image_url" [alt]="product.name" loading="lazy">
                    } @else {
                      <div class="placeholder-image">
                        <i class="fas fa-image"></i>
                        <span>Image à venir</span>
                      </div>
                    } 
                  </div>
                  <div class="product-info">
                    <div class="product-category">{{ getCategoryName(product.category_id) }}</div>
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-description">{{ product.description }}</p>
                    <div class="product-footer">
                      <div class="price-section">
                        <span class="product-price">{{ formatPrice(product.price) }}</span> 
                      </div>
                       
                    </div>
                  </div>
                </div>
              }
            </div>

            @if (featuredProducts.length === 0) {
              <div class="empty-state">
                <i class="fas fa-clock"></i>
                <h3>Aucun produit disponible</h3>
                <p>Cette catégorie sera bientôt disponible avec de nouveaux produits.</p>
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Utilisation des variables de thème globales */

    * {
      box-sizing: border-box;
    }

    .catalog-container {
      max-width: 1400px;
      margin: 0 auto;
      background: var(--color-background);
    }

    /* Hero Banner avec Image de Fond */
    .hero-banner {
      position: relative;
      background: 
        linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%),
        url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover;
      color: white;
      padding: 2rem 2rem 1.5rem;
      margin-bottom: 0;
      overflow: hidden;
      border-bottom: 5px solid var(--accent);
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.4;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 900px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1.5rem;
      border-radius: 50px;
      margin-bottom: 2rem;
    }

    .badge-text {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .hero-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1rem;
      opacity: 0.9;
      margin-bottom: 1.5rem;
      line-height: 1.5;
      font-weight: 400;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem 1.5rem;
      border-radius: var(--radius-lg);
      max-width: 400px;
      margin: 0 auto;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-number {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.125rem;
      color: var(--accent-light);
    }

    .stat-label {
      font-size: 0.75rem;
      opacity: 0.8;
      font-weight: 500;
    }

    .stat-divider {
      width: 1px;
      height: 30px;
      background: rgba(255, 255, 255, 0.3);
    }

    /* Categories Slider Styles */
    .categories-slider-container {
      margin-bottom: 3rem;
      padding: 0 1rem;
    }

    .slider-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .slider-header h2 {
      color: var(--text-color);
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .slider-header p {
      color: var(--text-muted);
      font-size: 1.1rem;
      margin: 0;
    }

    .categories-slider {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      padding: 1rem 0 2rem 0;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: var(--primary-color) transparent;
    }

    .categories-slider::-webkit-scrollbar {
      height: 6px;
    }

    .categories-slider::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.1);
      border-radius: 3px;
    }

    .categories-slider::-webkit-scrollbar-thumb {
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      border-radius: 3px;
    }

    .category-slide {
      min-width: 160px;
      height: 120px;
      background: var(--card-background);
      border-radius: 20px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0.75rem;
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }

    .category-slide::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
    }

    .category-slide:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.15);
      border-color: var(--primary-color);
    }

    .category-slide:hover::before {
      opacity: 0.1;
    }

    .category-slide.active {
      border-color: var(--primary-color);
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.2);
    }

    .category-slide.active .category-icon {
      color: white;
    }

    .category-slide.active .category-name {
      color: white;
    }

    .category-icon {
      width: 50px;
      height: 50px;
      background: rgba(var(--primary-rgb), 0.1);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-color);
      font-size: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .category-slide:hover .category-icon {
      background: rgba(var(--primary-rgb), 0.2);
      transform: scale(1.1);
    }

    .category-slide.active .category-icon {
      background: rgba(255,255,255,0.2);
      color: white;
    }

    .category-name {
      color: var(--text-color);
      font-weight: 600;
      font-size: 0.9rem;
      line-height: 1.2;
      transition: color 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .catalog-content {
      padding: 2rem;
      background: var(--color-background-alt);
    }

    /* Layout principal */
    .main-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Zone principale des produits */
    .products-main {
      min-height: 600px;
    }

    .products-header {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: var(--shadow-sm);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-title h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: var(--color-text);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .breadcrumb span:last-child {
      color: var(--color-primary);
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .search-container {
      flex: 1;
      max-width: 400px;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
      z-index: 2;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: 2px solid var(--border);
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      background: var(--background);
      color: var(--text-primary);
      transition: var(--transition);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .clear-search {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }

    .clear-search:hover {
      background: var(--background-dark);
      color: var(--text-primary);
    }

    .results-count {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }

    .count-number {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-primary);
      line-height: 1;
    }

    .count-text {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    /* Grille des produits - 4 par ligne */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .product-card {
      background: var(--color-background);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
      transition: var(--transition-fast);
      cursor: pointer;
      position: relative;
    }

    .product-card:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-8px);
      border-color: var(--color-primary);
    }

    .product-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 3;
    }

    .badge-new {
      background: var(--color-primary);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .product-image {
      height: 180px;
      background: var(--color-background-alt);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.1);
    }

    .placeholder-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      text-align: center;
      gap: 0.5rem;
    }

    .placeholder-image span {
      font-size: 0.875rem;
      font-weight: 500;
    }
 
    .view-product-btn {
      background: var(--color-background);
      color: var(--color-text);
      border: 2px solid var(--color-primary);
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .view-product-btn:hover {
      background: var(--color-primary);
      color: white;
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .product-info {
      padding: 1rem;
    }

    .product-category {
      color: var(--color-primary);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      letter-spacing: 0.1em;
    }

    .product-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.3;
    }

    .product-description {
      color: var(--color-text-light);
      font-size: 0.8rem;
      line-height: 1.4;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }

    .price-section {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .product-price {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-text);
    }

    .price-label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      font-weight: 500;
    } 
    .rating-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-light);
      margin-left: 0.25rem;
    }

    /* État vide */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: var(--color-background);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
    }

    .empty-state svg {
      margin-bottom: 1.5rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      font-size: 1rem;
      line-height: 1.6;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .main-layout {
        grid-template-columns: 280px 1fr;
        gap: 2rem;
      }

      .categories-sidebar {
        padding: 1.5rem;
      }

      .products-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .catalog-content {
        padding: 2rem 1rem;
      }

      .hero-banner {
        padding: 3rem 1rem 2rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .hero-stats {
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;
      }

      .stat-divider {
        width: 40px;
        height: 1px;
      }

      .main-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .categories-sidebar {
        position: static;
        order: 2;
      }

      .products-main {
        order: 1;
      }

      .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .header-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .search-container {
        max-width: none;
      }
    }

    @media (max-width: 640px) {
      .products-grid {
        grid-template-columns: 1fr;
      }

      .hero-stats {
        flex-direction: row;
        gap: 1rem;
      }

      .stat-divider {
        width: 1px;
        height: 40px;
      }
    }
  `]
})
export class CatalogComponent implements OnInit, AfterViewInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  allProducts: Product[] = [];
  selectedCategory: string | null = null;
  searchTerm: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    await this.loadCategories();
    await this.loadFeaturedProducts();
    
    // Écouter les paramètres de recherche depuis l'URL
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
        this.applyFilters();
      }
    });
  }

  ngAfterViewInit() {
    // Initialisation supplémentaire si nécessaire
  }

  async loadCategories() {
    try {
      const { data, error } = await this.supabaseService.getCategories();
      if (data && !error) {
        this.categories = data;
      } else if (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    } catch (error) {
      console.error('Erreur inattendue lors du chargement des catégories:', error);
    }
  }

  async loadFeaturedProducts() {
    try {
      const { data, error } = await this.supabaseService.getProducts();
      if (data && !error) {
        this.allProducts = data;
        this.featuredProducts = data;
      } else if (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    } catch (error) {
      console.error('Erreur inattendue lors du chargement des produits:', error);
    }
  }

  formatPrice(price: number): string {
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    } catch (error) {
      // Fallback si la locale échoue
      return `${Math.round(price).toLocaleString('fr-FR')} FCFA`;
    }
  }

  getProductCountByCategory(categoryId: string): number {
    try {
      return this.allProducts.filter(p => p.category_id === categoryId).length;
    } catch (error) {
      console.warn('Erreur lors du comptage des produits par catégorie:', error);
      return 0;
    }
  }

  filterByCategory(categoryId: string | null) {
    try {
      this.selectedCategory = this.selectedCategory === categoryId ? null : categoryId;
      this.applyFilters();
    } catch (error) {
      console.error('Erreur lors du filtrage par catégorie:', error);
      // Fallback : afficher tous les produits
      this.featuredProducts = this.allProducts;
      this.selectedCategory = null;
    }
  }

  getCategoryName(categoryId: string | null | undefined): string {
    if (!categoryId) return 'Catégorie inconnue';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Catégorie inconnue';
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Électronique': 'fas fa-laptop',
      'Vêtements': 'fas fa-tshirt',
      'Maison & Jardin': 'fas fa-home',
      'Sport & Loisirs': 'fas fa-dumbbell',
      'Sucrerie': 'fas fa-candy-cane',
      'T-Shirt Premium': 'fas fa-tshirt',
      'vêtements': 'fas fa-tshirt',
      'Smartphones': 'fas fa-mobile-alt',
      'Ordinateurs': 'fas fa-laptop',
      'Tablettes': 'fas fa-tablet-alt',
      'Accessoires': 'fas fa-headphones',
      'Gaming': 'fas fa-gamepad',
      'Audio': 'fas fa-volume-up',
      'Photo': 'fas fa-camera',
      'Montres': 'fas fa-clock',
      'Télévision': 'fas fa-tv',
      'Électroménager': 'fas fa-blender',
      'Domotique': 'fas fa-home',
      'Réseaux': 'fas fa-globe',
      'Stockage': 'fas fa-database',
      'Sécurité': 'fas fa-shield-alt',
      'Câbles': 'fas fa-plug'
    };
    
    return iconMap[categoryName] || 'fas fa-box';
  }

  onSearchChange() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  private applyFilters() {
    let filteredProducts = this.allProducts;

    // Filtrer par catégorie
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(p => p.category_id === this.selectedCategory);
    }

    // Filtrer par recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    this.featuredProducts = filteredProducts;
  }
}