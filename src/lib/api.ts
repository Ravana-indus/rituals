import { supabase } from './supabase';
import type {
  Brand, Category, Product, ProductImage, ProductVariant,
  RitualCategory, RitualCategoryProduct,
  Cart, CartItem,
  Order, OrderInsert, OrderItem,
  Profile, Address,
  ShippingMethod, Promotion,
  FulfillmentStatus, OrderFulfillment, OrderFulfillmentItem,
  OrderRefund, OrderRefundItem, OrderNote, OrderTag, OrderEdit,
  OrderSearchFilters, PaginatedOrders, Pagination,
  OrderEditType,
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
    search: async (
      filters: OrderSearchFilters,
      pagination: Pagination
    ): Promise<PaginatedOrders> => {
      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order(pagination.sort_by ?? 'created_at', {
          ascending: pagination.sort_dir === 'asc',
        });

      if (filters.query) {
        query = query.or(
          `order_number.ilike.%${filters.query}%,email.ilike.%${filters.query}%`
        );
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
      }
      if (filters.fulfillment_status) {
        query = query.eq('fulfillment_status', filters.fulfillment_status);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to + 'T23:59:59');
      }

      const from = (pagination.page - 1) * pagination.per_page;
      query = query.range(from, from + pagination.per_page - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data ?? [],
        total: count ?? 0,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: Math.ceil((count ?? 0) / pagination.per_page),
      };
    },
    getBulk: async (ids: string[]): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('id', ids);
      if (error) throw error;
      return data ?? [];
    },
    bulkUpdateStatus: async (ids: string[], status: string): Promise<void> => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .in('id', ids);
      if (error) throw error;
    },
    bulkArchive: async (ids: string[]): Promise<void> => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .in('id', ids);
      if (error) throw error;
    },
    addNote: async (orderId: string, content: string, noteType: 'internal' | 'customer'): Promise<OrderNote> => {
      const { data, error } = await supabase
        .from('order_notes')
        .insert({ order_id: orderId, content, note_type: noteType })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    getNotes: async (orderId: string): Promise<OrderNote[]> => {
      const { data, error } = await supabase
        .from('order_notes')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    addTag: async (orderId: string, tag: string): Promise<void> => {
      const { error } = await supabase
        .from('order_tags')
        .insert({ order_id: orderId, tag });
      if (error && error.code !== '23505') throw error;
    },
    removeTag: async (orderId: string, tag: string): Promise<void> => {
      const { error } = await supabase
        .from('order_tags')
        .delete()
        .eq('order_id', orderId)
        .eq('tag', tag);
      if (error) throw error;
    },
    getTags: async (orderId: string): Promise<string[]> => {
      const { data, error } = await supabase
        .from('order_tags')
        .select('tag')
        .eq('order_id', orderId);
      if (error) throw error;
      return (data ?? []).map((r: { tag: string }) => r.tag);
    },
    getDistinctTags: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('order_tags')
        .select('tag');
      if (error) throw error;
      const unique = new Set((data ?? []).map((r: { tag: string }) => r.tag));
      return Array.from(unique).sort();
    },
    exportCsv: async (filters: OrderSearchFilters): Promise<string> => {
      const { data: orders } = await supabase
        .from('orders')
        .select('*, shipping_address:addresses!shipping_address_id(*), billing_address:addresses!billing_address_id(*)')
        .order('created_at', { ascending: false });

      if (!orders || orders.length === 0) {
        const header = ['Order #', 'Date', 'Email', 'Status', 'Payment Status', 'Fulfillment Status', 'Subtotal', 'Shipping', 'Tax', 'Discount', 'Total', 'Shipping Address', 'Items', 'Tags'];
        return header.join(',');
      }

      const orderIds = orders.map((o: Record<string, unknown>) => o.id as string);
      const [itemsResult, tagsResult] = await Promise.all([
        supabase.from('order_items').select('*').in('order_id', orderIds),
        supabase.from('order_tags').select('*').in('order_id', orderIds),
      ]);

      const itemsByOrder = (itemsResult.data ?? []).reduce((acc: Record<string, unknown[]>, item: Record<string, unknown>) => {
        if (!acc[item.order_id as string]) acc[item.order_id as string] = [];
        acc[item.order_id as string].push(item);
        return acc;
      }, {});

      const tagsByOrder = (tagsResult.data ?? []).reduce((acc: Record<string, string[]>, tag: Record<string, unknown>) => {
        if (!acc[tag.order_id as string]) acc[tag.order_id as string] = [];
        acc[tag.order_id as string].push(tag.tag as string);
        return acc;
      }, {});

      const header = [
        'Order #', 'Date', 'Email',
        'Status', 'Payment Status', 'Fulfillment Status',
        'Subtotal', 'Shipping', 'Tax', 'Discount', 'Total',
        'Shipping Address', 'Items', 'Tags',
      ];

      const formatAddress = (a: Record<string, unknown> | null) =>
        a ? `${a.recipient_name}, ${a.address_line_1}, ${a.city}, ${a.district}, ${a.postal_code}, ${a.country}` : '';

      const csvRows = orders.map((o: Record<string, unknown>) => {
        const items = itemsByOrder[o.id as string] ?? [];
        const tags = tagsByOrder[o.id as string] ?? [];
        const shippingAddr = o.shipping_address as Record<string, unknown> | null;
        return [
          o.order_number,
          o.created_at ? new Date(o.created_at as string).toLocaleDateString('en-LK') : '',
          o.email,
          o.status,
          o.payment_status,
          o.fulfillment_status,
          ((o.subtotal_cents as number) ?? 0) / 100,
          ((o.shipping_cents as number) ?? 0) / 100,
          ((o.tax_cents as number) ?? 0) / 100,
          ((o.discount_cents as number) ?? 0) / 100,
          (o.total_cents as number) / 100,
          formatAddress(shippingAddr),
          items.map((i: Record<string, unknown>) => `${i.product_name} x${i.quantity}`).join('; '),
          tags.join(', '),
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
      });

      return [header.join(','), ...csvRows].join('\n');
    },
  },

  fulfillments: {
    create: async (orderId: string, data: {
      tracking_number?: string;
      carrier?: string;
      items: { order_item_id: string; quantity: number }[];
    }): Promise<OrderFulfillment> => {
      const { data: fulfillment, error } = await supabase
        .from('order_fulfillments')
        .insert({
          order_id: orderId,
          tracking_number: data.tracking_number ?? null,
          carrier: data.carrier ?? null,
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw error;

      for (const item of data.items) {
        await supabase.from('order_fulfillment_items').insert({
          fulfillment_id: fulfillment.id,
          order_item_id: item.order_item_id,
          quantity: item.quantity,
        });
        await supabase.rpc('increment_fulfilled_quantity', {
          item_id: item.order_item_id,
          qty: item.quantity,
        }) as unknown as void;
      }

      await recalcFulfillmentStatus(orderId);

      return fulfillment;
    },
    update: async (id: string, data: {
      tracking_number?: string;
      carrier?: string;
      status?: 'pending' | 'in_transit' | 'delivered';
      shipped_at?: string;
      delivered_at?: string;
    }): Promise<void> => {
      const { error } = await supabase
        .from('order_fulfillments')
        .update(data)
        .eq('id', id);
      if (error) throw error;

      if (data.status === 'delivered') {
        const { data: ful } = await supabase.from('order_fulfillments').select('order_id').eq('id', id).single();
        if (ful) await recalcFulfillmentStatus(ful.order_id);
      }
    },
    getByOrder: async (orderId: string): Promise<(OrderFulfillment & { items: (OrderFulfillmentItem & { order_item: OrderItem })[] })[]> => {
      const { data, error } = await supabase
        .from('order_fulfillments')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const withItems = await Promise.all(
        (data ?? []).map(async (f) => {
          const { data: items } = await supabase
            .from('order_fulfillment_items')
            .select('*, order_item:order_items(*)')
            .eq('fulfillment_id', f.id);
          return { ...f, items: items ?? [] };
        })
      );
      return withItems;
    },
  },

  refunds: {
    create: async (orderId: string, data: {
      items: { order_item_id: string; quantity: number; amount_cents: number }[];
      amount_cents: number;
      reason: 'damaged' | 'wrong_item' | 'customer_request' | 'other';
      note?: string;
    }): Promise<OrderRefund> => {
      const { data: refund, error } = await supabase
        .from('order_refunds')
        .insert({
          order_id: orderId,
          amount_cents: data.amount_cents,
          reason: data.reason,
          note: data.note ?? null,
          status: 'processed',
        })
        .select()
        .single();
      if (error) throw error;

      for (const item of data.items) {
        await supabase.from('order_refund_items').insert({
          refund_id: refund.id,
          order_item_id: item.order_item_id,
          quantity: item.quantity,
          amount_cents: item.amount_cents,
        });
        await supabase.rpc('increment_refunded_quantity', {
          item_id: item.order_item_id,
          qty: item.quantity,
        }) as unknown as void;
      }

      const { data: allRefunds } = await supabase
        .from('order_refunds')
        .select('amount_cents')
        .eq('order_id', orderId)
        .eq('status', 'processed');
      const totalRefunded = (allRefunds ?? []).reduce((s: number, r: { amount_cents: number }) => s + r.amount_cents, 0);
      const { data: order } = await supabase.from('orders').select('total_cents').eq('id', orderId).single();
      if (order) {
        const newStatus = totalRefunded >= order.total_cents ? 'refunded' : totalRefunded > 0 ? 'partially_refunded' : 'paid';
        await supabase.from('orders').update({ payment_status: newStatus }).eq('id', orderId);
      }

      return refund;
    },
    getByOrder: async (orderId: string): Promise<(OrderRefund & { items: OrderRefundItem[] })[]> => {
      const { data, error } = await supabase
        .from('order_refunds')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const withItems = await Promise.all(
        (data ?? []).map(async (r) => {
          const { data: items } = await supabase
            .from('order_refund_items')
            .select('*')
            .eq('refund_id', r.id);
          return { ...r, items: items ?? [] };
        })
      );
      return withItems;
    },
  },

  orderEdits: {
    apply: async (orderId: string, data: {
      edits: {
        edit_type: OrderEditType;
        order_item_id?: string;
        before_data: Record<string, unknown>;
        after_data: Record<string, unknown>;
        product_id?: string;
        product_name?: string;
        variant_id?: string;
        variant_name?: string;
        unit_price_cents?: number;
        quantity?: number;
      }[];
    }): Promise<void> => {
      for (const edit of data.edits) {
        await supabase.from('order_edits').insert({
          order_id: orderId,
          edit_type: edit.edit_type,
          before_data: edit.before_data,
          after_data: edit.after_data,
        });

        if (edit.edit_type === 'add_item') {
          await supabase.from('order_items').insert({
            order_id: orderId,
            product_id: edit.product_id,
            variant_id: edit.variant_id ?? null,
            product_name: edit.product_name,
            variant_name: edit.variant_name ?? null,
            quantity: edit.quantity ?? 1,
            unit_price_cents: edit.unit_price_cents ?? 0,
            total_cents: (edit.unit_price_cents ?? 0) * (edit.quantity ?? 1),
          });
        } else if (edit.edit_type === 'remove_item' && edit.order_item_id) {
          await supabase.from('order_items').delete().eq('id', edit.order_item_id);
        } else if (edit.edit_type === 'change_quantity' && edit.order_item_id) {
          const newQty = edit.quantity ?? 1;
          const { data: item } = await supabase.from('order_items').select('unit_price_cents').eq('id', edit.order_item_id).single();
          await supabase.from('order_items').update({
            quantity: newQty,
            total_cents: (item?.unit_price_cents ?? 0) * newQty,
          }).eq('id', edit.order_item_id);
        } else if (edit.edit_type === 'change_price' && edit.order_item_id) {
          const { data: item } = await supabase.from('order_items').select('quantity').eq('id', edit.order_item_id).single();
          await supabase.from('order_items').update({
            unit_price_cents: edit.unit_price_cents,
            total_cents: (edit.unit_price_cents ?? 0) * (item?.quantity ?? 1),
          }).eq('id', edit.order_item_id);
        }
      }

      const { data: items } = await supabase.from('order_items').select('total_cents').eq('order_id', orderId);
      const subtotal = (items ?? []).reduce((s: number, i: { total_cents: number }) => s + i.total_cents, 0);
      const { data: order } = await supabase.from('orders').select('shipping_cents, discount_cents').eq('id', orderId).single();
      await supabase.from('orders').update({
        subtotal_cents: subtotal,
        total_cents: subtotal + (order?.shipping_cents ?? 0) - (order?.discount_cents ?? 0),
        edited_at: new Date().toISOString(),
      }).eq('id', orderId);
    },
    getHistory: async (orderId: string): Promise<OrderEdit[]> => {
      const { data, error } = await supabase
        .from('order_edits')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
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

async function recalcFulfillmentStatus(orderId: string): Promise<void> {
  const { data: items } = await supabase.from('order_items').select('quantity, fulfilled_quantity, refunded_quantity').eq('order_id', orderId);
  if (!items || items.length === 0) return;

  const totalQty = items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
  const fulfilledQty = items.reduce((s: number, i: { fulfilled_quantity: number }) => s + i.fulfilled_quantity, 0);
  const refundedQty = items.reduce((s: number, i: { refunded_quantity: number }) => s + i.refunded_quantity, 0);
  const shippableQty = totalQty - refundedQty;

  let status: 'unfulfilled' | 'partial' | 'fulfilled' = 'unfulfilled';
  if (fulfilledQty >= shippableQty && shippableQty > 0) status = 'fulfilled';
  else if (fulfilledQty > 0) status = 'partial';

  await supabase.from('orders').update({ fulfillment_status: status }).eq('id', orderId);
}
