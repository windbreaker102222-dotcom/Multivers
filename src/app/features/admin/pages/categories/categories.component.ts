import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import { Category, Product } from '../../../../models/database.types';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="categories-container">
      <header class="categories-header">
        <h1>Gestion des Catégories</h1>
        <button class="add-btn" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'Annuler' : 'Ajouter une catégorie' }}
        </button>
      </header>

      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            [(ngModel)]="searchQuery"
            placeholder="Rechercher une catégorie..."
            (keyup.enter)="performSearch()">
          <button class="search-btn" (click)="performSearch()">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      @if (showAddForm) {
        <div class="add-category-form">
          <h2>{{ editingCategory ? 'Modifier' : 'Ajouter' }} une catégorie</h2>
          <form (ngSubmit)="saveCategory()" #categoryForm="ngForm">
            <div class="form-group">
              <label for="name">Nom de la catégorie *</label>
              <input 
                type="text" 
                id="name"
                [(ngModel)]="categoryData.name"
                name="name"
                placeholder="Ex: Électroménagers"
                required>
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description"
                [(ngModel)]="categoryData.description"
                name="description"
                placeholder="Description de la catégorie (optionnel)"
                rows="3">
              </textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="save-btn" [disabled]="!categoryForm.valid || isLoading">
                {{ isLoading ? 'Sauvegarde...' : (editingCategory ? 'Modifier' : 'Ajouter') }}
              </button>
              <button type="button" class="cancel-btn" (click)="cancelEdit()">
                Annuler
              </button>
            </div>
          </form>
        </div>
      }

      <div class="categories-list">
        <h2>Liste des catégories ({{ filteredCategories.length }})</h2>
        @if (filteredCategories.length > 0) {
          <div class="categories-grid">
            @for (category of filteredCategories; track category.id) {
              <div class="category-card">
                <div class="category-info">
                  <h3>{{ category.name }}</h3>
                  @if (category.description) {
                    <p class="category-description">{{ category.description }}</p>
                  }
                  <p>{{ getProductCount(category.id) }} produit(s)</p>
                  <small>Créée le {{ formatDate(category.created_at) }}</small>
                </div>
                <div class="category-actions">
                  <button class="edit-btn" (click)="editCategory(category)">
                    Modifier
                  </button>
                  <button class="delete-btn" (click)="deleteCategory(category.id)">
                    Supprimer
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="no-categories">Aucune catégorie créée pour le moment.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .categories-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .categories-header h1 {
      color: var(--color-text);
      margin: 0;
    }

    .add-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .add-btn:hover {
      background: #5a6fd8;
    }

    .add-category-form {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      margin-bottom: 3rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--color-text);
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 1rem;
      background: var(--color-background);
      color: var(--color-text);
      font-family: inherit;
      resize: vertical;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
    }

    .save-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .save-btn:hover:not(:disabled) {
      background: #218838;
    }

    .save-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .cancel-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .cancel-btn:hover {
      background: #5a6268;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .category-card {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .category-info {
      padding: 1rem;
    }

    .category-info h3 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text);
      font-size: 1.25rem;
    }

    .category-info p {
      color: var(--color-primary);
      font-weight: 500;
      margin: 0.5rem 0;
    }

    .category-description {
      color: var(--color-text-muted) !important;
      font-weight: 400 !important;
      font-size: 0.9rem;
      font-style: italic;
      margin: 0.25rem 0 !important;
    }

    .category-info small {
      color: var(--color-text-muted);
    }

    .category-actions {
      padding: 0.75rem 1rem;
      background: var(--color-background-alt);
      display: flex;
      gap: 0.5rem;
    }

    .category-actions button {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .edit-btn {
      background: #ffc107;
      color: #212529;
    }

    .edit-btn:hover {
      background: #e0a800;
    }

    .delete-btn {
      background: #dc3545;
      color: white;
    }

    .delete-btn:hover {
      background: #c82333;
    }

    .no-categories {
      text-align: center;
      color: var(--color-text-light);
      margin-bottom: 1.5rem;
    }

    h2 {
      color: var(--color-text);
      margin-bottom: 1.5rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .categories-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .categories-grid {
        grid-template-columns: 1fr;
      }
    }

    .search-section {
      margin-bottom: 2rem;
    }

    .search-box {
      display: flex;
      max-width: 600px;
      margin: 0 auto;
      background: var(--color-surface);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
    }

    .search-input {
      flex: 1;
      padding: 1rem;
      border: none;
      background: transparent;
      color: var(--color-text);
      font-size: 1rem;
    }

    .search-input::placeholder {
      color: var(--color-text-muted);
    }

    .search-btn {
      padding: 1rem 1.5rem;
      background: var(--color-primary);
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .search-btn:hover {
      background: var(--color-primary-dark);
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  showAddForm = false;
  editingCategory: Category | null = null;
  isLoading = false;
  searchQuery = '';

  categoryData = {
    name: '',
    description: '',
    is_active: true
  };

  get filteredCategories(): Category[] {
    if (!this.searchQuery.trim()) {
      return this.categories;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.categories.filter(category => 
      category.name.toLowerCase().includes(query) ||
      (category.description && category.description.toLowerCase().includes(query))
    );
  }

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadCategories();
    await this.loadProducts();
  }

  async loadCategories() {
    const { data, error } = await this.supabaseService.getCategories();
    if (data && !error) {
      this.categories = data;
    }
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.categoryData = {
      name: category.name,
      description: category.description || '',
      is_active: category.is_active
    };
    this.showAddForm = true;
  }

  async saveCategory() {
    this.isLoading = true;

    try {
      if (this.editingCategory) {
        // Modification
        const { error } = await this.supabaseService.updateCategory(
          this.editingCategory.id,
          this.categoryData
        );
        if (!error) {
          await this.loadCategories();
          this.cancelEdit();
        }
      } else {
        // Création
        const { error } = await this.supabaseService.createCategory(this.categoryData);
        if (!error) {
          await this.loadCategories();
          this.cancelEdit();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteCategory(categoryId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      const { error } = await this.supabaseService.deleteCategory(categoryId);
      if (!error) {
        await this.loadCategories();
      }
    }
  }

  cancelEdit() {
    this.showAddForm = false;
    this.editingCategory = null;
    this.categoryData = {
      name: '',
      description: '',
      is_active: true
    };
  }

  async loadProducts() {
    const { data, error } = await this.supabaseService.getProducts();
    if (data && !error) {
      this.products = data;
    }
  }

  getProductCount(categoryId: string): number {
    return this.products.filter(p => p.category_id === categoryId).length;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  performSearch() {
    // La recherche est déjà gérée par le getter filteredCategories
    // Cette méthode peut être utilisée pour des actions supplémentaires si nécessaire
  }
}
