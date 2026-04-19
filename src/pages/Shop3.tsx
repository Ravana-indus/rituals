import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Filter,
  ArrowRight,
  ShoppingBag,
  LayoutGrid,
  Droplets,
  Zap,
  Sparkles,
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';
import BrandedProductCard from '../components/BrandedProductCard';
import type { Brand, Category, Product, ProductImage } from '../types/database';

type ProductWithRelations = Product & { brand: Brand; category: Category; images: ProductImage[] };

const categoryIcons: Record<string, any> = {
  'skincare': Droplets,
  'hair-body': Sparkles,
  'fragrance': Zap,
  'makeup': Sparkles,
  'all': LayoutGrid,
};

export default function Shop3() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { api } = await import('../lib/api');
        const [productData, categoryData, brandData] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll(),
          api.brands.getAll(),
        ]);
        setProducts((productData as ProductWithRelations[]).filter(p => p.is_active));
        setCategories(categoryData.filter(c => c.is_active));
        setBrands(brandData.filter(b => b.is_active));
      } catch (error) {
        console.error('Failed to load shop3 data', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const categoryMatch = selectedCategory === 'all' || p.category?.slug === selectedCategory;
      const brandMatch = selectedBrand === 'all' || p.brand?.id === selectedBrand;
      return categoryMatch && brandMatch;
    });
  }, [products, selectedCategory, selectedBrand]);

  return (
    <BrandedLayout>
      <div className="px-[var(--dd-space-4)] py-[var(--dd-space-5)] md:px-[var(--dd-space-6)]">
        {/* Categories Scroller with Icons */}
        <section className="mb-[var(--dd-space-5)] overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-[var(--dd-space-3)]">
            <CategoryPill 
              label="All" 
              icon={categoryIcons.all}
              isActive={selectedCategory === 'all'} 
              onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); }} 
            />
            {categories.map(cat => (
              <CategoryPill 
                key={cat.id} 
                label={cat.name} 
                icon={categoryIcons[cat.slug] || categoryIcons.all}
                isActive={selectedCategory === cat.slug} 
                onClick={() => { setSelectedCategory(cat.slug); setSelectedBrand('all'); }} 
              />
            ))}
          </div>
        </section>

        {/* Secondary Brand Toggle (Chips) */}
        <section className="mb-[var(--dd-space-6)] overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-[var(--dd-space-2)]">
            <span className="text-[12px] font-bold uppercase tracking-widest opacity-40 mr-2 whitespace-nowrap">Brands:</span>
            <BrandChip 
              label="All Brands" 
              isActive={selectedBrand === 'all'} 
              onClick={() => setSelectedBrand('all')} 
            />
            {brands.map(brand => (
              <BrandChip 
                key={brand.id} 
                label={brand.name} 
                isActive={selectedBrand === brand.id} 
                onClick={() => setSelectedBrand(brand.id)} 
              />
            ))}
          </div>
        </section>

        {/* Hero / Promo */}
        <section className="mb-[var(--dd-space-7)] grid gap-[var(--dd-space-4)] md:grid-cols-2">
          <div className="relative h-[220px] overflow-hidden rounded-[var(--dd-radius-xs)] bg-[var(--dd-surface-base)] p-8 text-white shadow-[var(--dd-shadow-4)]">
            <h2 className="text-[32px] font-bold leading-tight">Ritual Refresh</h2>
            <p className="mt-2 text-[16px] opacity-80">Curated sets for your morning routine.</p>
            <button className="mt-6 flex items-center gap-2 rounded-[var(--dd-radius-sm)] bg-white px-6 py-2 text-[14px] font-bold text-black transition hover:bg-[var(--dd-surface-strong)]">
              Explore Now
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="relative h-[220px] overflow-hidden rounded-[var(--dd-radius-xs)] bg-white border border-[var(--dd-surface-strong)] p-8 shadow-[var(--dd-shadow-3)]">
            <h2 className="text-[32px] font-bold leading-tight">Express Delivery</h2>
            <p className="mt-2 text-[16px] text-[var(--dd-text-tertiary)]">Items arriving in 24h or less.</p>
            <Link to="/track-order" className="mt-6 inline-flex items-center gap-2 text-[var(--dd-text-secondary)] hover:underline">
              Track your ritual
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Product Section */}
        <section>
          <div className="mb-[var(--dd-space-5)] flex items-center justify-between">
            <h2 className="text-[24px] font-bold tracking-tight">
              {selectedCategory === 'all' ? 'All Rituals' : `${categories.find(c => c.slug === selectedCategory)?.name}`}
              {selectedBrand !== 'all' && ` from ${brands.find(b => b.id === selectedBrand)?.name}`}
            </h2>
            <div className="flex gap-2">
               {(selectedCategory !== 'all' || selectedBrand !== 'all') && (
                 <button 
                   onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); }}
                   className="text-[13px] font-bold text-[var(--dd-text-secondary)] hover:underline px-2"
                 >
                   Clear All
                 </button>
               )}
               <button className="flex items-center gap-2 rounded-[var(--dd-radius-sm)] border border-[var(--dd-surface-strong)] px-4 py-2 text-[14px] font-bold shadow-[var(--dd-shadow-1)] hover:bg-white transition">
                <Filter className="h-4 w-4" />
                Sort
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-[var(--dd-space-5)] grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[4/5] rounded-[var(--dd-radius-xs)] bg-white border border-[var(--dd-surface-strong)]" />
                  <div className="h-4 w-2/3 rounded bg-white border border-[var(--dd-surface-strong)]" />
                  <div className="h-4 w-1/3 rounded bg-white border border-[var(--dd-surface-strong)]" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-[var(--dd-space-8)] text-center bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)]">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-10" />
              <p className="text-[20px] font-bold">No rituals found.</p>
              <p className="mt-2 text-[14px] opacity-60">Try adjusting your filters to find what you need.</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); }}
                className="mt-6 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] px-6 py-2 text-[14px] font-bold text-white shadow-[var(--dd-shadow-4)] transition hover:opacity-90"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-[var(--dd-space-5)] grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {filteredProducts.map(product => (
                <BrandedProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </BrandedLayout>
  );
}

function CategoryPill({ label, icon: Icon, isActive, onClick }: { label: string; icon: any; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-[var(--dd-radius-md)] px-6 text-[14px] font-bold transition shadow-[var(--dd-shadow-1)]
        ${isActive 
          ? 'bg-[var(--dd-surface-base)] text-white shadow-[var(--dd-shadow-4)]' 
          : 'bg-white text-[var(--dd-text-tertiary)] hover:bg-[var(--dd-surface-strong)]'
        }
      `}
    >
      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'opacity-40'}`} />
      {label}
    </button>
  );
}

function BrandChip({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex min-h-[32px] items-center whitespace-nowrap rounded-[var(--dd-radius-sm)] px-3 text-[12px] font-bold transition border
        ${isActive 
          ? 'bg-[var(--dd-surface-base)] border-[var(--dd-surface-base)] text-white' 
          : 'bg-transparent border-[var(--dd-surface-strong)] text-[var(--dd-text-tertiary)] opacity-60 hover:opacity-100 hover:border-black'
        }
      `}
    >
      {label}
    </button>
  );
}

