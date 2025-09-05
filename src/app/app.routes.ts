import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Page de lancement
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },

  // Authentification
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },

  // Shop (accessible à tous)
  {
    path: 'shop',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/shop/pages/catalog/catalog.component').then(m => m.CatalogComponent)
      },
      {
        path: 'category/:id',
        loadComponent: () => import('./features/shop/pages/category/category.component').then(m => m.CategoryComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./features/shop/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      }
    ]
  },

  // Admin (accessible uniquement aux admins)
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/pages/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/admin/pages/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/pages/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // Redirection par défaut
  { path: '**', redirectTo: '/home' }
];
