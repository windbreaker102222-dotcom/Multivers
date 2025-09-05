import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.supabaseService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const userRole = await this.supabaseService.getUserRole();
    
    if (userRole !== 'admin') {
      this.router.navigate(['/shop']);
      return false;
    }

    return true;
  }
}
