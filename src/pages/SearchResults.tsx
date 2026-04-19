import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  ChevronRight, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  ArrowRight,
  SearchX
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';
import BrandedProductCard from '../components/BrandedProductCard';
import { api } from '../lib/api';
import type { Category, Product, Brand, ProductImage } from '../types/database';

type ProductWithRelations = Product & { brand: Brand; category: Category; images: ProductImage[] };

function SkeletonCard() {
  return (
    <div className="bg-white p-3 rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] animate-pulse">
      <div className="aspect-[4/5] bg-[var(--dd-surface-muted)] rounded-[var(--dd-radius-xs)] mb-4" />
      <div className="h-3 bg-[var(--dd-surface-muted)] rounded w-1/4 mb-3" />
      <div className="h-5 bg-[var(--dd-surface-muted)] rounded w-3/4 mb-2" />
      <div className="h-4 bg-[var(--dd-surface-muted)] rounded w-1/2" />
    </div>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll(),
        ]);
        setProducts(prods as ProductWithRelations[]);
        setCategories(cats);
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
    if (activeFilter !== "All") {
      result = result.filter(p => p.category?.name === activeFilter);
    }
    return result;
  }, [query, activeFilter, products]);

  const displayedResults = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(12);
  }, [query, activeFilter]);

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

  const categoryNames = useMemo(() => {
    const catNames = categories.filter(c => c.is_active).map(c => c.name);
    return ["All", ...catNames];
  }, [categories]);

  return (
    <BrandedLayout>
      <div className="px-[var(--dd-space-4)] py-[var(--dd-space-5)] md:px-[var(--dd-space-6)]">
        <header className="mb-12">
          <nav className="mb-6 flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest opacity-40">
            <Link to="/" className="hover:opacity-100 transition">Apothecary</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="opacity-100">Search Results</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl flex-1">
              <h1 className="text-[32px] font-bold tracking-tight text-black md:text-[48px]">
                {query ? `Results for "${query}"` : 'Explore Collection'}
              </h1>
              <p className="mt-2 text-[16px] font-medium opacity-60">
                {loading ? 'Searching sanctuary...' : `${filtered.length} artfully curated discoveries found`}
              </p>
            </div>
            
            <div className="flex items-center gap-3 rounded-full bg-[#76885B]/10 px-4 py-2 text-[13px] font-bold text-[#76885B]">
               <Sparkles className="h-4 w-4" />
               National Clearance Event Live
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
             <span className="text-[11px] font-black uppercase tracking-widest opacity-30 mr-2">Refine Ritual:</span>
             {categoryNames.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveFilter(cat)}
                 className={`rounded-full px-6 py-2 text-[13px] font-bold transition ${
                   activeFilter === cat 
                     ? 'bg-[var(--dd-surface-base)] text-white shadow-lg' 
                     : 'bg-white border border-[var(--dd-surface-strong)] text-black hover:bg-[var(--dd-surface-strong)]'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </header>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
           <TrustBanner icon={ShieldCheck} title="Authenticity Guaranteed" desc="Directly sourced from heritage artisans and ethical labs." />
           <TrustBanner icon={Truck} title="24h Island-wide Delivery" desc="Carefully packaged and dispatched within one day." />
        </section>

        {loading ? (
          <div className="grid gap-[var(--dd-space-5)] grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid gap-[var(--dd-space-5)] grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {displayedResults.map(product => (
                <BrandedProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMore && <div ref={loadMoreRef} className="h-20" />}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] text-center">
            <SearchX className="h-16 w-16 opacity-10 mb-6" />
            <h2 className="text-[24px] font-bold">No discoveries found</h2>
            <p className="mt-2 opacity-60 max-w-sm px-4">Try searching for a specific brand, ritual category, or product name.</p>
            <Link 
              to="/" 
              className="mt-8 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] px-8 py-3 font-bold text-white shadow-lg transition hover:opacity-90"
            >
              Browse All Rituals
            </Link>
          </div>
        )}

        {/* The Heritage Promise */}
        <section className="mt-24 rounded-[var(--dd-radius-xs)] bg-[var(--dd-surface-base)] p-12 md:p-20 text-white text-center relative overflow-hidden">
           <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-[32px] font-bold tracking-tight md:text-[48px] italic mb-6">The Heritage Promise</h2>
              <p className="text-[18px] leading-relaxed opacity-60 mb-10">
                Every clearance item is rigorously inspected for potency and authenticity. We believe heritage beauty should be accessible, never compromised.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center">
                 <input 
                   type="email" 
                   placeholder="Join the Curator's Circle" 
                   className="rounded-[var(--dd-radius-sm)] bg-white/10 px-6 py-4 text-white placeholder:text-white/30 outline-none focus:bg-white/20 transition flex-1 max-w-md"
                 />
                 <button className="rounded-[var(--dd-radius-sm)] bg-white px-10 py-4 text-[14px] font-black uppercase tracking-widest text-black shadow-xl hover:bg-[#76885B] transition">
                   Subscribe
                 </button>
              </form>
           </div>
           <ShoppingBag className="absolute bottom-[-50px] left-[-50px] h-96 w-96 opacity-5 rotate-[-20deg]" />
        </section>
      </div>
    </BrandedLayout>
  );
}

function TrustBanner({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-5 rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] bg-white p-6 shadow-sm">
      <div className="rounded-full bg-[var(--dd-surface-strong)] p-3 text-black">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
        <p className="text-[13px] opacity-60 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

