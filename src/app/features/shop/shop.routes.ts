import { Routes } from '@angular/router';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'category/:id',
    loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  }
];
