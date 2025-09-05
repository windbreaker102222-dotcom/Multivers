import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../../../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Gestion de votre boutique Multivers</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>{{ stats.totalProducts }}</h3>
          <p>Produits actifs</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.totalCategories }}</h3>
          <p>Catégories</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.pendingOrders }}</h3>
          <p>Commandes en attente</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.totalOrders }}</h3>
          <p>Total commandes</p>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Actions rapides</h2>
        <div class="actions-grid">
          <a routerLink="/admin/products" class="action-card">
            <h3><i class="fas fa-shopping-bag"></i> Gérer les produits</h3>
            <p>Ajouter, modifier ou supprimer des produits</p>
          </a>
          <a routerLink="/admin/categories" class="action-card">
            <h3><i class="fas fa-folder"></i> Gérer les catégories</h3>
            <p>Organiser vos produits par catégories</p>
          </a>
          <a routerLink="/admin/orders" class="action-card">
            <h3><i class="fas fa-clipboard-list"></i> Voir les commandes</h3>
            <p>Suivre et traiter les commandes clients</p>
          </a>
          <a routerLink="/shop" class="action-card">
            <h3><i class="fas fa-eye"></i> Voir la boutique</h3>
            <p>Aperçu côté client</p>
          </a>
        </div>
      </div>

      <div class="recent-orders">
        <h2>Commandes récentes</h2>
        @if (recentOrders.length > 0) {
          <div class="orders-list">
            @for (order of recentOrders; track order.id) {
              <div class="order-item">
                <div class="order-info">
                  <h4>{{ order.product?.name }}</h4>
                  <p>{{ order.client_name }} - {{ order.client_phone }}</p>
                  <p class="order-message">{{ order.client_message }}</p>
                </div>
                <div class="order-status">
                  <span class="status-badge" [class]="'status-' + order.status">
                    {{ getStatusLabel(order.status) }}
                  </span>
                  <small>{{ formatDate(order.created_at) }}</small>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="no-orders">Aucune commande récente</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      color: var(--color-text);
      margin-bottom: 0.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: var(--color-background);
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      text-align: center;
    }

    .stat-card h3 {
      font-size: 2rem;
      color: var(--color-primary-dark);
      margin: 0 0 0.5rem 0;
    }

    .stat-card p {
      color: var(--color-text-light);
      margin: 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .action-card {
      background: var(--color-background);
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      text-decoration: none;
      color: inherit;
      transition: transform var(--transition-normal);
    }

    .action-card:hover {
      transform: translateY(-5px);
    }

    .action-card h3 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text);
    }

    .action-card p {
      color: var(--color-text-light);
      margin: 0;
    }

    .orders-list {
      background: var(--color-background);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .order-info h4 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text);
    }

    .order-info p {
      margin: 0.25rem 0;
      color: var(--color-text-light);
    }

    .order-message {
      font-style: italic;
      font-size: 0.9rem;
    }

    .order-status {
      text-align: right;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-pending {
      background: var(--color-background-alt);
      color: var(--color-warning);
    }

    .status-contacted {
      background: var(--color-background-alt);
      color: var(--color-primary);
    }

    .status-completed {
      background: var(--color-background-alt);
      color: var(--color-success);
    }

    .no-orders {
      text-align: center;
      color: var(--color-text-light);
      padding: 2rem;
    }

    h2 {
      color: var(--color-text);
      margin-bottom: 1.5rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    totalProducts: 0,
    totalCategories: 0,
    pendingOrders: 0,
    totalOrders: 0
  };

  recentOrders: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadStats();
    await this.loadRecentOrders();
  }

  async loadStats() {
    // Charger les statistiques
    const [categoriesResult, productsResult, ordersResult] = await Promise.all([
      this.supabaseService.getCategories(),
      this.supabaseService.getAllProducts(),
      this.supabaseService.getOrders()
    ]);

    if (categoriesResult.data) {
      this.stats.totalCategories = categoriesResult.data.length;
    }

    if (productsResult.data) {
      this.stats.totalProducts = productsResult.data.filter(p => p.is_active).length;
    }

    if (ordersResult.data) {
      this.stats.totalOrders = ordersResult.data.length;
      this.stats.pendingOrders = ordersResult.data.filter(o => o.status === 'pending').length;
    }
  }

  async loadRecentOrders() {
    const { data, error } = await this.supabaseService.getOrders();
    if (data && !error) {
      this.recentOrders = data.slice(0, 5); // 5 commandes les plus récentes
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'contacted': return 'Contacté';
      case 'completed': return 'Terminé';
      default: return status;
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
}
