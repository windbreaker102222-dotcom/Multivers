import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../../services/supabase.service';
import { Category, Product } from '../../../../models/database.types';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-container">
      @if (category) {
        <header class="category-header">
          <div class="breadcrumb">
            <a routerLink="/shop">Catalogue</a> > {{ category.name }}
          </div>
          <h1>{{ category.name }}</h1>
          <p>{{ products.length }} produit(s) disponible(s)</p>
        </header>

        <div class="products-grid">
          @for (product of products; track product.id) {
            <div class="product-card" [routerLink]="['/shop/product', product.id]">
              <div class="product-image">
                @if (product.image_url) {
                  <img [src]="product.image_url" [alt]="product.name">
                } @else {
                  <div class="no-image">Pas d'image</div>
                }
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="product-price">{{ product.price }} FCFA</p>
                <p class="product-description">{{ product.description | slice:0:100 }}...</p>
              </div>
            </div>
          } @empty {
            <div class="no-products">
              <p>Aucun produit disponible dans cette catégorie.</p>
              <a routerLink="/shop" class="back-link">Retour au catalogue</a>
            </div>
          }
        </div>
      } @else {
        <div class="loading">Chargement...</div>
      }
    </div>
  `,
  styles: [`
    .category-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .category-header {
      margin-bottom: 3rem;
    }

    .breadcrumb {
      color: var(--color-text-muted);
      margin-bottom: 1rem;
    }

    .breadcrumb a {
      color: var(--color-primary);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .category-header h1 {
      font-size: 2.5rem;
      color: var(--color-text);
      margin-bottom: 0.5rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: var(--color-surface);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-card);
      transition: transform 0.3s ease;
      text-decoration: none;
      color: inherit;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-image {
      height: 250px;
      background: var(--color-background-alt);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      color: var(--color-text-muted);
      font-style: italic;
    }

    .product-info {
      padding: 1.5rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
      color: var(--color-text);
    }

    .product-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--color-primary);
      margin: 0.5rem 0;
    }

    .product-description {
      color: var(--color-text-muted);
      line-height: 1.5;
      margin: 0;
    }

    .no-products {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--color-text-muted);
    }

    .back-link {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: var(--color-text-muted);
    }
  `]
})
export class CategoryComponent implements OnInit {
  category: Category | null = null;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      await this.loadCategoryAndProducts(categoryId);
    }
  }

  async loadCategoryAndProducts(categoryId: string) {
    // Charger la catégorie
    const { data: categories } = await this.supabaseService.getCategories();
    if (categories) {
      this.category = categories.find(c => c.id === categoryId) || null;
    }

    // Charger les produits de cette catégorie
    const { data: products, error } = await this.supabaseService.getProducts(categoryId);
    if (products && !error) {
      this.products = products;
    }
  }
}
