import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Cart, CartItem, Product, ProductImage } from '../types/database';
import { formatPriceCents } from '../types/database';
import AddToCartToast from '../components/AddToCartToast';

interface ToastItem {
  title: string;
  imgSrc: string;
  price: string;
}

interface CartItemUI {
  id: string;
  productId: string;
  variantId?: string;
  brand: string;
  title: string;
  priceValue: number;
  price: string;
  originalPrice: string;
  originalPriceValue: number;
  imgSrc: string;
  size: string;
  quantity: number;
  badge?: { label: string; type: 'clearance' | 'bargain' };
}

interface CartContextType {
  items: CartItemUI[];
  addItem: (item: Omit<CartItemUI, 'price' | 'id' | 'originalPriceValue'> & { id?: string; price?: string; originalPriceValue?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  totalSavings: number;
  syncing: boolean;
}

const CART_STORAGE_KEY = 'heritage_cart_items';
const CART_VERSION_KEY = 'heritage_cart_version';
const CURRENT_VERSION = '2';

const CartContext = createContext<CartContextType | null>(null);

// Helper to create unique key for item
function getItemKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

// Helper to merge items by productId (sum quantities)
function mergeItemsByProductId(items: CartItemUI[]): CartItemUI[] {
  const merged = new Map<string, CartItemUI>();
  
  for (const item of items) {
    const key = getItemKey(item.productId, item.variantId);
    const existing = merged.get(key);
    
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.set(key, { ...item });
    }
  }
  
  return Array.from(merged.values());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItemUI[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [toastItem, setToastItem] = useState<ToastItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const isLoadedRef = useRef(false);
  const isSavingRef = useRef(false);

  // Load cart on mount - only runs once
  useEffect(() => {
    if (isLoadedRef.current) return;
    isLoadedRef.current = true;
    
    // Check if we need to reset (version mismatch = schema change)
    const storedVersion = localStorage.getItem(CART_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      console.log('Cart version mismatch, clearing localStorage');
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.setItem(CART_VERSION_KEY, CURRENT_VERSION);
      setItems([]);
      return;
    }
    
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Always merge to be safe
          const merged = mergeItemsByProductId(parsed);
          setItems(merged);
          console.log('Cart loaded:', merged.length, 'items, total qty:', merged.reduce((s, i) => s + i.quantity, 0));
        }
      } catch (e) {
        console.error('Failed to parse cart:', e);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoadedRef.current || isSavingRef.current) return;
    
    const deduped = mergeItemsByProductId(items);
    const newStored = JSON.stringify(deduped);
    const currentStored = localStorage.getItem(CART_STORAGE_KEY);
    
    if (currentStored !== newStored) {
      isSavingRef.current = true;
      localStorage.setItem(CART_STORAGE_KEY, newStored);
      localStorage.setItem(CART_VERSION_KEY, CURRENT_VERSION);
      
      // If the state items are different from deduped (e.g. they weren't deduped yet),
      // update the state. But we must be careful not to loop.
      if (items.length !== deduped.length) {
        setItems(deduped);
      }
      
      isSavingRef.current = false;
    }
  }, [items]);

  // Sync with database when user logs in
  useEffect(() => {
    if (isLoadedRef.current && !authLoading && user) {
      syncCartWithDatabase();
    } else if (!authLoading && !user) {
      // Clear cart metadata if user logs out, but keep local items
      setCart(null);
    }
  }, [user, authLoading]);

