export interface User {
  id: string;
  email: string;
  role: 'admin' | 'client';
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'client';
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: string;
  is_active: boolean;
  stock_quantity: number;
  sku?: string;
  weight?: number;
  dimensions?: any;
  tags?: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  product_id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  client_message?: string;
  quantity: number;
  unit_price: number;
  total_price?: number;
  status: 'pending' | 'contacted' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  admin_notes?: string;
  delivery_address?: string;
  delivery_date?: string;
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
