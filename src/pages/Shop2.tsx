import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Brand, Category, Product, ProductImage } from '../types/database';
import { formatPriceCents } from '../types/database';

type ProductWithRelations = Product & { brand: Brand; category: Category; images: ProductImage[] };

const shop2Styles = {
  '--shop2-bg': '#000000',
  '--shop2-surface': '#02090A',
  '--shop2-section': '#061A1C',
  '--shop2-elevated': '#102620',
  '--shop2-border': '#1E2C31',
  '--shop2-white': '#FFFFFF',
  '--shop2-muted': '#A1A1AA',
  '--shop2-muted-2': '#71717A',
  '--shop2-muted-3': '#3F3F46',
  '--shop2-green': '#36F4A4',
  '--shop2-aloe': '#C1FBD4',
  '--shop2-pistachio': '#D4F9E0',
  '--shop2-shadow': 'rgba(0,0,0,0.1) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 2px 2px, rgba(0,0,0,0.1) 0px 4px 4px, rgba(0,0,0,0.1) 0px 8px 8px, rgba(255,255,255,0.03) 0px 1px 0px inset',
} as React.CSSProperties;

const fallbackCategories = [
  { id: 'skincare', slug: 'skincare', name: 'Skincare', is_active: true },
  { id: 'makeup', slug: 'makeup', name: 'Makeup', is_active: true },
  { id: 'fragrance', slug: 'fragrance', name: 'Fragrance', is_active: true },
  { id: 'hair-body', slug: 'hair-body', name: 'Hair & Body', is_active: true },
] as Pick<Category, 'id' | 'slug' | 'name' | 'is_active'>[];

const filterPillars = [
  'Filter by category',
  'Delivery-aware collections',
  'Neon Green focus states',
];

const heroStats = [
  { value: '15+', label: 'Years of beauty sourcing' },
  { value: '150M+', label: 'Commerce interactions echoed in the aesthetic' },
  { value: '24h', label: 'Express dispatch for Colombo-ready items' },
];

const trustBullets = [
  'Dark-first storefront built for mobile and desktop',
  'Touch-safe pill actions with visible focus treatment',
  'Editorial product cards with restrained green accents',
];

const categoryIcons: Record<string, LucideIcon> = {
  skincare: Sparkles,
  makeup: Star,
  fragrance: Zap,
  'hair-body': ShieldCheck,
};