  async function syncCartWithDatabase() {
    if (!user) return;
    setSyncing(true);
    
    try {
      // First try to find an existing active cart
      const { data: existingCart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      let userCart = existingCart;

      if (!userCart) {
        // If no active cart, create one
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert({ user_id: user.id, status: 'active' })
          .select()
          .single();
        
        if (createError) {
          console.error('Failed to create cart:', createError);
          setSyncing(false);
          return;
        }
        userCart = newCart;
      }
      
      setCart(userCart);
      
      // Load current items from database
      const { data: dbCartItems } = await supabase
        .from('cart_items')
        .select('*, product:products(*, images:product_images(*))')
        .eq('cart_id', userCart.id);

      const dbItems: CartItemUI[] = (dbCartItems || []).map(ci => {
        const product = ci.product;
        const images = product?.images ?? [];
        return {
          id: ci.id,
          productId: ci.product_id,
          variantId: ci.variant_id || undefined,
          brand: product?.brand?.name ?? '',
          title: product?.name ?? '',
          priceValue: ci.price_cents,
          price: formatPriceCents(ci.price_cents),
          originalPrice: product?.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : '',
          originalPriceValue: product?.compare_at_price_cents ?? ci.price_cents,
          imgSrc: images[0]?.url ?? '',
          size: product?.tagline ?? '',
          quantity: ci.quantity,
        };
      });

      // Merge logic: 
      // If an item is in local but NOT in DB, add it to DB.
      // If an item is in both, the DB quantity is the source of truth OR we sum them once on first login.
      // For now, let's just use DB as truth if they exist there, and add local items that are missing.
      
      const localItems = [...items];
      const itemsToUpdate = [];
      const itemsToAdd = [];

      for (const localItem of localItems) {
        const existsInDb = dbItems.find(dbi => dbi.productId === localItem.productId && dbi.variantId === localItem.variantId);
        if (!existsInDb) {
          itemsToAdd.push({
            cart_id: userCart.id,
            product_id: localItem.productId,
            variant_id: localItem.variantId || null,
            quantity: localItem.quantity,
            price_cents: localItem.priceValue,
          });
        }
      }

      if (itemsToAdd.length > 0) {
        await supabase.from('cart_items').insert(itemsToAdd);
        // Refresh db items after insert
        const { data: refreshedDbItems } = await supabase
          .from('cart_items')
          .select('*, product:products(*, images:product_images(*))')
          .eq('cart_id', userCart.id);
        
        const finalItems = (refreshedDbItems || []).map(ci => {
          const product = ci.product;
          const images = product?.images ?? [];
          return {
            id: ci.id,
            productId: ci.product_id,
            variantId: ci.variant_id || undefined,
            brand: product?.brand?.name ?? '',
            title: product?.name ?? '',
            priceValue: ci.price_cents,
            price: formatPriceCents(ci.price_cents),
            originalPrice: product?.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : '',
            originalPriceValue: product?.compare_at_price_cents ?? ci.price_cents,
            imgSrc: images[0]?.url ?? '',
            size: product?.tagline ?? '',
            quantity: ci.quantity,
          };
        });
        setItems(finalItems);
      } else {
        setItems(dbItems);
      }
      
    } catch (e) { 
      console.error('Cart sync error:', e); 
    } finally { 
      setSyncing(false); 
    }
  }

  const addItem = useCallback(async (item: Omit<CartItemUI, 'price' | 'id' | 'originalPriceValue'> & { id?: string; price?: string; originalPriceValue?: number }) => {
    try {
      const priceValue = item.priceValue;
      const productId = item.productId || item.id!;
      
      if (!productId) {
        console.error('addItem failed: productId is missing', item);
        return;
      }

      // 1. Update Local State Immediately
      setItems(prev => {
        const key = getItemKey(productId, item.variantId);
        const existingIndex = prev.findIndex(i => getItemKey(i.productId, i.variantId) === key);
        
        if (existingIndex >= 0) {
          const newItems = [...prev];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + item.quantity
          };
          return newItems;
        } else {
          // Use a simple ID generator for better compatibility
          const uniqueId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          return [...prev, {
            id: uniqueId,
            productId,
            variantId: item.variantId,
            brand: item.brand,
            title: item.title,
            priceValue,
            price: formatPriceCents(priceValue),
            originalPrice: item.originalPrice ?? '',
            originalPriceValue: item.originalPriceValue ?? priceValue,
            imgSrc: item.imgSrc ?? '',
            size: item.size ?? '',
            quantity: item.quantity,
            badge: item.badge,
          }];
        }
      });

      // 2. Show Toast
      setToastItem({ title: item.title, imgSrc: item.imgSrc ?? '', price: formatPriceCents(priceValue) });
      setToastVisible(true);

      // 3. Sync to DB if logged in
      if (user && cart) {
        try {
          let query = supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('cart_id', cart.id)
            .eq('product_id', productId);
          
          if (item.variantId) {
            query = query.eq('variant_id', item.variantId);
          } else {
            query = query.is('variant_id', null);
          }

          const { data: existing } = await query.maybeSingle();

          if (existing) {
            await supabase
              .from('cart_items')
              .update({ quantity: existing.quantity + item.quantity })
              .eq('id', existing.id);
          } else {
            await supabase
              .from('cart_items')
              .insert({
                cart_id: cart.id,
                product_id: productId,
                variant_id: item.variantId || null,
                quantity: item.quantity,
                price_cents: priceValue,
              });
          }
        } catch (e) {
          console.error('DB add failed', e);
        }
      }
    } catch (err) {
      console.error('addItem runtime error:', err);
    }
  }, [user, cart]);

