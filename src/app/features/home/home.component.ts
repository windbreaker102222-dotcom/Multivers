import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="home-container" [ngStyle]="getBackgroundStyle()">
      <div class="hero-section">
        <h1 class="brand-title">MULTIVERS</h1>
        <p class="brand-subtitle">E-Commerce Premium</p>
        <p class="welcome-text">Découvrez notre catalogue de produits exceptionnels</p>
        
        <div class="action-buttons">
          <button class="primary-btn" (click)="goToShop()">
            Découvrir le Catalogue
          </button>
          <button class="secondary-btn" (click)="goToLogin()">
            Connexion
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      padding: var(--spacing-xl);
    }

    .hero-section {
      text-align: center;
      max-width: 600px;
      color: var(--color-secondary);
    }

    .brand-title {
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: var(--spacing-md);
      color: var(--color-secondary);
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .brand-subtitle {
      font-size: 1.5rem;
      font-weight: 300;
      margin-bottom: var(--spacing-xl);
      opacity: 0.9;
    }

    .welcome-text {
      font-size: 1.125rem;
      margin-bottom: var(--spacing-xxl);
      opacity: 0.8;
      line-height: 1.6;
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-lg);
      justify-content: center;
      flex-wrap: wrap;
    }

    .primary-btn, .secondary-btn {
      padding: var(--spacing-md) var(--spacing-xl);
      border: none;
      border-radius: var(--radius-md);
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
      min-width: 200px;
    }

    .primary-btn {
      background: var(--color-secondary);
      color: var(--color-primary);
    }

    .primary-btn:hover {
      background: var(--color-background);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .secondary-btn {
      background: transparent;
      color: var(--color-secondary);
      border: 2px solid var(--color-secondary);
    }

    .secondary-btn:hover {
      background: var(--color-secondary);
      color: var(--color-primary);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .brand-title {
        font-size: 3rem;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .primary-btn, .secondary-btn {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class HomeComponent {
  backgroundImageUrl: string = '';

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.loadBackgroundImage();
  }

  async loadBackgroundImage() {
    try {
      const { data, error } = await this.supabaseService.getAppSetting('home_background_image');
      if (error) {
        console.error('Error loading background image:', error);
        return;
      }
      this.backgroundImageUrl = data || '';
    } catch (error) {
      console.error('Error loading background image:', error);
    }
  }

  getBackgroundStyle() {
    if (this.backgroundImageUrl) {
      return {
        'background-image': 'url(' + this.backgroundImageUrl + ')',
        'background-size': 'cover',
        'background-position': 'center'
      };
    } else {
      return {
        'background': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)'
      };
    }
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