export default function Shop2() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadPageData() {
      setLoading(true);
      try {
        const { api } = await import('../lib/api');
        const [productData, categoryData, brandData] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll(),
          api.brands.getAll(),
        ]);

        if (ignore) return;

        setProducts((productData as ProductWithRelations[]).filter((item) => item.is_active));
        setCategories(categoryData.filter((item) => item.is_active));
        setBrands(brandData.filter((item) => item.is_active));
      } catch (error) {
        console.error('Failed to load /shop2 data', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPageData();
    return () => {
      ignore = true;
    };
  }, []);

  const visibleCategories = categories.length > 0 ? categories : fallbackCategories;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory === 'all' || product.category?.slug === selectedCategory;
      const brandMatch = selectedBrand === 'all' || product.brand?.id === selectedBrand;
      return categoryMatch && brandMatch;
    });
  }, [products, selectedCategory, selectedBrand]);

  const featuredProducts = filteredProducts.slice(0, 8);

  return (
    <div
      style={{
        ...shop2Styles,
        backgroundColor: 'var(--shop2-bg)',
        color: 'var(--shop2-white)',
        fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontFeatureSettings: '"ss03" 1',
      }}
      className="min-h-screen"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(16,38,32,0.9),transparent_58%)]" />
      <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 bg-[radial-gradient(circle,rgba(54,244,164,0.12),transparent_66%)] blur-3xl" />

      <header className="sticky top-0 z-30 border-b border-[var(--shop2-border)] bg-[rgba(16,38,32,0.78)] backdrop-blur-xl">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-16">
          <div className="flex items-center gap-8">
            <Link to="/shop2" className="text-lg font-medium tracking-[0.2em] text-white uppercase">
              Shop2
            </Link>
            <nav className="hidden items-center gap-7 lg:flex">
              <a href="#catalog" className="text-[18px] font-medium tracking-[0.04em] text-white transition hover:text-[var(--shop2-muted)]">Catalog</a>
              <a href="#signals" className="text-[18px] font-medium tracking-[0.04em] text-white transition hover:text-[var(--shop2-muted)]">Signals</a>
              <Link to="/consult" className="text-[18px] font-medium tracking-[0.04em] text-white transition hover:text-[var(--shop2-muted)]">Consult</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/search"
              className="hidden min-h-[48px] items-center gap-2 rounded-full border-2 border-white px-4 text-[16px] text-white transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)] md:inline-flex"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
            <Link
              to="/register"
              className="inline-flex min-h-[48px] items-center rounded-full bg-white px-5 text-[16px] text-black transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)]"
            >
              Start for free
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-[var(--shop2-border)] text-white transition hover:border-[var(--shop2-green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="w-full px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20 lg:px-16">
          <div className="max-w-4xl">
            <div className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-[15px] text-white/90 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[var(--shop2-green)]" />
              Shopify-inspired shop system
            </div>

            <h1
              className="mt-8 text-[48px] leading-[0.96] tracking-[-0.03em] text-white md:text-[70px] lg:text-[96px]"
              style={{ fontFamily: '"Helvetica Neue", "Inter", Arial, sans-serif', fontWeight: 330 as React.CSSProperties['fontWeight'] }}
            >
              Shop the future of beauty in a dark-first storefront.
            </h1>

            <p className="mt-8 max-w-2xl text-[18px] leading-[1.56] text-[var(--shop2-muted)] md:text-[20px]">
              A cinematic catalog page built from the Shopify-inspired system: true-black depth, feather-light display type,
              pill CTAs, and a product grid that feels like a product keynote instead of a generic store.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#catalog"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-5 text-[16px] text-black transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)]"
              >
                Shop collection
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/consult"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-white px-5 text-[16px] text-white transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)]"
              >
                Talk to an expert
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--shop2-border)] bg-[var(--shop2-surface)] p-6"
                style={{ boxShadow: 'var(--shop2-shadow)' }}
              >
                <p className="text-[56px] leading-none text-white md:text-[72px]" style={{ fontWeight: 330 as React.CSSProperties['fontWeight'] }}>
                  {stat.value}
                </p>
                <p className="mt-3 max-w-[18rem] text-[16px] leading-[1.5] text-[var(--shop2-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="signals" className="border-y border-[var(--shop2-border)] bg-[var(--shop2-section)]">
          <div className="grid w-full gap-4 px-4 py-10 md:grid-cols-3 md:px-8 lg:px-16">
            {trustBullets.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-white/6 bg-black/20 p-5">
                <span className="mt-1 rounded-full border border-[var(--shop2-green)]/40 bg-[var(--shop2-green)]/10 p-1 text-[var(--shop2-green)]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-[16px] leading-[1.5] text-[var(--shop2-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="catalog" className="w-full px-4 py-14 md:px-8 lg:px-16 lg:py-20">
          <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside
              className="rounded-[20px] border border-[var(--shop2-border)] bg-[var(--shop2-surface)] p-5"
              style={{ boxShadow: 'var(--shop2-shadow)' }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.06em] text-[var(--shop2-muted-2)]">Controls</p>
                  <h2 className="mt-2 text-[28px] leading-[1.2] text-white" style={{ fontWeight: 360 as React.CSSProperties['fontWeight'] }}>
                    Filter by category
                  </h2>
                </div>
                <ChevronDown className="h-5 w-5 text-[var(--shop2-muted)]" />
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={filterButtonClass(selectedCategory === 'all')}
                >
                  All categories
                </button>
                {visibleCategories.map((category) => {
                  const Icon = categoryIcons[category.slug] ?? Sparkles;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.slug)}
                      className={filterButtonClass(selectedCategory === category.slug)}
                    >
                      <span className="inline-flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8">
                <p className="text-[12px] uppercase tracking-[0.06em] text-[var(--shop2-muted-2)]">Brands</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBrand('all')}
                    className={chipClass(selectedBrand === 'all')}
                  >
                    All
                  </button>
                  {brands.slice(0, 8).map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => setSelectedBrand(brand.id)}
                      className={chipClass(selectedBrand === brand.id)}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-white/6 bg-[var(--shop2-elevated)] p-4">
                <p className="text-[14px] font-medium text-white">System cues</p>
                <div className="mt-3 space-y-2">
                  {filterPillars.map((item) => (
                    <p key={item} className="text-[14px] leading-[1.49] text-[var(--shop2-muted)]">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </aside>

            <div className="space-y-8">
              <div
                className="overflow-hidden rounded-[20px] border border-[var(--shop2-border)] bg-[linear-gradient(135deg,#061A1C,#02090A)] p-6 md:p-8"
                style={{ boxShadow: 'var(--shop2-shadow)' }}
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_320px]">
                  <div>
                    <p className="text-[15px] uppercase tracking-[0.1em] text-[var(--shop2-muted)]">Curated Drop</p>
                    <h2 className="mt-3 text-[32px] leading-[1.08] text-white md:text-[48px]" style={{ fontWeight: 330 as React.CSSProperties['fontWeight'] }}>
                      Dark surfaces, quiet copy, and product cards that read like tech hardware reveals.
                    </h2>
                    <p className="mt-4 max-w-2xl text-[18px] leading-[1.56] text-[var(--shop2-muted)]">
                      This shop page uses theatrical spacing and a restrained green accent so product discovery feels premium instead of promotional.
                    </p>
                  </div>

                  <div className="grid gap-3 rounded-xl border border-white/6 bg-black/30 p-4">
                    <Metric label="Visible items" value={String(filteredProducts.length)} />
                    <Metric label="Active category" value={selectedCategory === 'all' ? 'All' : selectedCategory} />
                    <Metric label="Brand filter" value={selectedBrand === 'all' ? 'All' : (brands.find((brand) => brand.id === selectedBrand)?.name ?? 'All')} />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`shop2-skeleton-${index}`}
                      className="rounded-xl border border-[var(--shop2-border)] bg-[var(--shop2-surface)] p-5"
                      style={{ boxShadow: 'var(--shop2-shadow)' }}
                    >
                      <div className="aspect-[4/5] animate-pulse rounded-lg bg-[var(--shop2-muted-3)]/50" />
                      <div className="mt-5 h-3 w-20 animate-pulse rounded-full bg-[var(--shop2-muted-3)]/50" />
                      <div className="mt-3 h-7 w-2/3 animate-pulse rounded-full bg-[var(--shop2-muted-3)]/50" />
                      <div className="mt-6 h-12 w-full animate-pulse rounded-full bg-[var(--shop2-muted-3)]/50" />
                    </div>
                  ))}
                </div>
              ) : featuredProducts.length === 0 ? (
                <div className="rounded-xl border border-[var(--shop2-border)] bg-[var(--shop2-surface)] px-6 py-16 text-center" style={{ boxShadow: 'var(--shop2-shadow)' }}>
                  <p className="text-[32px] text-white" style={{ fontWeight: 330 as React.CSSProperties['fontWeight'] }}>No products match this signal set.</p>
                  <p className="mt-4 text-[18px] leading-[1.56] text-[var(--shop2-muted)]">Reset the filters to bring the full collection back into view.</p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                  {featuredProducts.map((product) =>
                    React.createElement(Shop2ProductCard, { key: product.id, product })
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Shop2ProductCard({ product }: { product: ProductWithRelations }) {
  const image = product.images?.[0];
  const onSale = Boolean(product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents);

  return (
    <article
      className="group overflow-hidden rounded-xl border border-[var(--shop2-border)] bg-[var(--shop2-surface)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--shop2-green)]/40 motion-reduce:transform-none motion-reduce:transition-none"
      style={{ boxShadow: 'var(--shop2-shadow)' }}
    >
      <div className="relative overflow-hidden rounded-lg border border-white/6 bg-[var(--shop2-section)]">
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt_text || product.name}
            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        ) : (
          <div className="flex aspect-[4/5] items-end bg-[radial-gradient(circle_at_top,rgba(16,38,32,0.9),rgba(2,9,10,1))] p-5">
            <p className="max-w-[11rem] text-[28px] leading-[1.12] text-white" style={{ fontWeight: 330 as React.CSSProperties['fontWeight'] }}>
              {product.name}
            </p>
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          {product.is_featured && (
            <span className="rounded-md bg-white/12 px-3 py-2 text-[14px] text-white backdrop-blur-sm">
              Featured
            </span>
          )}
          {onSale && (
            <span className="rounded-md bg-[var(--shop2-green)]/12 px-3 py-2 text-[14px] text-[var(--shop2-green)] backdrop-blur-sm">
              Sale
            </span>
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[12px] uppercase tracking-[0.06em] text-[var(--shop2-muted-2)]">{product.brand?.name ?? 'Brand'}</p>
        <Link to={`/product?slug=${product.slug}`} className="mt-2 block">
          <h3 className="text-[32px] leading-[1.14] text-white transition group-hover:text-[var(--shop2-aloe)]" style={{ fontWeight: 360 as React.CSSProperties['fontWeight'] }}>
            {product.name}
          </h3>
        </Link>
        {product.tagline && (
          <p className="mt-3 text-[16px] leading-[1.5] text-[var(--shop2-muted)]">{product.tagline}</p>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-[20px] text-white">{formatPriceCents(product.price_cents)}</span>
        {onSale && product.compare_at_price_cents && (
          <span className="text-[16px] text-[var(--shop2-muted)] line-through">{formatPriceCents(product.compare_at_price_cents)}</span>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to={`/product?slug=${product.slug}`}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-white px-4 text-[16px] text-black transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)]"
        >
          View item
        </Link>
        <Link
          to="/cart"
          className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-2 border-white text-white transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)]"
          aria-label={`Open cart for ${product.name}`}
        >
          <ShoppingBag className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/6 bg-white/[0.03] p-4">
      <p className="text-[12px] uppercase tracking-[0.06em] text-[var(--shop2-muted-2)]">{label}</p>
      <p className="mt-2 text-[24px] text-white" style={{ fontWeight: 360 as React.CSSProperties['fontWeight'] }}>{value}</p>
    </div>
  );
}

function filterButtonClass(isActive: boolean) {
  return `flex min-h-[48px] w-full items-center justify-between rounded-full border px-4 text-left text-[16px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)] ${
    isActive
      ? 'border-[var(--shop2-green)] bg-[rgba(54,244,164,0.08)] text-white'
      : 'border-[var(--shop2-border)] bg-transparent text-[var(--shop2-muted)] hover:border-white/30 hover:text-white'
  }`;
}

function chipClass(isActive: boolean) {
  return `inline-flex min-h-[44px] items-center rounded-full border px-4 text-[14px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop2-green)] ${
    isActive
      ? 'border-white bg-white text-black'
      : 'border-[var(--shop2-border)] text-[var(--shop2-muted)] hover:border-white/30 hover:text-white'
  }`;
}
