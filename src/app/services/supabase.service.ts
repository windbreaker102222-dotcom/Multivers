import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { User, Profile, Category, Product, Order, Database } from '../models/database.types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  get client() {
    return this.supabase;
  }

  // Auth methods
  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string, role: 'admin' | 'client' = 'client') {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    
    if (data.user && !error) {
      // Create profile with role
      await this.supabase
        .from('profiles')
        .insert({ id: data.user.id, email, role });
    }
    
    return { data, error };
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<SupabaseUser | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async getUserRole(): Promise<string | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'client'; // Default to client role on error
      }

      return data?.role || 'client';
    } catch (error) {
      console.error('Exception fetching user role:', error);
      return 'client'; // Default to client role on exception
    }
  }

  async getUserProfile(): Promise<Profile | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  }

  // Categories methods
  async getCategories() {
    return await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
    return await this.supabase
      .from('categories')
      .insert(category);
  }

  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) {
    return await this.supabase
      .from('categories')
      .update(updates)
      .eq('id', id);
  }

  async deleteCategory(id: string) {
    return await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);
  }

  // Products methods
  async getProducts(categoryId?: string) {
    let query = this.supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    return await query;
  }

  async getAllProducts() {
    return await this.supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false });
  }

  async getProduct(id: string) {
    return await this.supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    return await this.supabase
      .from('products')
      .insert(product)
      .select();
  }

  async updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) {
    return await this.supabase
      .from('products')
      .update(updates)
      .eq('id', id);
  }

  async deleteProduct(id: string) {
    return await this.supabase
      .from('products')
      .delete()
      .eq('id', id);
  }

  // Orders methods
  async getOrders() {
    return await this.supabase
      .from('orders')
      .select(`
        *,
        product:products(*)
      `)
      .order('created_at', { ascending: false });
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    return await this.supabase
      .from('orders')
      .insert(order);
  }

  async updateOrderStatus(id: string, status: 'pending' | 'contacted' | 'completed') {
    return await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
  }

  // Storage methods
  async uploadImage(file: File, path: string) {
    const { data, error } = await this.supabase.storage
      .from('products')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) return { data: null, error };

    const { data: { publicUrl } } = this.supabase.storage
      .from('products')
      .getPublicUrl(path);

    return { data: { path, publicUrl }, error: null };
  }

  async uploadProductImage(file: File, productId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/main.${fileExt}`;
    
    const { data, error } = await this.supabase.storage
      .from('products')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) return { data: null, error };

    const { data: { publicUrl } } = this.supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return { data: { path: fileName, publicUrl }, error: null };
  }

  getImageUrl(path: string): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from('products')
      .getPublicUrl(path);
    return publicUrl;
  }

  async deleteImage(path: string) {
    return await this.supabase.storage
      .from('products')
      .remove([path]);
  }

  // App settings methods
  async getAppSetting(key: string) {
    const { data, error } = await this.supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) return { data: null, error };
    return { data: data.value, error: null };
  }

  async setAppSetting(key: string, value: string) {
    const { data, error } = await this.supabase
      .from('app_settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) return { data: null, error };
    return { data, error: null };
  }
}
