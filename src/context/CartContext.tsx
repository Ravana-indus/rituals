import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Cart, CartItem, Product, ProductImage } from '../types/database';
import { formatPriceCents } from '../types/database';

interface CartItemUI {
  id: string;
  productId?: string;
  variantId?: string;
  brand: string;
  title: string;
  priceValue: number;
  price: string;
  originalPrice: string;
  imgSrc: string;
  size: string;
  quantity: number;
  badge?: { label: string; type: 'clearance' | 'bargain' };
}

interface CartContextType {
  items: CartItemUI[];
  addItem: (item: Omit<CartItemUI, 'price'> & { price?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  syncing: boolean;
}

const CART_STORAGE_KEY = 'heritage_cart_items';

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItemUI[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [syncing, setSyncing] = useState(false);
  const initRef = useRef(false);
  const hasSyncedRef = useRef(false);

  // Load cart from localStorage on mount (only for non-logged in users)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    // Only load from localStorage if user is not logged in
    if (!user) {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
            console.log('Loaded cart from localStorage:', parsed.length, 'items');
          }
        } catch (e) {
          console.error('Failed to parse cart from localStorage:', e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever items change (only for non-logged in users)
  useEffect(() => {
    if (initRef.current && !user) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  // Load/sync with database when user logs in
  useEffect(() => {
    if (!authLoading && user && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      loadUserCartAndSync();
    }
    // Reset sync flag when user logs out
    if (!user) {
      hasSyncedRef.current = false;
      setCart(null);
    }
  }, [user, authLoading]);

  async function loadUserCartAndSync() {
    if (!user) return;
    setSyncing(true);
    try {
      // Get or create user's cart
      const { data: existing } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      let userCart = existing;
      if (!userCart) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: user.id, status: 'active' })
          .select()
          .single();
        userCart = newCart;
      }
      
      if (userCart) {
        setCart(userCart);
        
        // Get current local items before clearing
        const localItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        
        // Load existing items from database first
        const { data: dbCartItems } = await supabase
          .from('cart_items')
          .select('*, product:products(*, images:product_images(*))')
          .eq('cart_id', userCart.id);

        // Convert DB items to UI format
        const dbItems: CartItemUI[] = (dbCartItems || []).map(ci => {
          const product = (ci.product as Product);
          const images = ((ci.product as any)?.images as ProductImage[]) ?? [];
          return {
            id: ci.id,
            productId: ci.product_id,
            variantId: ci.variant_id,
            brand: (ci.product as any)?.brand?.name ?? '',
            title: product?.name ?? '',
            priceValue: ci.price_cents,
            price: formatPriceCents(ci.price_cents),
            originalPrice: product?.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : '',
            imgSrc: images[0]?.url ?? '',
            size: product?.tagline ?? '',
            quantity: ci.quantity,
          };
        });

        // Merge local items with DB items
        if (localItems.length > 0) {
          console.log('Merging', localItems.length, 'local items with', dbItems.length, 'DB items');
          
          // Create a map of existing DB items by productId for quick lookup
          const dbItemsMap = new Map(dbItems.map(item => [item.productId, item]));
          
          // Add or update items from localStorage
          for (const localItem of localItems) {
            const existingDbItem = dbItemsMap.get(localItem.productId);
            if (existingDbItem) {
              // Update quantity in database (add local quantity to existing)
              const newQuantity = existingDbItem.quantity + localItem.quantity;
              await supabase
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', existingDbItem.id);
              // Update in our local array too
              existingDbItem.quantity = newQuantity;
            } else {
              // Insert new item to database
              const { data: newItem } = await supabase
                .from('cart_items')
                .insert({
                  cart_id: userCart.id,
                  product_id: localItem.productId,
                  variant_id: localItem.variantId ?? null,
                  quantity: localItem.quantity,
                  price_cents: localItem.priceValue,
                })
                .select('*, product:products(*, images:product_images(*))')
                .single();
              
              if (newItem) {
                const product = (newItem.product as Product);
                const images = ((newItem.product as any)?.images as ProductImage[]) ?? [];
                dbItems.push({
                  id: newItem.id,
                  productId: newItem.product_id,
                  variantId: newItem.variant_id,
                  brand: (newItem.product as any)?.brand?.name ?? '',
                  title: product?.name ?? '',
                  priceValue: newItem.price_cents,
                  price: formatPriceCents(newItem.price_cents),
                  originalPrice: product?.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : '',
                  imgSrc: images[0]?.url ?? '',
                  size: product?.tagline ?? '',
                  quantity: newItem.quantity,
                });
              }
            }
          }
          
          // Clear localStorage after successful sync
          localStorage.removeItem(CART_STORAGE_KEY);
          console.log('Cart merged and synced to database');
        }

        // Set final merged items
        setItems(dbItems);
      }
    } catch (e) { 
      console.error('Cart load/sync error:', e); 
    } finally { 
      setSyncing(false); 
    }
  }

  const addItem = useCallback(async (item: Omit<CartItemUI, 'price'> & { price?: string }) => {
    const priceValue = item.priceValue;
    const price = formatPriceCents(priceValue);

    // Update local state first
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      let newItems;
      if (existing) {
        newItems = prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
      } else {
        newItems = [...prev, {
          id: item.id || crypto.randomUUID(),
          productId: item.productId ?? item.id,
          variantId: item.variantId,
          brand: item.brand,
          title: item.title,
          priceValue,
          price,
          originalPrice: item.originalPrice ?? '',
          imgSrc: item.imgSrc ?? '',
          size: item.size ?? '',
          quantity: item.quantity,
          badge: item.badge,
        }];
      }
      // Save to localStorage immediately (only if not logged in)
      if (!user) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      }
      return newItems;
    });

    // If logged in, also sync to database
    if (user && cart) {
      try {
        await supabase
          .from('cart_items')
          .upsert({
            cart_id: cart.id,
            product_id: item.productId ?? item.id,
            variant_id: item.variantId ?? null,
            quantity: item.quantity,
            price_cents: priceValue,
          }, { onConflict: 'cart_id,product_id,variant_id' })
          .select()
          .single();
      } catch (e) { 
        console.error('Add to cart DB error:', e); 
      }
    }
  }, [user, cart]);

  const removeItem = useCallback(async (id: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.id !== id);
      if (!user) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      }
      return newItems;
    });

    if (user && cart) {
      try {
        await supabase.from('cart_items').delete().eq('id', id).eq('cart_id', cart.id);
      } catch (e) {
        console.error('Remove from cart DB error:', e);
      }
    }
  }, [user, cart]);

  const updateQuantity = useCallback(async (id: string, qty: number) => {
    setItems(prev => {
      let newItems;
      if (qty <= 0) {
        newItems = prev.filter(i => i.id !== id);
      } else {
        newItems = prev.map(i => i.id === id ? { ...i, quantity: qty } : i);
      }
      if (!user) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      }
      return newItems;
    });

    if (user && cart) {
      try {
        if (qty <= 0) {
          await supabase.from('cart_items').delete().eq('id', id).eq('cart_id', cart.id);
        } else {
          await supabase.from('cart_items').update({ quantity: qty }).eq('id', id).eq('cart_id', cart.id);
        }
      } catch (e) {
        console.error('Update quantity DB error:', e);
      }
    }
  }, [user, cart]);

  const clearCart = useCallback(async () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    
    if (user && cart) {
      try {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      } catch (e) {
        console.error('Clear cart DB error:', e);
      }
    }
  }, [user, cart]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.priceValue * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, syncing }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
