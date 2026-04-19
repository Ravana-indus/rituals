import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';
import BrandedProductCard from '../components/BrandedProductCard';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import type { Product, Brand, Category, ProductImage, ProductVariant } from '../types/database';
import { formatPriceCents } from '../types/database';

type ProductWithRelations = Product & { brand: Brand; category: Category; images: ProductImage[]; variants: ProductVariant[] };

export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [related, setRelated] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) loadProduct(slug);
    window.scrollTo(0, 0);
  }, [slug]);

  async function loadProduct(productSlug: string) {
    setLoading(true);
    try {
      const data = await api.products.getBySlug(productSlug);
      setProduct(data as ProductWithRelations | null);
      setSelectedImage(0);
      if (data?.category_id) {
        const allProducts = await api.products.getAll({ categoryId: data.category_id });
        setRelated((allProducts as ProductWithRelations[]).filter(p => p.slug !== productSlug && p.is_active).slice(0, 5));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleAddToCart() {
    if (!product) return;
    setAddingToCart(true);
    try {
      const firstImage = product.images?.[0];
      await addItem({
        id: product.id,
        productId: product.id,
        brand: product.brand?.name ?? '',
        title: product.name,
        priceValue: product.price_cents,
        originalPrice: product.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : '',
        imgSrc: firstImage?.url ?? '',
        size: product.tagline ?? '',
        quantity: 1,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (e) { console.error(e); }
    finally { setAddingToCart(false); }
  }

  async function handleBuyNow() {
    if (!product) return;
    await handleAddToCart();
    navigate('/checkout');
  }

  const discount = product?.compare_at_price_cents && product.compare_at_price_cents > product.price_cents
    ? Math.round((1 - product.price_cents / product.compare_at_price_cents) * 100)
    : null;

  if (loading) return (
    <BrandedLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--dd-surface-strong)] border-t-[var(--dd-surface-base)]" />
      </div>
    </BrandedLayout>
  );

  if (!product) return (
    <BrandedLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingBag className="mb-4 h-16 w-16 opacity-10" />
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 opacity-60">This ritual may have moved or is no longer available.</p>
        <Link to="/" className="mt-6 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] px-8 py-3 font-bold text-white shadow-lg transition hover:opacity-90">
          Back to Apothecary
        </Link>
      </div>
    </BrandedLayout>
  );

  const allImages = product.images ?? [];

  return (
    <BrandedLayout>
      <div className="px-[var(--dd-space-4)] py-[var(--dd-space-4)] md:px-[var(--dd-space-6)]">
        {/* Breadcrumbs */}
        <nav className="mb-[var(--dd-space-6)] flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest opacity-40">
          <Link to="/" className="hover:opacity-100 transition">Apothecary</Link>
          <ChevronRight className="h-3 w-3" />
          {product.category && (
            <>
              <Link to={`/?category=${product.category.slug}`} className="hover:opacity-100 transition">{product.category.name}</Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="opacity-100 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Visuals Column */}
          <div className="lg:col-span-7">
            <div className="sticky top-[100px] space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--dd-radius-xs)] bg-[#f8f9fa] flex items-center justify-center border border-[var(--dd-surface-strong)]">
                <img
                  className="h-full w-full object-contain mix-blend-multiply p-8"
                  alt={product.name}
                  src={allImages[selectedImage]?.url ?? 'https://via.placeholder.com/800x1000?text=No+Image'}
                />
                {discount && (
                  <div className="absolute right-4 top-4 rounded-full bg-[#AF8F6F] px-4 py-2 text-[14px] font-bold text-white shadow-lg">
                    {discount}% OFF
                  </div>
                )}
              </div>
              
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-[4/5] w-20 flex-shrink-0 overflow-hidden rounded-[var(--dd-radius-xs)] border-2 transition-all ${
                        selectedImage === i ? 'border-[var(--dd-surface-base)]' : 'border-transparent opacity-60 hover:opacity-100'
                      } bg-[#f8f9fa]`}
                    >
                      <img className="h-full w-full object-contain mix-blend-multiply p-2" alt={img.alt_text ?? product.name} src={img.url} />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Section */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-4">
                <TrustItem icon={ShieldCheck} label="100% Authentic" sub="Direct from source" />
                <TrustItem icon={Truck} label="24h Dispatch" sub="Colombo & beyond" />
                <TrustItem icon={RotateCcw} label="14-Day Returns" sub="Easy & Hassle-free" />
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="space-y-6">
              <div>
                <p className="text-[14px] font-bold uppercase tracking-[0.2em] opacity-40">{product.brand?.name || 'Rituals'}</p>
                <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-tight lg:text-[48px]">
                  {product.name}
                </h1>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1 rounded bg-[var(--dd-surface-strong)] px-2 py-1 text-[13px] font-bold">
                    <Star className="h-4 w-4 fill-current text-black" />
                    <span>4.8</span>
                  </div>
                  <span className="text-[13px] font-medium underline opacity-60 cursor-pointer">120 Reviews</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-4">
                  <span className="text-[32px] font-bold">{formatPriceCents(product.price_cents)}</span>
                  {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents && (
                    <span className="text-[20px] font-medium opacity-30 line-through">
                      {formatPriceCents(product.compare_at_price_cents)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <EMIBadge label="3 x Mintpay" value={Math.round(product.price_cents / 3)} color="#76885B" />
                  <EMIBadge label="4 x Payzy" value={Math.round(product.price_cents / 4)} color="#AF8F6F" />
                </div>
              </div>

              {product.tagline && (
                <p className="text-[18px] leading-relaxed opacity-70">
                  {product.tagline}
                </p>
              )}

              {/* Action Section */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || (product.stock_qty ?? 0) <= 0}
                  className={`w-full flex min-h-[56px] items-center justify-center gap-3 rounded-[var(--dd-radius-sm)] py-4 text-[16px] font-bold text-white shadow-xl transition-all active:scale-[0.98] ${
                    addedToCart ? 'bg-green-600' : 'bg-[var(--dd-surface-base)] hover:opacity-95'
                  } disabled:opacity-50`}
                >
                  {addingToCart ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : addedToCart ? (
                    <><Check className="h-5 w-5" /> Added to Bag</>
                  ) : (
                    <><Plus className="h-5 w-5" /> Add to Bag</>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart || (product.stock_qty ?? 0) <= 0}
                  className="w-full min-h-[56px] rounded-[var(--dd-radius-sm)] border-2 border-[var(--dd-surface-base)] py-4 text-[16px] font-bold transition-all hover:bg-[var(--dd-surface-strong)] active:scale-[0.98] disabled:opacity-50"
                >
                  Buy It Now
                </button>
              </div>

              {(product.stock_qty ?? 0) <= (product.low_stock_threshold ?? 5) && (
                <div className="rounded-[var(--dd-radius-xs)] bg-[#AF8F6F]/5 border border-[#AF8F6F]/10 p-4">
                  <p className="text-[13px] font-bold text-[#AF8F6F] uppercase tracking-wider flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#AF8F6F] animate-pulse" />
                    Limited Stock
                  </p>
                  <p className="mt-1 text-[13px] opacity-70">Only {product.stock_qty} units available at this price.</p>
                </div>
              )}

              {/* Info Accordions */}
              <div className="divide-y divide-[var(--dd-surface-strong)] border-t border-b border-[var(--dd-surface-strong)] mt-8">
                <Accordion 
                  title="Description" 
                  isOpen={openAccordion === 'description'} 
                  onClick={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
                >
                  <div className="text-[15px] leading-relaxed opacity-70">{product.description || 'No description available for this item.'}</div>
                </Accordion>
                {product.key_benefits && (
                  <Accordion 
                    title="Key Benefits" 
                    isOpen={openAccordion === 'benefits'} 
                    onClick={() => setOpenAccordion(openAccordion === 'benefits' ? null : 'benefits')}
                  >
                    <ul className="space-y-3">
                      {(typeof product.key_benefits === 'string' ? product.key_benefits.split('\n') : (Array.isArray(product.key_benefits) ? product.key_benefits : [])).filter(Boolean).map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px]">
                          <Check className="mt-1 h-4 w-4 flex-shrink-0 text-black" />
                          <span className="opacity-70">{String(b)}</span>
                        </li>
                      ))}
                    </ul>
                  </Accordion>
                )}
                {product.ingredients && (
                  <Accordion 
                    title="Ingredients" 
                    isOpen={openAccordion === 'ingredients'} 
                    onClick={() => setOpenAccordion(openAccordion === 'ingredients' ? null : 'ingredients')}
                  >
                    <div className="text-[14px] leading-relaxed opacity-70 italic">{product.ingredients}</div>
                  </Accordion>
                )}
                <Accordion 
                  title="Delivery & Returns" 
                  isOpen={openAccordion === 'delivery'} 
                  onClick={() => setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')}
                >
                  <div className="space-y-4 text-[14px] opacity-70">
                    <p>Standard delivery arrives in 1-3 business days. Same-day delivery available for Colombo orders placed before 10 AM.</p>
                    <p>Sealed and unused items can be returned within 14 days of purchase for a full refund or exchange.</p>
                  </div>
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-[var(--dd-space-8)] pb-[var(--dd-space-7)]">
            <div className="mb-8 flex items-center justify-between border-b border-[var(--dd-surface-strong)] pb-6">
              <h2 className="text-[24px] font-bold tracking-tight md:text-[32px]">Build Your Ritual</h2>
              <Link to="/" className="text-[14px] font-bold text-[var(--dd-text-secondary)] hover:underline">See all Apothecary</Link>
            </div>
            <div className="grid gap-[var(--dd-space-5)] grid-cols-2 lg:grid-cols-5">
              {related.map(rel => (
                <BrandedProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </BrandedLayout>
  );
}

function TrustItem({ icon: Icon, label, sub }: { icon: any, label: string, sub: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] p-3">
      <Icon className="h-5 w-5 opacity-60" />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-tight">{label}</p>
        <p className="text-[10px] opacity-40">{sub}</p>
      </div>
    </div>
  );
}

function EMIBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--dd-surface-strong)] bg-white px-3 py-1 text-[11px] font-bold shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="opacity-40">{label}:</span>
      <span>{formatPriceCents(value)}</span>
    </div>
  );
}

function Accordion({ title, isOpen, onClick, children }: { title: string, isOpen: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <div>
      <button 
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 text-left transition hover:opacity-70"
      >
        <span className="text-[15px] font-bold uppercase tracking-widest">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 opacity-40" />}
      </button>
      {isOpen && (
        <div className="pb-8 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

