import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectService {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async redirectAfterLogin(): Promise<void> {
    const user = await this.supabaseService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/home']);
      return;
    }

    const userRole = await this.supabaseService.getUserRole();
    
    if (userRole === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/shop']);
    }
  }

  async checkAndRedirect(): Promise<void> {
    const user = await this.supabaseService.getCurrentUser();
    
    if (user) {
      await this.redirectAfterLogin();
    }
  }
}
