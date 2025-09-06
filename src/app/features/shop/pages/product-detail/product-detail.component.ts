import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import { WhatsappService } from '../../../../services/whatsapp.service';
import { Product } from '../../../../models/database.types';
import { FcfaPipe } from '../../../../pipes/currency.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FcfaPipe],
  template: `
    <div class="product-detail-container">
      @if (product) {
        <div class="product-detail">
          <div class="product-image-section">
            @if (product.image_url) {
              <img [src]="product.image_url" [alt]="product.name" class="product-image">
            } @else {
              <div class="no-image">Pas d'image disponible</div>
            }
          </div>
          
          <div class="product-info-section">
            <div class="breadcrumb">
              <a routerLink="/shop">Catalogue</a> > 
              <a [routerLink]="['/shop/category', product.category_id]">{{ product.category?.name }}</a> > 
              {{ product.name }}
            </div>
            
            <h1>{{ product.name }}</h1>
            <p class="product-price">{{ product.price | fcfa }}</p>
            <p class="product-description">{{ product.description }}</p>
            
            <div class="share-section">
              <h3>Partager ce produit</h3>
              <div class="share-buttons">
                <button class="share-btn whatsapp" (click)="shareOnWhatsApp()">
                  <i class="fab fa-whatsapp"></i>
                  Partager sur WhatsApp
                </button>
                <button class="share-btn copy-link" (click)="copyProductLink()">
                  <i class="fas fa-link"></i>
                  Copier le lien
                </button>
              </div>
              @if (linkCopied) {
                <div class="copy-success">
                  <i class="fas fa-check"></i>
                  Lien copié dans le presse-papiers !
                </div>
              }
            </div>

            <div class="order-section">
              <h3>Commander ce produit</h3>
              
              <!-- Option 1: Commande directe WhatsApp -->
              <div class="order-option">
                <h4>Commande rapide</h4>
                <button 
                  class="whatsapp-btn direct"
                  (click)="orderDirectWhatsApp()">
                  <span class="whatsapp-icon">
                    <i class="fab fa-whatsapp"></i>
                  </span>
                  Commander via WhatsApp
                </button>
              </div>
              
              <!-- Option 2: Formulaire avec détails -->
              <div class="order-option">
                <h4>Commande avec détails</h4>
                <form (ngSubmit)="orderWithDetails()" #orderForm="ngForm">
                  <div class="form-group">
                    <label for="clientName">Votre nom *</label>
                    <input 
                      type="text" 
                      id="clientName"
                      [(ngModel)]="orderData.clientName"
                      name="clientName"
                      required>
                  </div>
                  
                  <div class="form-group">
                    <label for="clientPhone">Votre téléphone *</label>
                    <input 
                      type="tel" 
                      id="clientPhone"
                      [(ngModel)]="orderData.clientPhone"
                      name="clientPhone"
                      required>
                  </div>
                  
                  <div class="form-group">
                    <label for="clientMessage">Message (optionnel)</label>
                    <textarea 
                      id="clientMessage"
                      [(ngModel)]="orderData.clientMessage"
                      name="clientMessage"
                      placeholder="Quantité souhaitée, questions spécifiques..."></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    class="whatsapp-btn detailed"
                    [disabled]="!orderForm.valid">
                    <span class="whatsapp-icon">
                      <i class="fab fa-whatsapp"></i>
                    </span>
                    Envoyer la commande
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="loading">Chargement du produit...</div>
      }
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .product-image-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .product-image {
      width: 100%;
      max-width: 500px;
      height: auto;
      border-radius: 12px;
      box-shadow: var(--shadow-md);
    }

    .share-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: var(--color-surface);
      border-radius: 12px;
      border: 1px solid var(--color-border);
    }

    .share-section h3 {
      margin: 0 0 1rem 0;
      color: var(--color-text);
      font-size: 1.2rem;
    }

    .share-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .share-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .share-btn.whatsapp {
      background: #25D366;
      color: white;
    }

    .share-btn.whatsapp:hover {
      background: #1ea952;
      transform: translateY(-1px);
    }

    .share-btn.copy-link {
      background: var(--color-primary);
      color: white;
    }

    .share-btn.copy-link:hover {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
    }

    .copy-success {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .no-image {
      width: 100%;
      height: 400px;
      background: var(--color-background-alt);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      font-style: italic;
      border-radius: 12px;
    }

    .breadcrumb {
      color: var(--color-text-light);
      margin-bottom: 1rem;
    }

    .breadcrumb a {
      color: var(--color-primary);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .product-info-section h1 {
      font-size: 2rem;
      color: var(--color-text);
      margin-bottom: 1rem;
    }

    .product-price {
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--color-primary);
      margin-bottom: 1.5rem;
    }

    .product-description {
      color: var(--color-text-light);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .order-section {
      background: var(--color-background-alt);
      border: 1px solid var(--color-border);
      padding: 2rem;
      border-radius: 12px;
    }

    .order-section h3 {
      margin-top: 0;
      color: var(--color-text);
    }

    .order-option {
      margin-bottom: 2rem;
    }

    .order-option h4 {
      color: var(--color-text-light);
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
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
    }

    .form-group textarea {
      height: 100px;
      resize: vertical;
    }

    .whatsapp-btn {
      background: #25D366;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.3s ease;
      width: 100%;
      justify-content: center;
    }

    .whatsapp-btn:hover:not(:disabled) {
      background: #20b358;
    }

    .whatsapp-btn:disabled {
      background: var(--color-text-muted);
      cursor: not-allowed;
      opacity: 0.6;
    }

    .whatsapp-icon {
      font-size: 1.2rem;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: var(--color-text-light);
    }

    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  linkCopied = false;
  orderData = {
    clientName: '',
    clientPhone: '',
    clientMessage: ''
  };

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private whatsappService: WhatsappService
  ) {}

  async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      await this.loadProduct(productId);
    }
  }

  async loadProduct(id: string) {
    const { data, error } = await this.supabaseService.getProduct(id);
    if (data && !error) {
      this.product = data;
    }
  }

  orderDirectWhatsApp() {
    if (!this.product) return;
    
    const whatsappLink = this.whatsappService.generateWhatsAppLink(
      this.product.name,
      this.product.price
    );
    
    this.whatsappService.openWhatsApp(whatsappLink);
  }

  shareOnWhatsApp() {
    if (!this.product) return;
    
    const productUrl = `${window.location.origin}/shop/product/${this.product.id}`;
    const message = `Découvrez ce produit : ${this.product.name} - ${this.product.price} FCFA\n${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  }

  async copyProductLink() {
    if (!this.product) return;
    
    const productUrl = `${window.location.origin}/shop/product/${this.product.id}`;
    
    try {
      await navigator.clipboard.writeText(productUrl);
      this.linkCopied = true;
      
      // Masquer le message après 3 secondes
      setTimeout(() => {
        this.linkCopied = false;
      }, 3000);
    } catch (err) {
      // Fallback pour les navigateurs qui ne supportent pas l'API clipboard
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      this.linkCopied = true;
      setTimeout(() => {
        this.linkCopied = false;
      }, 3000);
    }
  }

  async orderWithDetails() {
    if (!this.product) return;
    
    // Sauvegarder la commande en base
    const orderData = {
      product_id: this.product.id,
      client_name: this.orderData.clientName,
      client_phone: this.orderData.clientPhone,
      client_message: this.orderData.clientMessage || `Je souhaite commander ${this.product.name}`,
      quantity: 1,
      unit_price: this.product.price,
      whatsapp_sent: false,
      status: 'pending' as const
    };

    const { error } = await this.supabaseService.createOrder(orderData);
    
    if (!error) {
      // Générer le lien WhatsApp avec les détails
      const whatsappLink = this.whatsappService.generateOrderWhatsAppLink(
        this.product.name,
        this.product.price,
        this.orderData.clientName,
        this.orderData.clientPhone,
        this.orderData.clientMessage
      );
      
      this.whatsappService.openWhatsApp(whatsappLink);
      
      // Reset du formulaire
      this.orderData = {
        clientName: '',
        clientPhone: '',
        clientMessage: ''
      };
    }
  }
}
