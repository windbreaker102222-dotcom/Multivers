import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const user = await this.supabaseService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Vérifier le rôle requis
    const requiredRole = route.data?.['role'];
    if (requiredRole) {
      const userRole = await this.supabaseService.getUserRole();
      
      if (userRole !== requiredRole) {
        // Rediriger selon le rôle de l'utilisateur
        if (userRole === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/shop']);
        }
        return false;
      }
    }

    return true;
  }
}
