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

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemUI[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [syncing, setSyncing] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    if (user) {
      loadUserCart();
    }
  }, [user]);

  async function loadUserCart() {
    if (!user) return;
    setSyncing(true);
    try {
      const { data: existing } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (existing) {
        setCart(existing);
        const { data: cartItems } = await supabase
          .from('cart_items')
          .select('*, product:products(*, images:product_images(*))')
          .eq('cart_id', existing.id);

        if (cartItems) {
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
      } else {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: user.id, status: 'active' })
          .select()
          .single();
        if (newCart) setCart(newCart);
      }
    } catch (e) { console.error('Cart load error:', e); }
    finally { setSyncing(false); }
  }

  const addItem = useCallback(async (item: Omit<CartItemUI, 'price'> & { price?: string }) => {
    const priceValue = item.priceValue;
    const price = formatPriceCents(priceValue);

    if (user && cart) {
      try {
        const { data, error } = await supabase
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

        if (!error && data) {
          setItems(prev => {
            const existing = prev.find(i => i.productId === item.productId);
            if (existing) {
              return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
            }
            return [...prev, {
              id: data.id,
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
          });
        }
      } catch (e) { console.error('Add to cart error:', e); }
    }
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, {
        id: item.id,
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
    });
  }, [user, cart]);

  const removeItem = useCallback(async (id: string) => {
    if (user && cart) {
      await supabase.from('cart_items').delete().eq('id', id).eq('cart_id', cart.id);
    }
    setItems(prev => prev.filter(i => i.id !== id));
  }, [user, cart]);

  const updateQuantity = useCallback(async (id: string, qty: number) => {
    if (user && cart) {
      if (qty <= 0) {
        await supabase.from('cart_items').delete().eq('id', id).eq('cart_id', cart.id);
      } else {
        await supabase.from('cart_items').update({ quantity: qty }).eq('id', id).eq('cart_id', cart.id);
      }
    }
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, [user, cart]);

  const clearCart = useCallback(async () => {
    if (user && cart) {
      await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    }
    setItems([]);
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