  const removeItem = useCallback(async (productId: string, variantId?: string) => {
    // 1. Update Local State Immediately
    setItems(prev => prev.filter(i => !(i.productId === productId && i.variantId === variantId)));

    // 2. Sync to DB if logged in
    if (user && cart) {
      try {
        let query = supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id)
          .eq('product_id', productId);
        
        if (variantId) {
          query = query.eq('variant_id', variantId);
        } else {
          query = query.is('variant_id', null);
        }
        
        await query;
      } catch (e) { console.error('DB remove failed', e); }
    }
  }, [user, cart]);

  const updateQuantity = useCallback(async (productId: string, qty: number, variantId?: string) => {
    if (qty <= 0) {
      return removeItem(productId, variantId);
    }

    // 1. Update Local State Immediately
    setItems(prev => prev.map(i => 
      (i.productId === productId && i.variantId === variantId) 
        ? { ...i, quantity: qty } 
        : i
    ));

    // 2. Sync to DB if logged in
    if (user && cart) {
      try {
        let query = supabase
          .from('cart_items')
          .update({ quantity: qty })
          .eq('cart_id', cart.id)
          .eq('product_id', productId);
        
        if (variantId) {
          query = query.eq('variant_id', variantId);
        } else {
          query = query.is('variant_id', null);
        }
        
        await query;
      } catch (e) { console.error('DB update failed', e); }
    }
  }, [user, cart, removeItem]);

  const clearCart = useCallback(async () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    
    if (user && cart) {
      try {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      } catch (e) { console.error('DB clear failed', e); }
    }
  }, [user, cart]);

  // Recalculate totals from deduped items
  const dedupedItems = mergeItemsByProductId(items);
  const itemCount = dedupedItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  const subtotal = dedupedItems.reduce((sum, i) => sum + (Number(i.priceValue) || 0) * (Number(i.quantity) || 0), 0);
  const totalSavings = dedupedItems.reduce((sum, i) => {
    const originalPrice = Number(i.originalPriceValue) || Number(i.priceValue) || 0;
    const currentPrice = Number(i.priceValue) || 0;
    const qty = Number(i.quantity) || 0;
    return sum + ((originalPrice - currentPrice) * qty);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      items: dedupedItems, // Always return deduped items
      addItem, 
      removeItem: (productId: string) => {
        console.log('Removing item:', productId);
        removeItem(productId, undefined);
      }, 
      updateQuantity: (productId: string, qty: number) => {
        console.log('Updating quantity:', productId, qty);
        updateQuantity(productId, qty, undefined);
      }, 
      clearCart, 
      itemCount, 
      subtotal, 
      totalSavings,
      syncing 
    }}>
      {children}
      <AddToCartToast
        item={toastItem}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
