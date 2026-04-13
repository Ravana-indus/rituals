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
  const pendingSyncRef = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
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
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (initRef.current) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  // Load user's cart from DB when logged in, and sync local items
  useEffect(() => {
    if (!authLoading && user) {
      loadUserCartAndSync();
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
        
        // Get current local items
        const localItems = items;
        
        if (localItems.length > 0) {
          // Sync local items to database
          console.log('Syncing', localItems.length, 'local items to database...');
          for (const item of localItems) {
            await supabase
              .from('cart_items')
              .upsert({
                cart_id: userCart.id,
                product_id: item.productId,
                variant_id: item.variantId ?? null,
                quantity: item.quantity,
                price_cents: item.priceValue,
              }, { onConflict: 'cart_id,product_id,variant_id' });
          }
          // Clear localStorage after successful sync
          localStorage.removeItem(CART_STORAGE_KEY);
          console.log('Cart synced to database');
        }

        // Load all items from database (merged with any existing server items)
        const { data: cartItems } = await supabase
          .from('cart_items')
          .select('*, product:products(*, images:product_images(*))')
          .eq('cart_id', userCart.id);

        if (cartItems && cartItems.length > 0) {
          setItems(cartItems.map(ci => {
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
          }));
        }
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
      // Save to localStorage immediately
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
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
          }, { onConflict: 'cart_id,product_id,variant_id' });
      } catch (e) { 
        console.error('Add to cart DB error:', e); 
      }
    }
  }, [user, cart]);

  const removeItem = useCallback(async (id: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.id !== id);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
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
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
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
