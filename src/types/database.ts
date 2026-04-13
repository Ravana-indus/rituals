import type { Database } from './supabase';

export type { Database };
export type Brand = Database['public']['Tables']['brands']['Row'];
export type BrandInsert = Database['public']['Tables']['brands']['Insert'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type ProductImage = Database['public']['Tables']['product_images']['Row'];
export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Address = Database['public']['Tables']['addresses']['Row'];
export type Cart = Database['public']['Tables']['carts']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type ShippingMethod = Database['public']['Tables']['shipping_methods']['Row'];
export type Promotion = Database['public']['Tables']['promotions']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type WishlistItem = Database['public']['Tables']['wishlist']['Row'];
export type Consultation = Database['public']['Tables']['consultations']['Row'];
export type RitualCategory = Database['public']['Tables']['ritual_categories']['Row'];
export type RitualCategoryProduct = Database['public']['Tables']['ritual_category_products']['Row'];

export type ProfileRole = 'customer' | 'admin' | 'super_admin';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type BadgeType = 'tertiary' | 'secondary' | 'editorial';

export function formatPriceCents(cents: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents);
}

export function parsePriceString(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
}
