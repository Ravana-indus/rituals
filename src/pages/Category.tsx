import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrand, setActiveBrand] = useState('All Brands');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [slug]);

  async function loadData() {
    setLoading(true);
    try {
      const [catData, productsData, brandsData] = await Promise.all([
        slug ? api.categories.getBySlug(slug) : null,
        api.products.getAll(),
        api.brands.getAll(),
      ]);
      setCategory(catData);
      setBrands(brandsData);

      const filtered = (productsData as ProductWithRelations[]).filter(p => {
        const categoryMatch = !slug || p.category?.slug === slug;
        const brandMatch = activeBrand === 'All Brands' || p.brand?.name === activeBrand;
        return categoryMatch && brandMatch && p.is_active;
      });
      setProducts(filtered as ProductWithRelations[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (slug) {
      api.products.getAll().then(data => {
        const filtered = (data as ProductWithRelations[]).filter(p => {
          const categoryMatch = p.category?.slug === slug;
          const brandMatch = activeBrand === 'All Brands' || p.brand?.name === activeBrand;
          return categoryMatch && brandMatch && p.is_active;
        });
        setProducts(filtered as ProductWithRelations[]);
      });
    }
  }, [activeBrand, slug]);

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="animate-pulse text-primary">Loading...</div></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pb-24 md:pb-8">
        <section className="bg-primary-container py-12 px-6 md:px-10 lg:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-medium">
              <Link to="/">Apothecary</Link>
              <Icon name="chevron_right" className="text-xs" />
              <span className="text-primary font-bold">{category?.name ?? slug ?? 'Category'}</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-noto-serif text-primary font-bold">{category?.name ?? slug ?? 'Category'}</h1>
            {category?.description && (
              <p className="text-on-surface-variant mt-3 max-w-xl">{category.description}</p>
            )}
          </div>
        </section>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 py-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8">
            <button
              onClick={() => setActiveBrand('All Brands')}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeBrand === 'All Brands'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant border border-transparent'
              }`}
            >
              All Brands
            </button>
            {brands.filter(b => b.is_active).map(brand => (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand.name)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeBrand === brand.name
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant border border-transparent'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-on-surface-variant">
              <span className="font-bold text-primary">{products.length}</span> product{products.length !== 1 ? 's' : ''}
            </p>
            {activeBrand !== 'All Brands' && (
              <button
                onClick={() => setActiveBrand('All Brands')}
                className="text-xs text-secondary hover:underline font-medium"
              >
                Clear filter
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              <Icon name="inventory_2" className="text-5xl mb-4 opacity-30" />
              <p className="font-noto-serif text-xl">No products found</p>
              <p className="text-sm mt-2">Try a different brand or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-12 lg:gap-y-16">
              {products.map((product) =>
                React.createElement(CategoryProductCard, { product, key: product.id })
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#f1eee5] dark:bg-[#0a0a08] w-full flex flex-col items-center justify-center text-center space-y-6 px-8 py-12 mt-auto">
        <span className="font-noto-serif italic text-xl text-primary dark:text-primary-fixed">The Heritage Curator</span>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-manrope text-xs tracking-widest uppercase">
          <Link to="/support" className="text-[#4a4a40] dark:text-[#a1a195] hover:text-secondary transition-colors">Shipping & Returns</Link>
          <Link to="/support" className="text-[#4a4a40] dark:text-[#a1a195] hover:text-secondary transition-colors">Privacy Policy</Link>
          <Link to="/support" className="text-[#4a4a40] dark:text-[#a1a195] hover:text-secondary transition-colors">Sustainability</Link>
        </div>
        <p className="font-manrope text-xs tracking-widest uppercase text-[#4a4a40] dark:text-[#a1a195] opacity-60">© 2024 The Heritage Curator.</p>
      </footer>
    </div>
  );
}

function CategoryProductCard({ product }: { product: ProductWithRelations }) {
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
      <div className="relative aspect-[4/5] bg-surface-container-low dark:bg-[#1e1e1a] overflow-hidden rounded-sm">
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
        <p className="font-manrope text-xs uppercase tracking-[0.2em] text-outline dark:text-outline-variant">{product.brand?.name ?? '—'}</p>
        <Link to={`/product?slug=${product.slug}`}>
          <h3 className="font-noto-serif text-lg font-bold leading-tight text-on-surface dark:text-[#fcf9f0] hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        {product.tagline && <p className="text-on-surface-variant dark:text-[#c1c8c7] text-sm line-clamp-2 leading-relaxed">{product.tagline}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-secondary dark:text-secondary-fixed-dim font-manrope">{formatPriceCents(product.price_cents)}</span>
        {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents && (
          <span className="text-sm text-on-surface-variant line-through">{formatPriceCents(product.compare_at_price_cents)}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-surface-container-highest dark:bg-[#3a3a34] rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary dark:bg-secondary-fixed-dim rounded-full"
            style={{ width: `${Math.min(100, ((product.stock_qty ?? 0) / 20) * 100)}%` }}
          />
        </div>
        {(product.stock_qty ?? 0) <= (product.low_stock_threshold ?? 5) && (
          <span className="text-xs text-secondary dark:text-secondary-fixed-dim font-black whitespace-nowrap">
            Only {product.stock_qty ?? 0} left
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2.5 bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Icon name="add_shopping_cart" className="text-sm" />
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-2.5 bg-secondary dark:bg-secondary text-on-secondary dark:text-on-secondary font-bold text-xs rounded-lg hover:opacity-90 transition-opacity"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
