import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import { Order } from '../../../../models/database.types';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="orders-container">
      <header class="orders-header">
        <h1>Gestion des Commandes</h1>
        <div class="stats">
          <span class="stat pending">{{ getPendingCount() }} en attente</span>
          <span class="stat contacted">{{ getContactedCount() }} contactées</span>
          <span class="stat completed">{{ getCompletedCount() }} terminées</span>
        </div>
      </header>

      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            [(ngModel)]="searchQuery"
            placeholder="Rechercher une commande..."
            (keyup.enter)="performSearch()">
          <button class="search-btn" (click)="performSearch()">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <div class="filters">
        <button 
          class="filter-btn"
          [class.active]="currentFilter === 'all'"
          (click)="setFilter('all')">
          Toutes ({{ orders.length }})
        </button>
        <button 
          class="filter-btn"
          [class.active]="currentFilter === 'pending'"
          (click)="setFilter('pending')">
          En attente ({{ getPendingCount() }})
        </button>
        <button 
          class="filter-btn"
          [class.active]="currentFilter === 'contacted'"
          (click)="setFilter('contacted')">
          Contactées ({{ getContactedCount() }})
        </button>
        <button 
          class="filter-btn"
          [class.active]="currentFilter === 'completed'"
          (click)="setFilter('completed')">
          Terminées ({{ getCompletedCount() }})
        </button>
      </div>

      @if (searchFilteredOrders.length > 0) {
        <div class="orders-list">
          @for (order of searchFilteredOrders; track order.id) {
            <div class="order-card">
              <div class="order-header">
                <div class="order-product">
                  <h3>{{ order.product?.name }}</h3>
                  <p class="product-price">{{ order.product?.price }} FCFA</p>
                </div>
                <div class="order-status-section">
                  <select 
                    class="status-select"
                    [value]="order.status"
                    (change)="updateOrderStatus(order.id, $event)">
                    <option value="pending">En attente</option>
                    <option value="contacted">Contacté</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>
              </div>
              
              <div class="order-details">
                <div class="client-info">
                  <h4>Informations client</h4>
                  <p><strong>Nom:</strong> {{ order.client_name }}</p>
                  <p><strong>Téléphone:</strong> 
                    <a [href]="'tel:' + order.client_phone">{{ order.client_phone }}</a>
                  </p>
                  <p><strong>Message:</strong> {{ order.client_message }}</p>
                </div>
                
                <div class="order-meta">
                  <p><strong>Commande du:</strong> {{ formatDate(order.created_at) }}</p>
                  <div class="order-actions">
                    <a 
                      [href]="getWhatsAppLink(order)"
                      target="_blank"
                      class="whatsapp-btn">
<i class="fab fa-whatsapp"></i>
                      Contacter via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="no-orders">
          @if (currentFilter === 'all') {
            <p>Aucune commande pour le moment.</p>
          } @else {
            <p>Aucune commande avec le statut "{{ getFilterLabel(currentFilter) }}".</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .orders-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .orders-header h1 {
      color: var(--color-text);
      margin: 0;
    }

    .stats {
      display: flex;
      gap: 1rem;
    }

    .stat {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .stat.pending {
      background: var(--color-warning-light);
      color: var(--color-warning-dark);
    }

    .stat.contacted {
      background: var(--color-info-light);
      color: var(--color-info-dark);
    }

    .stat.completed {
      background: var(--color-success-light);
      color: var(--color-success-dark);
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid var(--color-border);
      background: var(--color-background);
      color: var(--color-text);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-btn.active {
      background: var(--color-primary);
      color: var(--color-secondary);
      border-color: var(--color-primary);
    }

    .filter-btn:hover {
      background: var(--color-background-alt);
    }

    .filter-btn.active:hover {
      background: var(--color-primary-dark);
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      background: var(--color-background);
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: var(--color-background-alt);
      border-bottom: 1px solid var(--color-border);
    }

    .order-product h3 {
      margin: 0 0 0.25rem 0;
      color: var(--color-text);
    }

    .product-price {
      color: var(--color-primary);
      font-weight: bold;
      margin: 0;
    }

    .status-select {
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background: var(--color-background);
      color: var(--color-text);
    }

    .order-details {
      padding: 1.5rem;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .client-info h4 {
      margin: 0 0 1rem 0;
      color: var(--color-text);
    }

    .client-info p {
      margin: 0.5rem 0;
      color: var(--color-text-light);
    }

    .client-info a {
      color: var(--color-primary);
      text-decoration: none;
    }

    .client-info a:hover {
      text-decoration: underline;
    }

    .order-meta {
      text-align: right;
    }

    .order-meta p {
      margin: 0 0 1rem 0;
      color: var(--color-text-light);
    }

    .whatsapp-btn {
      background: #25D366;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      display: inline-block;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .whatsapp-btn:hover {
      background: #20b358;
    }

    .no-orders {
      text-align: center;
      color: var(--color-text-light);
      padding: 3rem;
      background: var(--color-background);
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--color-border);
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

    @media (max-width: 768px) {
      .order-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .order-details {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .order-meta {
        text-align: left;
      }

      .stats {
        flex-wrap: wrap;
      }

      .filters {
        flex-wrap: wrap;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  currentFilter: 'all' | 'pending' | 'contacted' | 'completed' = 'all';
  searchQuery = '';

  get searchFilteredOrders(): Order[] {
    let filtered = this.filteredOrders;
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.client_name.toLowerCase().includes(query) ||
        order.client_phone.includes(query) ||
        (order.product?.name && order.product.name.toLowerCase().includes(query)) ||
        (order.client_message && order.client_message.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    const { data, error } = await this.supabaseService.getOrders();
    if (data && !error) {
      this.orders = data;
      this.applyFilter();
    }
  }

  setFilter(filter: 'all' | 'pending' | 'contacted' | 'completed') {
    this.currentFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.currentFilter);
    }
  }

  async updateOrderStatus(orderId: string, event: any) {
    const newStatus = event.target.value;
    const { error } = await this.supabaseService.updateOrderStatus(orderId, newStatus);
    
    if (!error) {
      await this.loadOrders();
    }
  }

  getWhatsAppLink(order: Order): string {
    const phone = order.client_phone.replace(/[^0-9]/g, '');
    const message = `Bonjour ${order.client_name}, concernant votre commande pour "${order.product?.name}", nous vous contactons pour finaliser votre achat.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  getPendingCount(): number {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  getContactedCount(): number {
    return this.orders.filter(o => o.status === 'contacted').length;
  }

  getCompletedCount(): number {
    return this.orders.filter(o => o.status === 'completed').length;
  }

  getFilterLabel(filter: string): string {
    switch (filter) {
      case 'pending': return 'en attente';
      case 'contacted': return 'contactées';
      case 'completed': return 'terminées';
      default: return filter;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  performSearch() {
    // La recherche est déjà gérée par le getter searchFilteredOrders
    // Cette méthode peut être utilisée pour des actions supplémentaires si nécessaire
  }
}
