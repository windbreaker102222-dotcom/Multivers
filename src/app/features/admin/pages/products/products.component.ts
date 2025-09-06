import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../../../services/supabase.service';
import { ImageCompressionService } from '../../../../services/image-compression.service';
import { Product, Category } from '../../../../models/database.types';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="products-container">
      <header class="products-header">
        <h1>Gestion des Produits</h1>
        <button class="add-btn" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'Annuler' : 'Ajouter un produit' }}
        </button>
      </header>

      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            [(ngModel)]="searchQuery"
            placeholder="Rechercher un produit..."
            (keyup.enter)="performSearch()">
          <button class="search-btn" (click)="performSearch()">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      @if (showAddForm) {
        <div class="add-product-form">
          <h2>{{ editingProduct ? 'Modifier' : 'Ajouter' }} un produit</h2>
          <form (ngSubmit)="saveProduct()" #productForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Nom du produit *</label>
                <input 
                  type="text" 
                  id="name"
                  [(ngModel)]="productData.name"
                  name="name"
                  required>
              </div>
              <div class="form-group">
                <label for="price">Prix (FCFA) *</label>
                <input 
                  type="number" 
                  id="price"
                  [(ngModel)]="productData.price"
                  name="price"
                  min="0"
                  step="0.01"
                  required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="category">Catégorie *</label>
              <select 
                id="category"
                [(ngModel)]="productData.category_id"
                name="category"
                required>
                <option value="">Sélectionner une catégorie</option>
                @for (category of categories; track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>
            </div>
            
            <div class="form-group">
              <label for="description">Description *</label>
              <textarea 
                id="description"
                [(ngModel)]="productData.description"
                name="description"
                required></textarea>
            </div>
            
            <div class="form-group">
              <label for="tags">Tags</label>
              <input 
                type="text" 
                id="tags"
                [(ngModel)]="productData.tags"
                name="tags"
                placeholder="Exemple: nouveau, promotion, telephone (séparés par des virgules)">
              <small class="form-help">Ajoutez des mots-clés pour améliorer la recherche (optionnel)</small>
            </div>
            
            <div class="form-group">
              <label class="upload-label">Image du produit</label>
              <div class="upload-container">
                <div class="upload-area" [class.has-file]="selectedFile" (click)="fileInput.click()">
                  <div class="upload-content">
                    @if (!selectedFile) {
                      <div class="upload-icon">📷</div>
                      <p class="upload-text">Cliquez pour sélectionner une image</p>
                      <p class="upload-hint">PNG, JPG, JPEG - Compression automatique</p>
                    } @else {
                      <div class="upload-icon">✅</div>
                      <p class="upload-text">{{ selectedFile.name }}</p>
                      <p class="upload-hint">{{ getFileSizeInfo() }}</p>
                    }
                  </div>
                </div>
                <input 
                  #fileInput
                  type="file" 
                  id="image"
                  (change)="onImageSelected($event)"
                  accept="image/*"
                  style="display: none;">
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="save-btn" [disabled]="!productForm.valid || isLoading">
                {{ isLoading ? 'Sauvegarde...' : (editingProduct ? 'Modifier' : 'Ajouter') }}
              </button>
              <button type="button" class="cancel-btn" (click)="cancelEdit()">
                Annuler
              </button>
            </div>
          </form>
        </div>
      }

      <div class="products-list">
        <h2>Liste des produits ({{ filteredProducts.length }})</h2>
        @if (filteredProducts.length > 0) {
          <div class="products-grid">
            @for (product of filteredProducts; track product.id) {
              <div class="product-card">
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
                  <p class="product-category">{{ product.category?.name }}</p>
                  <p class="product-status" [class]="product.is_active ? 'active' : 'inactive'">
                    {{ product.is_active ? 'Actif' : 'Inactif' }}
                  </p>
                </div>
                <div class="product-actions">
                  <button class="edit-btn" (click)="editProduct(product)">Modifier</button>
                  <button class="toggle-btn" (click)="toggleProductStatus(product)">
                    {{ product.is_active ? 'Désactiver' : 'Activer' }}
                  </button>
                  <button class="delete-btn" (click)="deleteProduct(product.id)">Supprimer</button>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="no-products">Aucun produit créé pour le moment.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .products-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .products-header h1 {
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

    .add-product-form {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      margin-bottom: 3rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
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
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 1rem;
      background: var(--color-background);
      color: var(--color-text);
    }

    .form-group textarea {
      height: 100px;
      resize: vertical;
    }

    .form-help {
      font-size: 0.875rem;
      color: var(--color-text-light);
      margin-top: 0.25rem;
      display: block;
    }

    .upload-container {
      margin-top: 0.5rem;
    }

    .upload-area {
      border: 2px dashed var(--color-border);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--color-background-alt);
    }

    .upload-area:hover {
      border-color: var(--color-primary);
      background: var(--color-primary-light);
    }

    .upload-area.has-file {
      border-color: var(--color-success);
      background: var(--color-success-light);
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .upload-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .upload-text {
      font-weight: 500;
      color: var(--color-text);
      margin: 0;
    }

    .upload-hint {
      font-size: 0.875rem;
      color: var(--color-text-light);
      margin: 0;
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

    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .product-card {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .product-image {
      height: 150px;
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
      padding: 1rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text);
    }

    .product-price {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--color-primary);
      margin: 0.5rem 0;
    }

    .product-category {
      color: var(--color-text-light);
      margin: 0.5rem 0;
    }

    .product-status {
      font-weight: 500;
      margin: 0;
    }

    .product-status.active {
      color: #28a745;
    }

    .product-status.inactive {
      color: #dc3545;
    }

    .product-actions {
      padding: 0.75rem 1rem;
      background: var(--color-background-alt);
      display: flex;
      gap: 0.5rem;
    }

    .product-actions button {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .edit-btn {
      background: #ffc107;
      color: #212529;
    }

    .edit-btn:hover {
      background: #e0a800;
    }

    .toggle-btn {
      background: #17a2b8;
      color: white;
    }

    .toggle-btn:hover {
      background: #138496;
    }

    .delete-btn {
      background: #dc3545;
      color: white;
    }

    .delete-btn:hover {
      background: #c82333;
    }

    .no-products {
      text-align: center;
      color: var(--color-text-light);
      padding: 2rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .products-grid {
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
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  showAddForm = false;
  editingProduct: Product | null = null;
  isLoading = false;
  selectedFile: File | null = null;
  originalFileSize: number = 0;
  searchQuery = '';

  get filteredProducts(): Product[] {
    if (!this.searchQuery.trim()) {
      return this.products;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.category?.name && product.category.name.toLowerCase().includes(query)) ||
      (Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  productData = {
    name: '',
    description: '',
    price: 0,
    category_id: '',
    is_active: true,
    stock_quantity: 0,
    tags: ''
  };

  constructor(
    private supabaseService: SupabaseService,
    private imageCompressionService: ImageCompressionService
  ) {}

  async ngOnInit() {
    await this.loadProducts();
    await this.loadCategories();
  }

  async loadProducts() {
    const { data, error } = await this.supabaseService.getAllProducts();
    if (data && !error) {
      this.products = data;
    }
  }

  async loadCategories() {
    const { data, error } = await this.supabaseService.getCategories();
    if (data && !error) {
      this.categories = data;
    }
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.productData = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      category_id: product.category_id || '',
      is_active: product.is_active,
      stock_quantity: product.stock_quantity,
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
    };
    this.showAddForm = true;
  }

  async saveProduct() {
    this.isLoading = true;

    try {
      // Convertir les tags string en array
      const productDataToSave = {
        ...this.productData,
        tags: this.productData.tags ? this.productData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
      };

      if (this.editingProduct) {
        // Modification
        const { error } = await this.supabaseService.updateProduct(
          this.editingProduct.id,
          productDataToSave
        );
        if (!error) {
          await this.handleImageUpload(this.editingProduct.id);
          await this.loadProducts();
          this.cancelEdit();
        }
      } else {
        // Création
        const { data, error } = await this.supabaseService.createProduct(productDataToSave);
        if (!error && data) {
          const newProductId = (data as any)[0]?.id;
          if (newProductId) {
            await this.handleImageUpload(newProductId);
          }
          await this.loadProducts();
          this.cancelEdit();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async handleImageUpload(productId: string) {
    if (!this.selectedFile) return;

    const { data, error } = await this.supabaseService.uploadProductImage(
      this.selectedFile,
      productId
    );
    
    if (error) {
      console.error('Erreur upload image:', error);
      return;
    }

    // Mettre à jour le produit avec l'URL de l'image
    if (data?.publicUrl) {
      const { error: updateError } = await this.supabaseService.updateProduct(productId, {
        image_url: data.publicUrl
      });
      
      if (updateError) {
        console.error('Erreur mise à jour image_url:', updateError);
      }
    }
  }

  async deleteProduct(productId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const { error } = await this.supabaseService.deleteProduct(productId);
      if (!error) {
        await this.loadProducts();
      }
    }
  }

  getFileSizeInfo(): string {
    if (!this.selectedFile) return '';
    
    const currentSize = this.imageCompressionService.formatFileSize(this.selectedFile.size);
    
    if (this.originalFileSize > 0 && this.originalFileSize !== this.selectedFile.size) {
      const originalSizeFormatted = this.imageCompressionService.formatFileSize(this.originalFileSize);
      const reduction = Math.round(((this.originalFileSize - this.selectedFile.size) / this.originalFileSize) * 100);
      return `${currentSize} (réduit de ${reduction}% depuis ${originalSizeFormatted})`;
    }
    
    return `${currentSize} - Cliquez pour changer`;
  }

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier si c'est une image
    if (!this.imageCompressionService.isImageFile(file)) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    this.originalFileSize = file.size;

    try {
      // Vérifier si la compression est nécessaire (fichiers > 500KB)
      if (this.imageCompressionService.needsCompression(file, 500)) {
        console.log(`Compression nécessaire. Taille originale: ${this.imageCompressionService.formatFileSize(file.size)}`);
        
        // Compresser l'image (800x600px max, qualité 0.8)
        this.selectedFile = await this.imageCompressionService.compressImage(file, 800, 600, 0.8);
        
        console.log(`Image compressée. Nouvelle taille: ${this.imageCompressionService.formatFileSize(this.selectedFile.size)}`);
      } else {
        // Fichier déjà assez petit, pas de compression nécessaire
        this.selectedFile = file;
        this.originalFileSize = 0; // Reset pour ne pas afficher de réduction
      }
    } catch (error) {
      console.error('Erreur lors de la compression:', error);
      alert('Erreur lors du traitement de l\'image. Veuillez réessayer.');
      this.selectedFile = null;
      this.originalFileSize = 0;
    }
  }

  toggleProductStatus(product: Product) {
    // Méthode pour basculer le statut actif/inactif d'un produit
    const newStatus = !product.is_active;
    this.supabaseService.updateProduct(product.id, { is_active: newStatus });
    product.is_active = newStatus;
  }

  cancelEdit() {
    this.showAddForm = false;
    this.editingProduct = null;
    this.selectedFile = null;
    this.originalFileSize = 0;
    this.productData = {
      name: '',
      description: '',
      price: 0,
      category_id: '',
      is_active: true,
      stock_quantity: 0,
      tags: ''
    };
  }

  performSearch() {
    // La recherche est déjà gérée par le getter filteredProducts
    // Cette méthode peut être utilisée pour des actions supplémentaires si nécessaire
  }
}
