import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { formatPriceCents } from '../types/database';
import type { Category, Product, Brand, ProductImage } from '../types/database';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

type ProductWithRelations = Product & { brand: Brand; category: Category; images: ProductImage[] };

function SkeletonCard() {
  return (
    <div className="bg-surface-container-low dark:bg-[#1e1e1a] p-5 rounded-xl animate-pulse">
      <div className="aspect-square bg-surface-container-high dark:bg-[#2a2a24] rounded-lg mb-6" />
      <div className="h-3 bg-surface-container-high dark:bg-[#2a2a24] rounded w-1/3 mb-3" />
      <div className="h-5 bg-surface-container-high dark:bg-[#2a2a24] rounded w-2/3 mb-2" />
      <div className="h-4 bg-surface-container-high dark:bg-[#2a2a24] rounded w-full mb-4" />
      <div className="h-8 bg-surface-container-high dark:bg-[#2a2a24] rounded w-1/2 mt-auto" />
    </div>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prods, cats, brds] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll(),
          api.brands.getAll(),
        ]);
        setProducts(prods as ProductWithRelations[]);
        setCategories(cats);
        setBrands(brds);
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setSelectedSize(Object.fromEntries(products.map((p, i) => [`card-${p.id}`, 0])));
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.name?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        (p.tagline ?? '').toLowerCase().includes(q)
      );
    }
    if (activeFilter !== "All" && activeFilter !== "Brands") {
      result = result.filter(p => p.category?.name === activeFilter);
    }
    return result;
  }, [query, activeFilter, products]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const val = formData.get('search') as string;
    setSearchParams(val ? { q: val } : {});
  };

  const handleAddToCart = (product: ProductWithRelations) => {
    addItem({
      id: product.id,
      productId: product.id,
      brand: product.brand?.name ?? '',
      title: product.name,
      priceValue: product.price_cents,
      originalPrice: product.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : '',
      imgSrc: product.images?.[0]?.url ?? '',
      size: product.tagline ?? '',
      quantity: 1,
    });
  };

  const handleBuyNow = (product: ProductWithRelations) => {
    addItem({
      id: product.id,
      productId: product.id,
      brand: product.brand?.name ?? '',
      title: product.name,
      priceValue: product.price_cents,
      originalPrice: product.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : '',
      imgSrc: product.images?.[0]?.url ?? '',
      size: product.tagline ?? '',
      quantity: 1,
    });
    navigate('/checkout');
  };

  const categoryNames = useMemo(() => {
    const catNames = categories.map(c => c.name).filter(Boolean);
    return ["All", ...catNames, "Brands"];
  }, [categories]);

  const getBadge = (product: ProductWithRelations) => {
    if (product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents) {
      return { label: "Bargain Find", type: 'bargain' as const };
    }
    return { label: "Clearance", type: 'clearance' as const };
  };

  const getMarketPrice = (product: ProductWithRelations) => {
    return product.compare_at_price_cents ? formatPriceCents(product.compare_at_price_cents) : null;
  };

  return (
    <div className="bg-surface text-on-surface font-manrope selection:bg-secondary-fixed min-h-screen flex flex-col">
      <Header />

      <main className="relative z-10 flex-grow max-w-screen-2xl mx-auto w-full px-6 py-12">
        <header className="mb-12">
          <nav className="mb-4 flex items-center text-xs uppercase tracking-widest text-outline dark:text-outline-variant">
            <Link to="/" className="hover:text-primary dark:hover:text-primary-fixed transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-on-surface dark:text-[#fcf9f0]">Search</span>
            {query && (
              <>
                <span className="mx-2">/</span>
                <span className="text-on-surface dark:text-[#fcf9f0]">{query}</span>
              </>
            )}
          </nav>
          {query ? (
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
              <div>
                <h1 className="font-noto-serif text-4xl md:text-5xl text-primary dark:text-[#fcf9f0] font-bold mb-2">
                  Results for: <span className="italic text-secondary dark:text-secondary-fixed-dim">{query}</span>
                </h1>
                <p className="font-manrope text-outline dark:text-outline-variant font-medium">
                  {loading ? 'Searching...' : `${filtered.length} Artfully Curated ${filtered.length === 1 ? 'Discovery' : 'Discoveries'} Found`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-secondary dark:text-secondary-fixed-dim font-semibold italic">
                <Icon name="auto_awesome" filled className="text-secondary dark:text-secondary-fixed-dim" />
                <span>National Clearance Event Live</span>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-noto-serif text-4xl md:text-5xl text-primary dark:text-[#fcf9f0] font-bold mb-4">
                Search Authentic Brands
              </h1>
              <p className="font-manrope text-outline dark:text-outline-variant font-medium mb-8">
                Discover curated luxury skincare, fragrance, and cosmetics
              </p>
              <form onSubmit={handleSearch} className="max-w-2xl">
                <div className="flex items-center bg-surface-container dark:bg-[#2a2a24] rounded-full px-6 py-4 border border-secondary/20 dark:border-secondary/40 focus-within:border-secondary dark:focus-within:border-secondary transition-colors">
                  <Icon name="search" className="text-outline dark:text-outline-variant text-2xl" />
                  <input
                    name="search"
                    className="bg-transparent border-none focus:ring-0 text-lg w-full font-manrope text-on-surface dark:text-[#fcf9f0] placeholder:text-outline dark:placeholder:text-outline-variant ml-3 outline-none"
                    placeholder="Search for products, brands, or categories..."
                    type="text"
                    defaultValue={query}
                    autoFocus
                  />
                  <button type="submit" className="bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary-container dark:hover:bg-primary-container transition-colors">
                    Search
                  </button>
                </div>
              </form>
            </div>
          )}
        </header>

        <section className="mb-12 bg-primary-container dark:bg-[#1c5151] text-on-primary-container dark:text-[#8fc2c2] p-6 rounded-xl flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 rotate-12 dark:opacity-5">
            <Icon name="verified" filled className="text-[120px]" />
          </div>
          <div className="flex items-center gap-4">
            <Icon name="verified_user" filled className="text-4xl text-on-primary-container dark:text-[#8fc2c2]" />
            <div>
              <h3 className="font-noto-serif text-xl font-bold text-white dark:text-[#fcf9f0]">Authenticity Guaranteed</h3>
              <p className="text-on-primary-container dark:text-[#8fc2c2] text-sm">Directly sourced from heritage artisans and ethical labs. 100% Genuine.</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-on-primary-container/20 dark:bg-[#8fc2c2]/20" />
          <div className="flex items-center gap-4">
            <Icon name="local_shipping" className="text-4xl text-on-primary-container dark:text-[#8fc2c2]" />
            <div>
              <h3 className="font-noto-serif text-xl font-bold text-white dark:text-[#fcf9f0]">Island-wide Ritual Delivery</h3>
              <p className="text-on-primary-container dark:text-[#8fc2c2] text-sm">Carefully packaged with sustainable parchment. Ships in 24 hours.</p>
            </div>
          </div>
        </section>

        <section className="mb-10 flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase font-bold tracking-widest text-outline dark:text-outline-variant mr-2">Refine:</span>
          {categoryNames.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                activeFilter === cat
                  ? 'bg-secondary-fixed dark:bg-secondary text-on-secondary-fixed dark:text-on-secondary font-semibold'
                  : 'bg-surface-container-high dark:bg-[#2a2a24] text-on-surface-variant dark:text-[#e5e2da] hover:bg-surface-variant dark:hover:bg-[#3a3a34]'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {loading ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => React.createElement(SkeletonCard, { key: i }))}
          </section>
        ) : filtered.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product) => {
              const cardKey = `card-${product.id}`;
              const badge = getBadge(product);
              const marketPrice = getMarketPrice(product);
              const stockLeft = product.stock_qty ?? 0;
              const sizeIdx = selectedSize[cardKey] ?? 0;

              return (
                React.createElement('div', {
                  key: cardKey,
                  className: 'group flex flex-col bg-surface-container-low dark:bg-[#1e1e1a] p-5 rounded-xl transition-all duration-300 hover:bg-surface-container-highest dark:hover:bg-[#252520] relative'
                },
                  badge && React.createElement('div', { className: 'absolute top-4 left-4 z-20' },
                    React.createElement('div', {
                      className: `px-4 py-1 stamp-badge text-[10px] font-bold tracking-tighter uppercase flex items-center gap-1 ${
                        badge.type === 'bargain'
                          ? 'bg-tertiary-container dark:bg-[#8a2419] text-white'
                          : 'bg-primary dark:bg-primary text-white'
                      }`
                    },
                      badge.type === 'bargain' && React.createElement(Icon, { name: "confirmation_number", filled: true, className: "text-xs" }),
                      badge.label
                    )
                  ),
                  React.createElement('div', { className: 'aspect-square mb-6 overflow-hidden rounded-lg bg-white dark:bg-[#2a2a24] relative' },
                    React.createElement(Link, { to: `/product?slug=${product.slug}` },
                      React.createElement('img', {
                        alt: product.name,
                        className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
                        src: product.images?.[0]?.url ?? ''
                      })
                    )
                  ),
                  React.createElement('div', { className: 'flex flex-col flex-grow' },
                    React.createElement('span', { className: 'text-[10px] uppercase tracking-[0.2em] text-secondary dark:text-secondary-fixed-dim font-bold mb-1' },
                      product.brand?.name ?? ''
                    ),
                    React.createElement(Link, { to: `/product?slug=${product.slug}` },
                      React.createElement('h3', {
                        className: 'font-noto-serif text-lg font-bold text-primary dark:text-[#fcf9f0] mb-2 hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors'
                      }, product.name)
                    ),
                    React.createElement('p', {
                      className: 'text-sm text-outline-variant dark:text-[#c1c8c7] line-clamp-2 mb-4 italic leading-relaxed'
                    }, product.tagline ?? ''),
                    stockLeft > 0 && React.createElement(React.Fragment, { key: 'stock' },
                      React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                        React.createElement('div', { className: 'flex-1 h-1.5 bg-surface-container-high dark:bg-[#3a3a34] rounded-full overflow-hidden' },
                          React.createElement('div', {
                            className: 'h-full bg-secondary dark:bg-secondary-fixed-dim rounded-full transition-all',
                            style: { width: `${Math.min(100, (stockLeft / 20) * 100)}%` }
                          })
                        ),
                        stockLeft < 15 && React.createElement('span', {
                          className: 'text-[10px] text-secondary dark:text-secondary-fixed-dim font-black whitespace-nowrap'
                        }, `Only ${stockLeft} left`)
                      ),
                      React.createElement('div', { className: 'flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-[9px]' },
                        React.createElement('span', { className: 'flex items-center gap-0.5 text-primary dark:text-primary-fixed' },
                          React.createElement(Icon, { name: "verified", className: "text-[10px]", filled: true }), ' Authenticity Guaranteed'
                        )
                      )
                    ),
                      React.createElement('div', { className: 'mt-auto pt-4 border-t border-outline-variant/10 dark:border-outline-variant/10' },
                        marketPrice && React.createElement('span', {
                          className: 'text-xs text-outline dark:text-outline-variant line-through'
                        }, `Market Price: ${marketPrice}`),
                        React.createElement('span', {
                          className: 'text-xl font-noto-serif font-bold text-tertiary dark:text-[#ffb4a8] block'
                        }, `${badge.type === 'bargain' ? 'BARGAIN FIND' : 'CLEARANCE'}: ${formatPriceCents(product.price_cents)}`),
                        React.createElement('div', { className: 'flex gap-2 mt-3' },
                          React.createElement('button', {
                            onClick: () => handleAddToCart(product),
                            className: 'flex-1 py-3 bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-colors shadow-sm'
                          },
                            React.createElement(Icon, { name: "add_shopping_cart", className: "text-lg" }),
                            'Add to Cart'
                          ),
                          React.createElement('button', {
                            onClick: () => handleBuyNow(product),
                            className: 'flex-1 py-3 bg-secondary dark:bg-secondary text-on-secondary dark:text-on-secondary font-bold rounded-lg hover:opacity-90 transition-colors shadow-sm'
                          },
                            'Buy Now'
                          )
                        )
                      )
                  )
                )
              );
            })}
          </section>
        ) : (
          <div className="text-center py-24">
            <Icon name="search_off" className="text-6xl text-outline-variant dark:text-outline-variant mb-4" />
            <h2 className="font-noto-serif text-2xl font-bold text-primary dark:text-[#fcf9f0] mb-2">No discoveries found</h2>
            <p className="text-outline dark:text-outline-variant mb-8 max-w-md mx-auto">
              We couldn't find any products matching "{query}". Try searching for a brand, category, or product name.
            </p>
            <Link to="/search" className="bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-primary-container dark:hover:bg-primary-container transition-colors">
              Browse All Products
            </Link>
          </div>
        )}

        <section className="mt-20 py-16 px-8 bg-surface-container dark:bg-[#1e1e1a] rounded-3xl text-center max-w-4xl mx-auto border border-outline-variant/10 dark:border-outline-variant/10">
          <h2 className="font-noto-serif text-3xl font-bold text-primary dark:text-[#fcf9f0] mb-4 italic">The Heritage Promise</h2>
          <p className="font-manrope text-outline dark:text-outline-variant max-w-lg mx-auto mb-8">Every clearance item is rigorously inspected for potency and authenticity. We believe heritage beauty should be accessible, never compromised.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input className="px-6 py-3 rounded-lg bg-surface dark:bg-[#121212] border border-outline-variant/30 dark:border-outline-variant/30 focus:ring-2 focus:ring-primary dark:focus:ring-primary-fixed outline-none transition-all w-full sm:w-80 text-on-surface dark:text-[#fcf9f0] placeholder:text-outline dark:placeholder:text-outline-variant" placeholder="Join the Curator's Circle" type="email" />
            <button className="px-8 py-3 bg-secondary dark:bg-secondary text-on-secondary dark:text-on-secondary font-bold rounded-lg hover:bg-secondary-container dark:hover:bg-secondary-container transition-all">Subscribe</button>
          </div>
        </section>
      </main>

      <footer className="bg-[#f1eee5] dark:bg-[#0a0a08] w-full flex flex-col items-center justify-center text-center space-y-6 px-8 py-12 mt-auto transition-colors duration-300">
        <span className="font-noto-serif italic text-xl text-primary dark:text-primary-fixed">The Heritage Curator</span>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-manrope text-xs tracking-widest uppercase">
          <Link to="/support" className="text-[#4a4a40] dark:text-[#a1a195] hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-300">Privacy Policy</Link>
          <Link to="/support" className="text-[#4a4a40] dark:text-[#a1a195] hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-300">Shipping Details</Link>
          <Link to="/support" className="text-[#4a4a40] dark:text-[#a1a195] hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-300">Ethos</Link>
          <Link to="/contact" className="text-[#4a4a40] dark:text-[#a1a195] hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-300">Contact Us</Link>
        </div>
        <p className="font-manrope text-[10px] uppercase tracking-widest text-[#4a4a40] dark:text-[#a1a195]">
          © 2024 The Heritage Curator. Ethically Sourced, Artfully Curated.
        </p>
      </footer>
    </div>
  );
}
