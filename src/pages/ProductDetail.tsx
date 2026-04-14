import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import type { Product, Brand, Category, ProductImage, ProductVariant } from '../types/database';
import { formatPriceCents } from '../types/database';

type ProductWithRelations = Product & { brand: Brand; category: Category; images: ProductImage[]; variants: ProductVariant[] };

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [related, setRelated] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) loadProduct(slug);
  }, [slug]);

  async function loadProduct(productSlug: string) {
    setLoading(true);
    try {
      const data = await api.products.getBySlug(productSlug);
      setProduct(data as ProductWithRelations | null);
      setSelectedImage(0);
      if (data?.category_id) {
        const allProducts = await api.products.getAll({ categoryId: data.category_id });
        setRelated((allProducts as ProductWithRelations[]).filter(p => p.slug !== productSlug && p.is_active).slice(0, 3));
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
        badge: product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents
          ? { label: 'Clearance', type: 'clearance' as const }
          : undefined,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (e) { console.error(e); }
    finally { setAddingToCart(false); }
  }

  async function handleBuyNow() {
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
        badge: product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents
          ? { label: 'Clearance', type: 'clearance' as const }
          : undefined,
      });
      navigate('/checkout');
    } catch (e) { console.error(e); }
    finally { setAddingToCart(false); }
  }

  function toggleAccordion(id: string) {
    setOpenAccordion(prev => prev === id ? null : id);
  }

  const discount = product?.compare_at_price_cents && product.compare_at_price_cents > product.price_cents
    ? Math.round((1 - product.price_cents / product.compare_at_price_cents) * 100)
    : null;

  if (loading) return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="pt-8 pb-24 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto flex-grow flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading product...</div>
      </main>
    </div>
  );

  if (!product) return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="pt-8 pb-24 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto flex-grow flex items-center justify-center">
        <div className="text-center">
          <Icon name="search_off" className="text-5xl text-on-surface-variant mb-4" />
          <h1 className="text-2xl font-noto-serif text-primary mb-2">Product Not Found</h1>
          <p className="text-on-surface-variant mb-6">This product may have been removed or is no longer available.</p>
          <Link to="/" className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm">Back to Shop</Link>
        </div>
      </main>
    </div>
  );

  const firstImage = product.images?.[0];
  const allImages = product.images ?? [];

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />

      <main className="pt-8 pb-24 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto flex-grow">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant mb-8 font-medium">
          <Link to="/">Apothecary</Link>
          <Icon name="chevron_right" className="text-xs" />
          {product.category && (
            <>
              <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link>
              <Icon name="chevron_right" className="text-xs" />
            </>
          )}
          <span className="text-primary font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low relative">
              <img
                className="w-full h-full object-cover"
                alt={product.name}
                src={allImages[selectedImage]?.url ?? firstImage?.url ?? 'https://via.placeholder.com/600x750?text=No+Image'}
              />
              {discount && (
                <div className="absolute top-6 right-6 bg-tertiary text-on-tertiary py-3 px-5 rounded-full flex flex-col items-center justify-center transform rotate-12 shadow-2xl border-2 border-tertiary-fixed-dim">
                  <span className="text-xs uppercase font-bold tracking-tighter">Clearance Steal</span>
                  <span className="text-xl font-noto-serif italic">-{discount}%</span>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 md:w-20 h-20 md:h-24 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0 border-2 transition-all ${selectedImage === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img className="w-full h-full object-cover" alt={img.alt_text ?? product.name} src={img.url} />
                  </button>
                ))}
              </div>
            )}

            <div className="p-5 bg-primary-fixed/30 border border-primary/10 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary text-on-primary p-2 rounded-lg">
                  <Icon name="verified_user" className="text-xl" />
                </div>
                <h3 className="font-bold uppercase tracking-widest text-primary text-sm">100% Authenticity Guaranteed</h3>
              </div>
              <p className="text-xs leading-relaxed text-on-surface-variant mb-4">
                <span className="font-bold text-primary">Why our prices are lower:</span> We utilize direct ethical sourcing from local Sri Lankan artisans and manage clearance stock batches. You receive the exact same high-quality, authentic heritage formula at a fraction of the boutique price.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-primary/5">
                  <Icon name="verified" className="text-primary text-base" />
                  <span className="text-xs font-black uppercase tracking-tighter">Authenticity Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-primary/5">
                  <Icon name="eco" className="text-primary text-base" />
                  <span className="text-xs font-black uppercase tracking-tighter">Ethically Sourced</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-tertiary text-on-tertiary text-xs px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-1">
                  <Icon name="local_fire_department" className="text-[14px]" />
                  Clearance Steal
                </span>
                <span className="bg-secondary-fixed text-on-secondary-fixed text-xs px-2 py-1 rounded font-bold uppercase tracking-widest">Heritage Batch</span>
                {product.sku && <span className="text-on-surface-variant text-xs uppercase tracking-widest">SKU: {product.sku}</span>}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-primary mb-2 font-noto-serif">{product.name}</h1>
              <p className="text-lg italic font-noto-serif text-on-surface-variant">{product.brand?.name ?? 'The Heritage Curator Apothecary'}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-secondary">{formatPriceCents(product.price_cents)}</span>
                {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents && (
                  <span className="text-xl text-on-surface-variant/60 line-through">{formatPriceCents(product.compare_at_price_cents)}</span>
                )}
              </div>
              {discount && (
                <p className="text-sm font-bold text-tertiary flex items-center gap-1">
                  <Icon name="sell" className="text-sm" />
                  Save {discount}% — Lowest Price in Sri Lanka
                </p>
              )}
            </div>

            {(product.stock_qty ?? 0) <= (product.low_stock_threshold ?? 5) && (
              <div className="p-5 bg-error-container/30 border border-error/20 rounded-xl flex items-center gap-4">
                <div className="w-4 h-4 bg-error rounded-full animate-pulse shadow-[0_0_10px_rgba(186,26,26,0.5)]" />
                <div className="flex flex-col">
                  <p className="text-sm font-black text-error uppercase tracking-wider">Limited Clearance Stock</p>
                  <p className="text-xs text-on-error-container">Only {product.stock_qty ?? 0} units left at this special clearance price.</p>
                </div>
              </div>
            )}

            <div className="p-5 bg-surface-container rounded-lg space-y-3 mb-6 border border-outline-variant/10">
              {product.sku && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="inventory_2" className="text-primary dark:text-primary-fixed text-lg" />
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Batch Code</span>
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant">{product.sku}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="local_shipping" className="text-primary dark:text-primary-fixed text-lg" />
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Ships Within</span>
                </div>
                <span className="text-xs text-secondary font-bold">24 Hours</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="sell" className="text-secondary text-lg mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-0.5">Why Discounted?</span>
                  <span className="text-xs text-on-surface-variant italic">Clearance pricing — limited stock available.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="verified" className="text-primary text-lg mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-0.5">100% Authentic</span>
                  <span className="text-xs text-on-surface-variant">Direct from brand. Original batch.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="recycling" className="text-primary text-lg mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-0.5">Return Policy</span>
                  <span className="text-xs text-on-surface-variant">Sealed items accepted within 14 days.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || (product.stock_qty ?? 0) <= 0}
                  className={`flex-1 py-5 px-6 rounded-lg font-bold text-base tracking-wide uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed hover:opacity-90'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {addingToCart ? (
                    <><Icon name="progress_activity" className="text-sm animate-spin" /> Adding...</>
                  ) : addedToCart ? (
                    <><Icon name="check" className="text-sm" /> Added!</>
                  ) : (
                    <><Icon name="add_shopping_cart" className="text-base" /> Add to Cart</>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart || (product.stock_qty ?? 0) <= 0}
                  className="flex-1 py-5 px-6 rounded-lg font-bold text-base tracking-wide uppercase shadow-xl transition-all bg-secondary dark:bg-secondary text-on-secondary dark:text-on-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
              <p className="text-xs text-center text-on-surface-variant uppercase tracking-widest font-bold">Direct from source · Authenticity Guaranteed · Hand-Bottled in Colombo</p>
            </div>

            <div className="mt-4 border-t border-outline-variant/30">
              {product.description && (
                <div className="py-4 border-b border-outline-variant/30">
                  <button onClick={() => toggleAccordion('description')} className="w-full flex justify-between items-center py-4 border-b border-outline-variant/20">
                    <span className="font-bold uppercase tracking-widest text-sm">Description</span>
                    <Icon name={openAccordion === 'description' ? 'expand_less' : 'expand_more'} className="text-primary" />
                  </button>
                  {openAccordion === 'description' && (
                    <div className="py-4 text-sm text-on-surface-variant leading-relaxed">
                      {product.description}
                    </div>
                  )}
                </div>
              )}
              {product.key_benefits && (
                <div className="py-4 border-b border-outline-variant/30">
                  <button onClick={() => toggleAccordion('benefits')} className="w-full flex justify-between items-center py-4 border-b border-outline-variant/20">
                    <span className="font-bold uppercase tracking-widest text-sm">Key Benefits</span>
                    <Icon name={openAccordion === 'benefits' ? 'expand_less' : 'expand_more'} className="text-primary" />
                  </button>
                  {openAccordion === 'benefits' && (
                    <div className="py-4 text-sm text-on-surface-variant leading-relaxed">
                      {typeof product.key_benefits === 'string'
                        ? product.key_benefits.split('\n').filter(Boolean).map((b, i) => (
                            <p key={i} className="flex items-start gap-2 mb-1">
                              <Icon name="check_circle" className="text-primary text-lg mt-0.5 flex-shrink-0" />
                              <span>{b}</span>
                            </p>
                          ))
                        : Array.isArray(product.key_benefits) && product.key_benefits.map((b, i) => (
                            <p key={i} className="flex items-start gap-2 mb-1">
                              <Icon name="check_circle" className="text-primary text-lg mt-0.5 flex-shrink-0" />
                              <span>{String(b)}</span>
                            </p>
                          ))
                      }
                    </div>
                  )}
                </div>
              )}
              {product.ingredients && (
                <div className="py-4 border-b border-outline-variant/30">
                  <button onClick={() => toggleAccordion('ingredients')} className="w-full flex justify-between items-center py-4 border-b border-outline-variant/20">
                    <span className="font-bold uppercase tracking-widest text-sm">Ingredients</span>
                    <Icon name={openAccordion === 'ingredients' ? 'expand_less' : 'expand_more'} className="text-primary" />
                  </button>
                  {openAccordion === 'ingredients' && (
                    <div className="py-4 text-sm text-on-surface-variant leading-relaxed">
                      {product.ingredients}
                    </div>
                  )}
                </div>
              )}
              {product.how_to_use && (
                <div className="py-4 border-b border-outline-variant/30">
                  <button onClick={() => toggleAccordion('how-to-use')} className="w-full flex justify-between items-center py-4 border-b border-outline-variant/20">
                    <span className="font-bold uppercase tracking-widest text-sm">How to Use</span>
                    <Icon name={openAccordion === 'how-to-use' ? 'expand_less' : 'expand_more'} className="text-primary" />
                  </button>
                  {openAccordion === 'how-to-use' && (
                    <div className="py-4 text-sm text-on-surface-variant leading-relaxed">
                      {product.how_to_use}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 font-noto-serif">Complete Your Ritual</h2>
              <p className="font-noto-serif italic text-on-surface-variant">Carefully selected items to enhance your results</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map(rel => {
                const img = rel.images?.[0];
                const relDiscount = rel.compare_at_price_cents && rel.compare_at_price_cents > rel.price_cents
                  ? Math.round((1 - rel.price_cents / rel.compare_at_price_cents) * 100)
                  : null;
                return (
                  <div key={rel.id} className="group">
                    <div className="aspect-[3/4] bg-surface-container-low rounded-xl overflow-hidden mb-6 relative">
                      <Link to={`/product?slug=${rel.slug}`}>
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={rel.name}
                          src={img?.url ?? 'https://via.placeholder.com/300x400?text=No+Image'}
                        />
                      </Link>
                      {relDiscount && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-tertiary text-on-tertiary text-xs font-black px-2 py-1 rounded-sm uppercase tracking-widest">-{relDiscount}%</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1 font-noto-serif">{rel.name}</h3>
                    <p className="text-secondary font-bold text-sm mb-2">{formatPriceCents(rel.price_cents)}</p>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">{rel.brand?.name}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-[#f1eee5] dark:bg-slate-950 w-full py-12 px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="font-noto-serif text-lg text-[#2A5D5D]">Heritage Luxe</div>
            <div className="flex flex-col gap-4 font-manrope text-sm uppercase tracking-widest">
              <Link to="/support" className="text-[#1c1c17]/60 dark:text-slate-500 hover:text-[#D2691E] transition-all duration-500">Store Locator</Link>
              <Link to="/support" className="text-[#1c1c17]/60 dark:text-slate-500 hover:text-[#D2691E] transition-all duration-500">Privacy Policy</Link>
              <Link to="/support" className="text-[#1c1c17]/60 dark:text-slate-500 hover:text-[#D2691E] transition-all duration-500">Shipping & Rituals</Link>
              <Link to="/support" className="text-[#1c1c17]/60 dark:text-slate-500 hover:text-[#D2691E] transition-all duration-500">Contact Apothecary</Link>
            </div>
          </div>
          <div className="text-right">
            <p className="font-manrope text-sm uppercase tracking-widest text-[#1c1c17]/60 dark:text-slate-500">© 2024 The Heritage Curator. Ethically sourced in Sri Lanka.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
