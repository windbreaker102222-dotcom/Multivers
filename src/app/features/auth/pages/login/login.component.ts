import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Connexion</h1> 
        
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email"
              [(ngModel)]="credentials.email"
              name="email"
              required>
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password"
              [(ngModel)]="credentials.password"
              name="password"
              required>
          </div>
          
          @if (errorMessage) {
            <div class="error-message">{{ errorMessage }}</div>
          }
          
          <button 
            type="submit" 
            class="login-btn"
            [disabled]="!loginForm.valid || isLoading">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        
        <div class="links">
          <a routerLink="/auth/register">Créer un compte</a>
          <a routerLink="/shop">Continuer sans</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-background-alt);
      padding: 2rem;
    }

    .login-card {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      padding: 3rem;
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 400px;
    }

    .login-card h1 {
      text-align: center;
      color: var(--color-text);
      margin-bottom: 0.5rem;
    }

    .login-card p {
      text-align: center;
      color: var(--color-text-light);
      margin-bottom: 2rem;
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

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 1rem;
      background: var(--color-background);
      color: var(--color-text);
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
    }

    .login-btn {
      width: 100%;
      background: var(--color-primary);
      color: var(--color-secondary);
      border: none;
      padding: 1rem;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .login-btn:hover:not(:disabled) {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
    }

    .login-btn:disabled {
      background: var(--color-text-muted);
      cursor: not-allowed;
      opacity: 0.6;
    }

    .error-message {
      background: var(--color-error-light, #fee);
      color: var(--color-error, #c33);
      border: 1px solid var(--color-error, #c33);
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      text-align: center;
    }

    .links {
      margin-top: 2rem;
      text-align: center;
    }

    .links a {
      display: block;
      color: var(--color-primary);
      text-decoration: none;
      margin-bottom: 0.5rem;
      transition: color var(--transition-fast);
    }

    .links a:hover {
      color: var(--color-primary-dark);
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async login() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.credentials;
      const { data, error } = await this.supabaseService.signIn(email, password);

      if (error) {
        this.errorMessage = error.message;
      } else {
        // Redirection automatique selon le rôle
        const userRole = await this.supabaseService.getUserRole();
        if (userRole === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/shop']);
        }
      }
    } catch (error: any) {
      this.errorMessage = 'Une erreur est survenue lors de la connexion';
    } finally {
      this.isLoading = false;
    }
  }
}
