import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../../services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1>Créer un compte</h1>
        <p>Inscription</p>
        
        <form (ngSubmit)="register()" #registerForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email"
              [(ngModel)]="userData.email"
              name="email"
              required>
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password"
              [(ngModel)]="userData.password"
              name="password"
              required
              minlength="6">
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input 
              type="password" 
              id="confirmPassword"
              [(ngModel)]="userData.confirmPassword"
              name="confirmPassword"
              required>
          </div>
          
          @if (errorMessage) {
            <div class="error-message">{{ errorMessage }}</div>
          }
          
          @if (successMessage) {
            <div class="success-message">{{ successMessage }}</div>
          }
          
          <button 
            type="submit" 
            class="register-btn"
            [disabled]="!registerForm.valid || isLoading || userData.password !== userData.confirmPassword">
            {{ isLoading ? 'Création...' : 'Créer le compte' }}
          </button>
        </form>
        
        <div class="links">
          <a routerLink="/auth/login">Déjà un compte ? Se connecter</a>
          <a routerLink="/shop">← Retour au catalogue</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-background-alt);
      padding: 2rem;
    }

    .register-card {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      padding: 3rem;
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 400px;
    }

    .register-card h1 {
      text-align: center;
      color: var(--color-text);
      margin-bottom: 0.5rem;
    }

    .register-card p {
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

    .register-btn {
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

    .register-btn:hover:not(:disabled) {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
    }

    .register-btn:disabled {
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

    .success-message {
      background: var(--color-success-light, #efe);
      color: var(--color-success, #3c3);
      border: 1px solid var(--color-success, #3c3);
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
export class RegisterComponent {
  userData = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async register() {
    if (this.userData.password !== this.userData.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { data, error } = await this.supabaseService.signUp(
        this.userData.email,
        this.userData.password,
        'admin'
      );

      if (error) {
        this.errorMessage = (error as any)?.message || 'Erreur lors de la création du compte';
        return;
      }

      if (data.user) {
        this.successMessage = 'Compte créé avec succès ! Vérifiez votre email.';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      }
    } catch (error) {
      this.errorMessage = 'Erreur lors de la création du compte';
    } finally {
      this.isLoading = false;
    }
  }
}
