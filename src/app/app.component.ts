import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from './services/theme.service';
import { SupabaseService } from './services/supabase.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <!-- Theme Toggle -->
      <button class="theme-toggle" (click)="toggleTheme()" [title]="'Basculer vers le thème ' + (currentTheme === 'light' ? 'sombre' : 'clair')">
        {{ currentTheme === 'light' ? '🌙' : '☀️' }}
      </button>

      <!-- Header -->
      <header class="header" *ngIf="showHeader">
        <div class="header-container">
          <div class="logo" routerLink="/home">
            <h2>MULTIVERS</h2>
            <span class="tagline">E-Commerce Premium</span>
          </div>
          
          <!-- Barre de recherche (masquée sur les pages admin) -->
          <div class="search-container" *ngIf="!isAdminPage">
            <div class="search-box">
              <input 
                type="text" 
                placeholder="Rechercher des produits..." 
                [(ngModel)]="searchQuery"
                (keyup.enter)="performSearch()"
                class="search-input">
              <button class="search-btn" (click)="performSearch()">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          
          <nav class="nav-links">
            <div class="auth-section">
              <ng-container *ngIf="!isAuthenticated && !isAdminPage">
                <a routerLink="/auth/login" class="btn btn-outline">Connexion</a>
                <a routerLink="/auth/register" class="btn btn-primary">Inscription</a>
              </ng-container>
              
              <ng-container *ngIf="isAuthenticated">
                <div class="user-profile">
                  <div class="user-icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="user-details">
                    <span class="user-email">{{ userEmail }}</span> 
                  </div>
                </div>
                <button (click)="logout()" class="btn btn-outline">Déconnexion</button>
              </ng-container>
            </div>
          </nav>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content" [class.with-header]="showHeader" [class.with-footer]="showFooter">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer" *ngIf="showFooter">
        <div class="footer-container">
          <div class="footer-section">
            <h4>MULTIVERS</h4>
            <p>Votre plateforme e-commerce de confiance</p>
            <div class="social-links">
              <a href="#" class="social-link">
                <i class="fas fa-envelope"></i>
              </a>
              <a href="#" class="social-link">
                <i class="fas fa-phone"></i>
              </a>
              <a href="#" class="social-link">
                <i class="fas fa-globe"></i>
              </a>
            </div>
          </div>
          
          <div class="footer-section">
            <h5>Navigation</h5>
            <ul>
              <li><a routerLink="/shop">Catalogue</a></li>
              <li><a routerLink="/shop/categories">Catégories</a></li>
              <li><a routerLink="/about">À propos</a></li>
              <li><a routerLink="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h5>Support</h5>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Livraison</a></li>
              <li><a href="#">Retours</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h5>Contact</h5>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>contact{{ '@' }}multivers.com</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <span>+228 91 93 36 19</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <a href="https://www.google.com/maps/place/6.26257,1.06954/" target="_blank" rel="noopener noreferrer">Lomé, Togo</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 MULTIVERS. Tous droits réservés.</p>
          <div class="footer-links">
            <a href="#">Politique de confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Header Styles */
    .header {
      background: var(--color-background);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-md) var(--spacing-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      cursor: pointer;
      transition: transform var(--transition-fast);
    }

    .logo:hover {
      transform: scale(1.02);
    }

    .logo h2 {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 1.75rem;
      margin: 0;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .tagline {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      font-weight: 400;
    }

    /* Search Container */
    .search-container {
      flex: 1;
      max-width: 500px;
      margin: 0 var(--spacing-xl);
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      padding-right: 50px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      background: var(--color-background-alt);
      color: var(--color-text);
      font-size: 0.875rem;
      transition: all var(--transition-fast);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-primary);
      background: var(--color-background);
      box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
    }

    .search-input::placeholder {
      color: var(--color-text-muted);
    }

    .search-btn {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      color: var(--color-text-light);
      cursor: pointer;
      padding: var(--spacing-xs);
      border-radius: var(--radius-sm);
      transition: color var(--transition-fast);
    }

    .search-btn:hover {
      color: var(--color-primary-dark);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .nav-link {
      text-decoration: none;
      color: var(--color-text);
      font-weight: 500;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .nav-link:hover,
    .nav-link.active {
      color: var(--color-primary-dark);
      background: var(--color-primary-light);
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
      background: var(--color-background-alt);
      border-radius: var(--radius-sm);
    }

    .user-icon {
      font-size: 1.5rem;
      color: var(--color-primary);
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-email {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text);
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      min-height: calc(100vh - 140px);
    }

    .main-content.with-header {
      padding-top: 0;
    }

    .main-content.with-footer {
      padding-bottom: 0;
    }

    /* Footer Styles */
    .footer {
      background: var(--color-secondary);
      color: var(--color-background);
      margin-top: auto;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-xxl) var(--spacing-lg) var(--spacing-xl);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-xl);
    }

    .footer-section h4,
    .footer-section h5 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-md);
    }

    .footer-section p {
      color: var(--color-background);
      opacity: 0.8;
      margin-bottom: var(--spacing-sm);
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .contact-item i {
      width: 16px;
      color: var(--color-background);
    }

    .contact-item a {
      color: inherit;
      text-decoration: none;
      transition: color var(--transition-normal);
    }

    .contact-item a:hover {
      color: var(--color-background);
      opacity: 0.8;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: var(--spacing-xs);
    }

    .footer-section ul li a {
      color: var(--color-background);
      text-decoration: none;
      opacity: 0.8;
      transition: opacity var(--transition-fast);
    }

    .footer-section ul li a:hover {
      opacity: 1;
      color: var(--color-primary);
    }

    .social-links {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--color-background);
      color: var(--color-secondary);
      border-radius: 50%;
      text-decoration: none;
      transition: all var(--transition-fast);
    }

    .social-link:hover {
      background: var(--color-primary);
      transform: translateY(-2px);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: var(--spacing-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-bottom p {
      margin: 0;
      opacity: 0.6;
    }

    .footer-links {
      display: flex;
      gap: var(--spacing-lg);
    }

    .footer-links a {
      color: var(--color-background);
      text-decoration: none;
      opacity: 0.6;
      font-size: 0.875rem;
      transition: opacity var(--transition-fast);
    }

    .footer-links a:hover {
      opacity: 1;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
      }

      .search-container {
        order: 2;
        margin: 0;
        max-width: 100%;
      }

      .nav-links {
        order: 3;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--spacing-sm);
      }

      .logo {
        order: 1;
      }
    }

    @media (max-width: 768px) {
      .footer-container {
        grid-template-columns: 1fr;
        text-align: center;
        padding: var(--spacing-xl) var(--spacing-md);
      }

      .footer-bottom {
        flex-direction: column;
        gap: var(--spacing-md);
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'multivers';
  currentTheme: 'light' | 'dark' = 'light';
  isAuthenticated = false;
  userRole: string | null = null;
  userEmail: string | null = null;
  showHeader = true;
  showFooter = true;
  searchQuery = '';
  searchResults: any[] = [];
  isAdminPage = false;

  constructor(
    private themeService: ThemeService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Écouter les changements de thème
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Vérifier l'authentification
    await this.checkAuthentication();

    // Écouter les changements de route pour masquer header/footer sur certaines pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateLayoutVisibility(event.url);
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  async checkAuthentication() {
    const user = await this.supabaseService.getCurrentUser();
    this.isAuthenticated = !!user;
    
    if (this.isAuthenticated && user) {
      this.userRole = await this.supabaseService.getUserRole();
      this.userEmail = user.email || null;
    }
  }

  async logout() {
    await this.supabaseService.signOut();
    this.isAuthenticated = false;
    this.userRole = null;
    this.userEmail = null;
    this.router.navigate(['/home']);
  }

  async performSearch() {
    if (!this.searchQuery.trim()) return;
    
    // Rediriger vers la page catalogue avec le terme de recherche
    this.router.navigate(['/shop'], { 
      queryParams: { search: this.searchQuery.trim() } 
    });
  }

  private updateLayoutVisibility(url: string) {
    // Masquer header/footer sur la page de lancement et auth
    const hideLayoutRoutes = ['/home', '/auth/login', '/auth/register'];
    const shouldHideLayout = hideLayoutRoutes.some(route => url.startsWith(route));
    
    // Détecter si on est sur une page admin
    this.isAdminPage = url.startsWith('/admin');
    
    this.showHeader = !shouldHideLayout;
    this.showFooter = !shouldHideLayout;
  }
}
