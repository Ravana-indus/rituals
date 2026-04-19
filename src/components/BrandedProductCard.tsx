import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product, Brand, Category, ProductImage } from '../types/database';
import { formatPriceCents } from '../types/database';

type ProductWithRelations = Product & { brand: Brand; category: Category; images: ProductImage[] };

export default function BrandedProductCard({ product }: { product: ProductWithRelations }) {
  const { addItem } = useCart();
  const image = product.images?.[0]?.url;
  const discount = product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents
    ? Math.round((1 - product.price_cents / product.compare_at_price_cents) * 100)
    : null;
  const isLowStock = product.stock_qty !== null && product.stock_qty <= (product.low_stock_threshold ?? 5);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Adding product to bag:', product.name, product.id);
    try {
      await addItem({
        productId: product.id,
        brand: product.brand?.name ?? '',
        title: product.name,
        priceValue: Number(product.price_cents) || 0,
        originalPrice: product.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : '',
        originalPriceValue: Number(product.compare_at_price_cents) || Number(product.price_cents) || 0,
        imgSrc: image ?? '',
        size: product.tagline ?? '',
        quantity: 1,
      });
      console.log('addItem successfully completed for:', product.name);
    } catch (err) {
      console.error('CRITICAL: handleAddToCart failed:', err);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-[var(--dd-radius-xs)] bg-white p-2.5 transition hover:shadow-[var(--dd-shadow-4)]">
      <Link to={`/product?slug=${product.slug}`} className="relative aspect-[4/5] overflow-hidden rounded-[var(--dd-radius-xs)] bg-[#f8f9fa]">
        {image ? (
          <img 
            src={image} 
            alt={product.name} 
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--dd-text-tertiary)] opacity-20">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}
        
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="rounded-[4px] bg-[var(--dd-surface-base)] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-tighter">
              Featured
            </span>
          )}
          {discount && (
            <span className="rounded-[4px] bg-[#AF8F6F] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-tighter">
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>
      
      <div className="mt-3 flex flex-col flex-1 px-0.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--dd-text-tertiary)] opacity-40">
          {product.brand?.name || 'Ritual Exclusive'}
        </p>
        
        <Link to={`/product?slug=${product.slug}`} className="mt-1 block hover:underline">
          <h3 className="text-[14px] font-bold leading-tight text-[var(--dd-text-tertiary)] line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[16px] font-bold text-[var(--dd-text-tertiary)]">
            {formatPriceCents(product.price_cents)}
          </span>
          {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents && (
            <span className="text-[12px] opacity-40 line-through font-medium">
              {formatPriceCents(product.compare_at_price_cents)}
            </span>
          )}
        </div>
        
        <div className="mt-3 space-y-1.5 border-t border-[var(--dd-surface-strong)] pt-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--dd-text-tertiary)] opacity-70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#76885B]" />
            <span>3 x {formatPriceCents(Math.round(product.price_cents / 3))} with Koko</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--dd-text-tertiary)] opacity-70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#AF8F6F]" />
            <span>4 x {formatPriceCents(Math.round(product.price_cents / 4))} with Payzy</span>
          </div>
        </div>

        {isLowStock && (
          <p className="mt-3 text-[10px] font-bold text-[#AF8F6F] uppercase tracking-tighter">
            Only {product.stock_qty} left
          </p>
        )}
        
        <div className="mt-4">
          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Bag
          </button>
        </div>
        
        {product.sku && (
          <p className="mt-2 text-[10px] opacity-20 font-medium tracking-tight text-center uppercase">
            SKU: {product.sku}
          </p>
        )}
      </div>
    </div>
  );
}
