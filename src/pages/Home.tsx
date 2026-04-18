import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import type { Product, Brand, Category, ProductImage } from '../types/database';
import { formatPriceCents } from '../types/database';

type ProductWithRelations = Product & { brand: Brand; category: Category; images: ProductImage[] };

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function Home() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeBrand, setActiveBrand] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
        api.brands.getAll(),
      ]);
      setProducts(productsData as ProductWithRelations[]);
      setCategories(categoriesData.filter(c => c.is_active));
      setBrands(brandsData.filter(b => b.is_active));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const filteredProducts = products.filter(p => {
    const categoryMatch = activeCategory === 'all' || p.category?.slug === activeCategory;
    const brandMatch = activeBrand === 'all' || p.brand?.id === activeBrand;
    return categoryMatch && brandMatch && p.is_active;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory, activeBrand]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + 12);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const categoryIconMap: Record<string, string> = {
    'skincare': 'water_drop',
    'hair-body': 'face',
    'fragrance': 'eco',
    'makeup': 'brush',
    'default': 'grid_view',
  };

  function getCategoryIcon(slug: string) {
    return categoryIconMap[slug] ?? categoryIconMap['default'];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="relative w-full h-[400px] md:h-[440px] overflow-hidden">
          <div className="absolute inset-0 bg-primary-container ">
            <img
              className="w-full h-full object-cover opacity-70 mix-blend-multiply dark:opacity-50"
              alt="Luxury apothecary products styled on warm marble with botanical accents"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5ck0WUH0px0KcngeO0FEbL2oq57PzKyKHS9xHbb3KY136NTW_I2s8I4UrqchdLWXLJIfZpaWf_mw9aZZPUKuk5NYnoe1krpoH7izeOJKs_hLwbb_LloWTLRYMho0iiamFrveEF0pRnYga3FowWbC8rESVrAOYCwod-Q1n6sIPp5qd2w1-dXZCkaJj362OR6ryJC5ixud4CsWKfYktHPbF3dPsiK4qqRqQ4v2rB_ll0hbjqx0GW4NUcQvQysgXtmKavR575n8KhDzU"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent  " />
          <div className="relative h-full flex flex-col justify-center max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-tertiary-container  text-on-tertiary px-4 py-1.5 rounded-sm w-fit shadow-lg">
              <Icon name="bolt" filled className="text-sm" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Limited Stock Event</span>
            </div>
            <h1 className="font-noto-serif text-4xl lg:text-5xl xl:text-7xl text-white font-bold leading-[1.05]">
              Heritage Beauty,<br />
              <span className="italic font-normal text-secondary-fixed ">Reclaimed.</span>
            </h1>
            <p className="text-white/90 font-manrope text-base md:text-lg max-w-xl leading-relaxed">
              The curated edit of global luxury skincare and fragrance, now accessible for the discerning Sri Lankan ritual.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 pt-1">
              <Link to="/#shop" className="bg-secondary  text-on-secondary px-8 py-3.5 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-on-secondary-fixed-variant  transition-all shadow-lg hover:scale-[1.02] text-center">
                Shop Clearance
              </Link>
              <Link to="/consult" className="border border-white/50 text-on-surface backdrop-blur-sm px-8 py-3.5 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-surface transition-all text-center">
                AI Ritual Consult
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-high  border-y border-outline-variant/30 ">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 py-6 md:py-7 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            <div className="flex items-center gap-3.5 md:gap-4">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary/10  flex items-center justify-center text-primary  flex-shrink-0">
                <Icon name="verified_user" className="text-xl md:text-2xl" />
              </div>
              <div>
                <h4 className="font-noto-serif font-bold text-primary  uppercase text-xs md:text-xs tracking-wider leading-tight">100% Authentic Guarantee</h4>
                <p className="text-xs md:text-xs text-on-surface-variant  mt-0.5">Original batch codes on every item.</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 md:gap-4">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary/10  flex items-center justify-center text-primary  flex-shrink-0">
                <Icon name="verified" className="text-xl md:text-2xl" />
              </div>
              <div>
                <h4 className="font-noto-serif font-bold text-primary  uppercase text-xs md:text-xs tracking-wider leading-tight">Authorised Distribution</h4>
                <p className="text-xs md:text-xs text-on-surface-variant  mt-0.5">Direct from brand. No grey market.</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 md:gap-4">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary/10  flex items-center justify-center text-primary  flex-shrink-0">
                <Icon name="ac_unit" className="text-xl md:text-2xl" />
              </div>
              <div>
                <h4 className="font-noto-serif font-bold text-primary  uppercase text-xs md:text-xs tracking-wider leading-tight">Temperature Controlled</h4>
                <p className="text-xs md:text-xs text-on-surface-variant  mt-0.5">Climate-safe storage & island-wide delivery.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-surface-container  border-b border-outline-variant/10  transition-colors duration-300" id="shop">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pt-5 pb-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-outline-variant/20 pb-0">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex items-center gap-2 px-4 pb-3.5 text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                  activeCategory === 'all'
                    ? 'border-primary  text-primary '
                    : 'border-transparent text-on-surface-variant  hover:text-on-surface '
                }`}
              >
                <Icon name="grid_view" className="text-base" />
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex items-center gap-2 px-4 pb-3.5 text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                    activeCategory === cat.slug
                      ? 'border-primary  text-primary '
                      : 'border-transparent text-on-surface-variant  hover:text-on-surface '
                  }`}
                >
                  <Icon name={getCategoryIcon(cat.slug)} className="text-base" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 py-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveBrand('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeBrand === 'all'
                    ? 'bg-primary  text-on-primary  shadow-sm'
                    : 'bg-surface-container-high  text-on-surface-variant  hover:bg-surface-variant  border border-transparent hover:border-outline-variant'
                }`}
              >
                All Brands
              </button>
              {brands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setActiveBrand(brand.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    activeBrand === brand.id
                      ? 'bg-primary  text-on-primary  shadow-sm'
                      : 'bg-surface-container-high  text-on-surface-variant  hover:bg-surface-variant  border border-transparent hover:border-outline-variant'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="p-6 md:p-10 lg:p-12 max-w-screen-2xl mx-auto pb-24 md:pb-12">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-on-surface-variant ">
              <span className="font-bold text-primary ">{filteredProducts.length}</span>
              {' '}product{filteredProducts.length !== 1 ? 's' : ''}
              {activeCategory !== 'all' && ` in ${categories.find(c => c.slug === activeCategory)?.name ?? activeCategory}`}
              {activeBrand !== 'all' && ` from ${brands.find(b => b.id === activeBrand)?.name ?? ''}`}
            </p>
            {(activeCategory !== 'all' || activeBrand !== 'all') && (
              <button
                onClick={() => { setActiveCategory('all'); setActiveBrand('all'); }}
                className="text-xs text-secondary  hover:underline font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 lg:gap-x-8 gap-y-12 lg:gap-y-16">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-surface-container-highest  rounded-sm" />
                  <div className="h-3 bg-surface-container-highest  w-1/2 rounded" />
                  <div className="h-5 bg-surface-container-highest  w-3/4 rounded" />
                  <div className="h-10 bg-surface-container-highest  w-full rounded" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              <Icon name="inventory_2" className="text-5xl mb-4 opacity-30" />
              <p className="font-noto-serif text-xl mb-2">No products found</p>
              <p className="text-sm">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 lg:gap-x-8 gap-y-12 lg:gap-y-16">
              {displayedProducts.map((product) =>
                React.createElement(HomeProductCard, { product, key: product.id })
              )}
            </div>
          )}

          {hasMore && !loading && (
            <div ref={loadMoreRef} className="mt-20 lg:mt-24 text-center">
              <span className="border-b-2 border-primary pb-1 font-bold uppercase tracking-widest text-xs text-primary">
                Loading more curated selections...
              </span>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-surface-container  w-full flex flex-col items-center justify-center text-center space-y-6 px-8 py-12 mt-auto transition-colors duration-300 pb-24 md:pb-12">
        <span className="font-noto-serif italic text-xl text-primary ">Rituals.lk</span>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-manrope text-xs tracking-widest uppercase">
          <Link to="/support" className="text-on-surface-variant  hover:text-secondary  transition-colors duration-300">Shipping & Returns</Link>
          <Link to="/support" className="text-on-surface-variant  hover:text-secondary  transition-colors duration-300">Privacy Policy</Link>
          <Link to="/support" className="text-on-surface-variant  hover:text-secondary  transition-colors duration-300">Sustainability Manifesto</Link>
          <Link to="/support" className="text-on-surface-variant  hover:text-secondary  transition-colors duration-300">Store Locator</Link>
        </div>
        <p className="font-manrope text-xs tracking-widest uppercase text-on-surface-variant  opacity-60">© 2024 Rituals.lk. Affordable Personal Care.</p>
      </footer>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-16 px-4 md:hidden bg-surface  z-50 border-t border-[#e5e2da]  shadow-[0_-4px_12px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <Link to="/" className="flex flex-col items-center justify-center text-secondary  font-black min-w-[64px] min-h-[44px] px-1 py-1">
          <Icon name="storefront" filled />
          <span className="font-manrope text-xs uppercase tracking-tighter mt-1">Shop</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center justify-center text-on-surface-variant  hover:bg-[#f6f3ea]  rounded-lg min-w-[64px] min-h-[44px] px-1 py-1">
          <Icon name="search" />
          <span className="font-manrope text-xs uppercase tracking-tighter mt-1">Search</span>
        </Link>
        <Link to="/consult" className="flex flex-col items-center justify-center text-on-surface-variant  hover:bg-[#f6f3ea]  rounded-lg min-w-[64px] min-h-[44px] px-1 py-1">
          <Icon name="chat_bubble" />
          <span className="font-manrope text-xs uppercase tracking-tighter mt-1">Consult</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center text-on-surface-variant  hover:bg-[#f6f3ea]  rounded-lg min-w-[64px] min-h-[44px] px-1 py-1">
          <Icon name="favorite" />
          <span className="font-manrope text-xs uppercase tracking-tighter mt-1">Favorites</span>
        </Link>
        <Link to="/login" className="flex flex-col items-center justify-center text-on-surface-variant  hover:bg-[#f6f3ea]  rounded-lg min-w-[64px] min-h-[44px] px-1 py-1">
          <Icon name="person" />
          <span className="font-manrope text-xs uppercase tracking-tighter mt-1">Account</span>
        </Link>
      </nav>
    </div>
  );
}

function HomeProductCard({ product }: { product: ProductWithRelations }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const firstImage = product.images?.[0];
  const discount = product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents
    ? Math.round((1 - product.price_cents / product.compare_at_price_cents) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
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
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
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
    navigate('/checkout');
  };

  return (
    <div className="group flex flex-col space-y-4">
      <div className="relative aspect-[4/5] bg-surface-container-low  overflow-hidden rounded-sm">
        <Link to={`/product?slug=${product.slug}`}>
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            alt={product.name}
            src={firstImage?.url ?? 'https://via.placeholder.com/400x500?text=No+Image'}
          />
        </Link>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount && (
            <span className="bg-tertiary text-on-tertiary text-xs font-black px-2 py-1 rounded-sm uppercase tracking-widest shadow-lg w-fit">-{discount}%</span>
          )}
          {product.is_featured && (
            <span className="bg-secondary text-on-secondary text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-tighter w-fit">Featured</span>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <p className="font-manrope text-xs uppercase tracking-[0.2em] text-outline ">{product.brand?.name ?? '—'}</p>
        <Link to={`/product?slug=${product.slug}`}>
          <h3 className="font-noto-serif text-lg font-bold leading-tight text-on-surface  hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        {product.tagline && <p className="text-on-surface-variant  text-sm line-clamp-2 leading-relaxed">{product.tagline}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-secondary  font-manrope">{formatPriceCents(product.price_cents)}</span>
        {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents && (
          <span className="text-sm text-on-surface-variant line-through">{formatPriceCents(product.compare_at_price_cents)}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-surface-container-highest  rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary  rounded-full transition-all"
            style={{ width: `${Math.min(100, ((product.stock_qty ?? 0) / 20) * 100)}%` }}
          />
        </div>
        {(product.stock_qty ?? 0) <= (product.low_stock_threshold ?? 5) && (
          <span className="text-xs text-secondary  font-black whitespace-nowrap">
            Only {product.stock_qty ?? 0} left
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 min-h-[44px] py-2 bg-primary  text-on-primary  font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Icon name="add_shopping_cart" className="text-sm" />
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 min-h-[44px] py-2 bg-secondary  text-on-secondary  font-bold text-xs rounded-lg hover:opacity-90 transition-opacity"
        >
          Buy Now
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs text-outline ">
        <Icon name="verified" className="text-xs" filled /> Authenticity Guaranteed
        {product.sku && <><span>·</span><span>SKU: {product.sku}</span></>}
      </div>
    </div>
  );
}
