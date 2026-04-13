import { supabase } from './supabase';
import type {
  Brand, Category, Product, ProductImage, ProductVariant,
  RitualCategory, RitualCategoryProduct,
  Cart, CartItem,
  Order, OrderInsert, OrderItem,
  Profile, Address,
  ShippingMethod, Promotion,
} from '../types/database';

export const api = {
  brands: {
    getAll: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      if (error) throw error;
      return data ?? [];
    },
    getBySlug: async (slug: string): Promise<Brand | null> => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) return null;
      return data;
    },
    create: async (brand: { name: string; slug: string; description?: string; country_of_origin?: string; logo_url?: string; is_active?: boolean }): Promise<Brand> => {
      const { data, error } = await supabase
        .from('brands')
        .insert(brand)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Brand>): Promise<Brand> => {
      const { data, error } = await supabase
        .from('brands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('brands').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
    hardDelete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error) throw error;
    },
  },

  categories: {
    getAll: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data ?? [];
    },
    getBySlug: async (slug: string): Promise<Category | null> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) return null;
      return data;
    },
    create: async (category: { name: string; slug: string; description?: string; icon_name?: string; parent_id?: string; display_order?: number; is_active?: boolean }): Promise<Category> => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Category>): Promise<Category> => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('categories').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
  },

  products: {
    getAll: async (filters?: { categoryId?: string; brandId?: string; search?: string }): Promise<(Product & { brand: Brand; category: Category; images: ProductImage[] })[]> => {
      let query = supabase
        .from('products')
        .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.brandId) {
        query = query.eq('brand_id', filters.brandId);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },

    getBySlug: async (slug: string): Promise<(Product & { brand: Brand; category: Category; images: ProductImage[]; variants: ProductVariant[] }) | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*, brand:brands(*), category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('slug', slug)
        .single();
      if (error) return null;
      return data;
    },

    getFeatured: async (): Promise<(Product & { brand: Brand; images: ProductImage[] })[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*, brand:brands(*), images:product_images(*)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },

    getLowStock: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .lte('stock_qty', 5)
        .order('stock_qty');
      if (error) throw error;
      return data ?? [];
    },

    getAllAdmin: async (): Promise<(Product & { brand: Brand; category: Category; images: ProductImage[] })[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },

    create: async (product: {
      brand_id: string;
      category_id: string;
      name: string;
      slug: string;
      tagline?: string;
      description?: string;
      how_to_use?: string;
      ingredients?: string;
      key_benefits?: string[];
      price_cents: number;
      compare_at_price_cents?: number;
      sku?: string;
      barcode?: string;
      weight_grams?: number;
      stock_qty?: number;
      low_stock_threshold?: number;
      is_featured?: boolean;
      is_active?: boolean;
    }): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    update: async (id: string, updates: Partial<Product>): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },

    addImage: async (productId: string, url: string, altText?: string, displayOrder?: number): Promise<ProductImage> => {
      const { data, error } = await supabase
        .from('product_images')
        .insert({ product_id: productId, url, alt_text: altText ?? null, display_order: displayOrder ?? 0 })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    removeImage: async (imageId: string): Promise<void> => {
      const { error } = await supabase.from('product_images').delete().eq('id', imageId);
      if (error) throw error;
    },

    updateImageOrder: async (imageId: string, displayOrder: number): Promise<void> => {
      const { error } = await supabase.from('product_images').update({ display_order: displayOrder }).eq('id', imageId);
      if (error) throw error;
    },
  },

  ritualCategories: {
    getAll: async (): Promise<RitualCategory[]> => {
      const { data, error } = await supabase
        .from('ritual_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data ?? [];
    },
    getBySlug: async (slug: string): Promise<RitualCategory | null> => {
      const { data, error } = await supabase
        .from('ritual_categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) return null;
      return data;
    },
    getProducts: async (ritualCategoryId: string): Promise<(RitualCategoryProduct & { product: Product & { images: ProductImage[] } })[]> => {
      const { data, error } = await supabase
        .from('ritual_category_products')
        .select('*, product:products(*, images:product_images(*))')
        .eq('ritual_category_id', ritualCategoryId)
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data ?? [];
    },
  },

  cart: {
    getOrCreate: async (userId: string): Promise<Cart> => {
      const { data: existing, error: existingError } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (existing) return existing;

      const { data, error } = await supabase
        .from('carts')
        .insert({ user_id: userId, status: 'active' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    getItems: async (cartId: string): Promise<(CartItem & { product: Product & { images: ProductImage[] } })[]> => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*, images:product_images(*))')
        .eq('cart_id', cartId);
      if (error) throw error;
      return data ?? [];
    },

    addItem: async (cartId: string, productId: string, quantity: number, priceCents: number, variantId?: string): Promise<CartItem> => {
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          cart_id: cartId,
          product_id: productId,
          variant_id: variantId ?? null,
          quantity,
          price_cents: priceCents,
        }, { onConflict: 'cart_id,product_id,variant_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    updateItemQuantity: async (itemId: string, quantity: number): Promise<void> => {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);
      if (error) throw error;
    },

    removeItem: async (itemId: string): Promise<void> => {
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) throw error;
    },

    clearCart: async (cartId: string): Promise<void> => {
      const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId);
      if (error) throw error;
    },

    convertToOrder: async (cartId: string, orderData: Omit<OrderInsert, 'order_number'>): Promise<Order> => {
      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('cart_id', cartId);
      if (itemsError) throw itemsError;

      const subtotalCents = (cartItems ?? []).reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ ...orderData, subtotal_cents: subtotalCents, total_cents: subtotalCents + (orderData.shipping_cents ?? 0) - (orderData.discount_cents ?? 0) })
        .select()
        .single();
      if (orderError) throw orderError;

      for (const item of (cartItems ?? [])) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_name: (item.product as Product).name,
          quantity: item.quantity,
          unit_price_cents: item.price_cents,
          total_cents: item.price_cents * item.quantity,
        });
      }

      await supabase.from('carts').update({ status: 'converted' }).eq('id', cartId);
      await supabase.from('cart_items').delete().eq('cart_id', cartId);

      return order;
    },
  },

  orders: {
    getByNumber: async (orderNumber: string): Promise<Order | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();
      if (error) return null;
      return data;
    },
    getByEmail: async (email: string): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });
      if (error) return [];
      return data ?? [];
    },
    getByUser: async (userId: string): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    getById: async (id: string): Promise<(Order & { items: OrderItem[]; shipping_address: Address | null; billing_address: Address | null }) | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;

      const [itemsResult, shippingResult, billingResult] = await Promise.all([
        supabase.from('order_items').select('*').eq('order_id', id),
        data.shipping_address_id ? supabase.from('addresses').select('*').eq('id', data.shipping_address_id).single() : { data: null },
        data.billing_address_id ? supabase.from('addresses').select('*').eq('id', data.billing_address_id).single() : { data: null },
      ]);

      return {
        ...data,
        items: itemsResult.data ?? [],
        shipping_address: shippingResult.data ?? null,
        billing_address: billingResult.data ?? null,
      };
    },
    getAll: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    updateStatus: async (id: string, status: string): Promise<void> => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    updatePaymentStatus: async (id: string, paymentStatus: string): Promise<void> => {
      const { error } = await supabase.from('orders').update({ payment_status: paymentStatus }).eq('id', id);
      if (error) throw error;
    },
    updateShipping: async (id: string, updates: { shipping_address_id?: string; billing_address_id?: string; shipping_cents?: number }): Promise<void> => {
      const { error } = await supabase.from('orders').update(updates).eq('id', id);
      if (error) throw error;
    },
  },

  profile: {
    get: async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) return null;
      return data;
    },
    update: async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  addresses: {
    getAll: async (userId: string): Promise<Address[]> => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    create: async (address: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address> => {
      const { data, error } = await supabase.from('addresses').insert(address).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Address>): Promise<Address> => {
      const { data, error } = await supabase.from('addresses').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) throw error;
    },
  },

  shipping: {
    getAll: async (): Promise<ShippingMethod[]> => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data ?? [];
    },
    getAllAdmin: async (): Promise<ShippingMethod[]> => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data ?? [];
    },
    create: async (method: { name: string; description?: string; price_cents: number; estimated_days?: string; display_order?: number; is_active?: boolean }): Promise<ShippingMethod> => {
      const { data, error } = await supabase.from('shipping_methods').insert(method).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<ShippingMethod>): Promise<ShippingMethod> => {
      const { data, error } = await supabase.from('shipping_methods').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('shipping_methods').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
  },

  promotions: {
    getAll: async (): Promise<Promotion[]> => {
      const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    validate: async (code: string, subtotalCents: number): Promise<Promotion | null> => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();
      if (error || !data) return null;
      if (data.min_order_cents && subtotalCents < data.min_order_cents) return null;
      if (data.expires_at && new Date(data.expires_at) < new Date()) return null;
      return data;
    },
    create: async (promo: { code: string; name: string; description?: string; discount_type: string; discount_value: number; min_order_cents?: number; max_discount_cents?: number; usage_limit?: number; starts_at?: string; expires_at?: string; is_active?: boolean }): Promise<Promotion> => {
      const { data, error } = await supabase.from('promotions').insert(promo).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Promotion>): Promise<Promotion> => {
      const { data, error } = await supabase.from('promotions').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('promotions').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
  },

  admin: {
    getAllUsers: async (): Promise<Profile[]> => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    updateUserRole: async (userId: string, role: string): Promise<void> => {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      if (error) throw error;
    },
    logActivity: async (adminUserId: string, action: string, entityType?: string, entityId?: string, details?: Record<string, unknown>): Promise<void> => {
      await supabase.from('admin_activity_log').insert({
        admin_user_id: adminUserId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
      });
    },
  },
};
