import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Sparkles,
  Droplets,
  Zap,
  ChevronRight,
  Heart,
  Plus,
  Check,
  ShoppingBag,
  Info,
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';

type Category = 'hair' | 'skin' | 'fragrance';

type Product = {
  id: string; name: string; tagline: string; description: string;
  curatorPrice: number; marketPrice: number; badge: string | null; badgeType: string | null;
  stockPercent: number; stockLeft: number | null; expiry: string; whyDiscounted: string;
  image: string; thumb: string;
};

const PRODUCTS_HAIR: Product[] = [
  {
    id: 'h0', name: 'Neem Infused Scalp Elixir', tagline: '100ml / Routine Foundation',
    description: 'Sesame & Gotu Kola infusion for scalp revitalization.',
    curatorPrice: 420000, marketPrice: 680000, badge: 'Heritage Find', badgeType: 'tertiary' as const,
    stockPercent: 30, stockLeft: 6, expiry: 'Dec 2026', whyDiscounted: 'Heritage batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7os9A8-iepf_8gSU8WlQLLNEuG-Ga8MCLVqbWjrQbDk6DRvx6SJ-mWXjc-ZBVy377A5gzCOZhTiIqxzaQz3TOZJxKUuS3gxCjFK6HT7Qq3ZqtoNaRZSK1PF9qCse-MvSk2_dvK41wGa1rL7P6HCnks0sctq2iQzW0shJKdlPONBvQLVG4ryD8TZXWFvPYP5LHrnZD1HaM5-dVpGB-3CIT5wCmxNY8El4l5zOoIC1tAc_sCTkmkvLm-qoCuPytm3iZ2GCedpfx_a07',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJzZMaUqwGljt0KrPoG4t5vuSvV88AswSGGwDw4ZMQ_c4N3Exoy_-rSaa1F6GsyEJWgYJ0qEiuNViObd-IVIIVvN8l8OPMBDvDb7zwaEQpMLBA_u25OxekZGw8liJbhm-JtI4hSN0QMK4qtXkBFlrUuOSM95SuOUnVZ0XUIRvjEClorIgtTceBugj4z4E4f5EogTQIW_0vbJ_Ow6XpbZjNpvGaFM4eHkgQ7rNtHwj06lgwvMcVv1t-IEr_z0HeDHb6Q6MTMdrX8cHP',
  },
  {
    id: 'h1', name: 'Hibiscus Revival Mask', tagline: '250ml / Gentle Purification',
    description: 'Deep conditioning with crushed hibiscus petals and organic coconut milk.',
    curatorPrice: 350000, marketPrice: 550000, badge: 'Thrifty Luxury', badgeType: 'secondary' as const,
    stockPercent: 55, stockLeft: null, expiry: 'Nov 2026', whyDiscounted: 'Limited batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBshr53s9hkB5kZ2x_23VFoRHRRSjM71kvonYYJXPm85oG5vmEMR91bwxoluGMHY48XZGk6weRH1-Qu-ErJ3hOcEMCinZ-bZUnHKeDxp2Pv5aXaUpaSTw_50V1_FdmoHR7CtbCeQRb4MoQ3ygu0-LkN_MQcnI_BSKwZdK20vu03YL8cJudqoet6UN-4QRQ_YBWRhYOwJ9r0KNV3F-7Xjhj4jk5kW3vo-XNfP-P_ppKZOne7JN2M0s8MiyaX9728rDeaBUfu1QHMQnPy',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBivcIM1H190qfwJrw5SfaIUZX4YkeyBwUm3Zp0D-53l9B5g999KveYiZ6Yia2_NzcyxSDCHxnZ3f9aRwsBT8XLxb2zf76JhCRVgi6Wj465YBD6muwcuQGqpxEnvLGcTjmPYtQCUqDxjw8xIdHwQD8XAs4U86dFyafRB5vBgS9Sjf9TglSofnHkE29bCr2u6RNC4dFiYsA5jvDQU7YxgeFTPbdbTZLfr6aG-aPBDMpfHDk1XPGZrigXN2JZVHhds6IVYkzG3iHGojqT',
  },
  {
    id: 'h2', name: 'Sandalwood Sculpting Comb', tagline: 'Handcrafted / Anti-static',
    description: 'Hand-carved from aromatic Mysore sandalwood to prevent static and gently massage the scalp.',
    curatorPrice: 280000, marketPrice: 400000, badge: 'Best for Dry Hair', badgeType: 'editorial' as const,
    stockPercent: 80, stockLeft: null, expiry: 'Jan 2027', whyDiscounted: 'Handcrafted',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDy_8CY8Rn3I-QrcdvYp8OA3dNawcmJhsTmGzK37ct_dGNW5FLMcbcJL-r5SqxTJrPzvX5eqwYCk3KERxCETacfZvkN40ekgFc9EcPGtbz2UC1210n33dqveN_EJjLB9tikxQ4ZM6f0YSxT6-_tS9xOvbYmuSkMEK1RSiLYoM_7429feW6HDcNGgV1R0CPNUC9gwo_rMtykLXPXwkVVgzY5zLAf73gNpsxgVVwahaXKt6n5GJR7c6bXwpabs_5Y2vPTTbAHR8CueEu',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDy_8CY8Rn3I-QrcdvYp8OA3dNawcmJhsTmGzK37ct_dGNW5FLMcbcJL-r5SqxTJrPzvX5eqwYCk3KERxCETacfZvkN40ekgFc9EcPGtbz2UC1210n33dqveN_EJjLB9tikxQ4ZM6f0YSxT6-_tS9xOvbYmuSkMEK1RSiLYoM_7429feW6HDcNGgV1R0CPNUC9gwo_rMtykLXPXwkVVgzY5zLAf73gNpsxgVVwahaXKt6n5GJR7c6bXwpabs_5Y2vPTTbAHR8CueEu',
  },
];

const PRODUCTS_SKIN = [
  {
    id: 's0', name: 'Saffron Brightening Elixir', tagline: '30ml / Radiance Serum',
    description: 'Cold-pressed Kashmiri saffron strands in a lightweight emulsion for luminous, even-toned skin.',
    curatorPrice: 560000, marketPrice: 890000, badge: 'Heritage Find', badgeType: 'tertiary' as const,
    stockPercent: 25, stockLeft: 4, expiry: 'Mar 2027', whyDiscounted: 'Heritage batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvo_nOCMI0_jQeSaO86dMIyvdCl1sWJqc6_2THuR4PsVRm0mBYUXYL1V-6Twoxd3kclGYIV2ELnmkM7mAQ_lLKFrN1VWhJXRuEvsVVXIdN3ru__9oNdkqhUfH1UtKu6oYp6adsJqRjK8Z4S1NuMJjGkmKUNwXsVKPfMok1YH56i5MQaf4cbfoipQ1AH5FDtp7QLyKzXPcalIOyKmbQe5kHoOaCsFsCWTALSSO2CABrUhD7ZoDwiw81BnBf7um9xvVoZD1zH_UwzwhX',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvo_nOCMI0_jQeSaO86dMIyvdCl1sWJqc6_2THuR4PsVRm0mBYUXYL1V-6Twoxd3kclGYIV2ELnmkM7mAQ_lLKFrN1VWhJXRuEvsVVXIdN3ru__9oNdkqhUfH1UtKu6oYp6adsJqRjK8Z4S1NuMJjGkmKUNwXsVKPfMok1YH56i5MQaf4cbfoipQ1AH5FDtp7QLyKzXPcalIOyKmbQe5kHoOaCsFsCWTALSSO2CABrUhD7ZoDwiw81BnBf7um9xvVoZD1zH_UwzwhX',
  },
  {
    id: 's1', name: 'Turmeric Glow Mask', tagline: '100g / Brightening Treatment',
    description: 'Wild turmeric and chickpea flour mask with neem extract for radiant, clarified skin.',
    curatorPrice: 320000, marketPrice: 510000, badge: 'Thrifty Luxury', badgeType: 'secondary' as const,
    stockPercent: 60, stockLeft: null, expiry: 'Feb 2027', whyDiscounted: 'Seasonal batch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUZDmo-OxlQVMZzhQBdhd5wkARMqZ04tAelIVgjUy_qJCjo34bD3Tq9TJ1xeoezbs-6pNepj9CKP5wVc4aXeKKesQpTTABppF0yBBLKJL2pYKM6xNu_nnEba4gvwFu-8pYHUOz4WlfacajQavD7WwDMys2MfnKHjp4uL4xpjlc7h0kk-zns9fDGkfkcRinSkZRZxNr1rCw33mUmp6sGnVNRL8qR-MixLzoxTi_hsWgAvu9XKgLzuT_gLxbjnVPLYtaH7OVLoOoolvx',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUZDmo-OxlQVMZzhQBdhd5wkARMqZ04tAelIVgjUy_qJCjo34bD3Tq9TJ1xeoezbs-6pNepj9CKP5wVc4aXeKKesQpTTABppF0yBBLKJL2pYKM6xNu_nnEba4gvwFu-8pYHUOz4WlfacajQavD7WwDMys2MfnKHjp4uL4xpjlc7h0kk-zns9fDGkfkcRinSkZRZxNr1rCw33mUmp6sGnVNRL8qR-MixLzoxTi_hsWgAvu9XKgLzuT_gLxbjnVPLYtaH7OVLoOoolvx',
  },
];

const PRODUCTS_FRAGRANCE = [
  {
    id: 'f0', name: 'Oud Midnight Attar', tagline: '12ml / Signature Essence',
    description: 'Slow-distilled Assamese oud in a sandalwood base — dark, meditative, unmistakable.',
    curatorPrice: 720000, marketPrice: 1150000, badge: 'Heritage Find', badgeType: 'tertiary' as const,
    stockPercent: 15, stockLeft: 3, expiry: 'Dec 2028', whyDiscounted: 'Heritage distillation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfoPsKn3V870fbV4xd2Rezgc1XvKt7MGf2UCH6O69SMl8Df4UzdLgWnVyhnib-DjJz8KnKEYDJW7QZkC9BkdkWV9cdWxkHkKhUtI5bHAf1UAtEG5Sejroxkjcr6xl-udsI0Q_VG4ZFxsUgc_LID43gjj-beEhgHTWKntu4Axjlae7Gs1AaxITpiebc-FR8bar85Niqrd4_erHfFMb401FW8zpnyLMAyAMSoB7g5pPBY44utxHRBALvAVJPnT_z-9ne66vvdCvlk1P-',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfoPsKn3V870fbV4xd2Rezgc1XvKt7MGf2UCH6O69SMl8Df4UzdLgWnVyhnib-DjJz8KnKEYDJW7QZkC9BkdkWV9cdWxkHkKhUtI5bHAf1UAtEG5Sejroxkjcr6xl-udsI0Q_VG4ZFxsUgc_LID43gjj-beEhgHTWKntu4Axjlae7Gs1AaxITpiebc-FR8bar85Niqrd4_erHfFMb401FW8zpnyLMAyAMSoB7g5pPBY44utxHRBALvAVJPnT_z-9ne66vvdCvlk1P-',
  },
];

const CATEGORY_DATA: Record<Category, { title: string; subtitle: string; curatorNote: { quote: string; attribution: string }; products: Product[] }> = {
  hair: {
    title: 'Hair Care Routine',
    subtitle: 'Build your perfect hair care routine with top international brands at the best prices.',
    curatorNote: { quote: 'We believe everyone deserves access to high-quality personal care. Build your routine to unlock bundle discounts on your favorite brands.', attribution: 'Dr. Amara Silva' },
    products: PRODUCTS_HAIR,
  },
  skin: {
    title: 'Skin Care Routine',
    subtitle: 'Centuries-old botanical wisdom meets modern dermal science. Each formulation has been curated from heritage apothecaries.',
    curatorNote: { quote: 'Create a skincare routine tailored to your needs. Mix and match international brands like CeraVe and Cetaphil.', attribution: 'Priya Wickramasinghe' },
    products: PRODUCTS_SKIN,
  },
  fragrance: {
    title: 'Fragrance Routine',
    subtitle: 'Attars, mists, and signatures crafted from rare botanical essences. Personal ceremonies captured in glass.',
    curatorNote: { quote: 'A fragrance should arrive before you and linger after you leave.', attribution: 'Farid Hussain Khatri' },
    products: PRODUCTS_FRAGRANCE,
  },
};

const CURATOR_PORTRAIT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1B81cycUiLrWgg7sUTgqFNXZ1ZGYKXamCshoR2fcS5e8KHEb3zioj4AeY--p68CMaCISeDwORROYgxyMbCWge8CH_EePNQ6zBasEs282M9efCuWBg021Led_tsaxkAEzuIrzSTVuqcSI5MK-VR1WePtGirmu61nmjGzKT2AfskYhz0z2Aa7YCbnjmNEVarpO5qMfftxcynvOeqWo_lFiENaVvHSWmkkqaODtZ10zT-bjJVYasmKD6ixz_BQebbqHqZFHsSsay7xIP';

const formatLKR = (n: number) => `LKR ${(n / 100).toLocaleString('en-US')}`;

const NAV_ITEMS: { label: string; icon: any; category: Category }[] = [
  { label: 'Hair routine', icon: Sparkles, category: 'hair' },
  { label: 'Skin routine', icon: Droplets, category: 'skin' },
  { label: 'Fragrance', icon: Zap, category: 'fragrance' },
];

export default function RitualBuilder() {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const category: Category = (['hair', 'skin', 'fragrance'].includes(categoryParam || '') ? categoryParam : 'hair') as Category;

  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const allProducts = useMemo(() => [...PRODUCTS_HAIR, ...PRODUCTS_SKIN, ...PRODUCTS_FRAGRANCE], []);
  const selectedItems = allProducts.filter((p) => selectedProducts.has(p.id));
  const subtotal = selectedItems.reduce((s, p) => s + p.curatorPrice, 0);
  const discount = selectedItems.length >= 3 ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal - discount;
  const bundleMin = 3;
  const needsMore = Math.max(0, bundleMin - selectedProducts.size);

  const catData = CATEGORY_DATA[category];

  return (
    <BrandedLayout>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
        {/* Left Navigation Sidebar */}
        <aside className="w-full lg:w-72 bg-white border-r border-[var(--dd-surface-strong)] flex flex-col p-6 space-y-8">
          <div>
            <h2 className="text-[18px] font-bold tracking-tight">Build Your Routine</h2>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 mt-1">Curating personal care</p>
          </div>

          <nav className="flex-1 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.category}
                to={`/ritual-builder/${item.category}`}
                className={`flex items-center gap-3 py-3 px-4 rounded-[var(--dd-radius-sm)] transition-all font-bold text-[14px] ${
                  category === item.category
                    ? 'bg-[var(--dd-surface-base)] text-white shadow-md'
                    : 'text-black opacity-60 hover:bg-[var(--dd-surface-strong)] hover:opacity-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Progress Widget */}
          <div className="pt-6 border-t border-[var(--dd-surface-strong)]">
            <div className={`p-5 rounded-[var(--dd-radius-xs)] border transition-all ${
              needsMore === 0 ? 'bg-[var(--dd-surface-base)] text-white border-[var(--dd-surface-base)] shadow-lg' : 'bg-[var(--dd-surface-muted)] border-[var(--dd-surface-strong)]'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                 <Sparkles className={`h-4 w-4 ${needsMore === 0 ? 'text-[#76885B]' : 'opacity-40'}`} />
                 <span className="text-[11px] font-black uppercase tracking-wider">Bundle Progress</span>
              </div>
              <div className="h-1.5 bg-[var(--dd-surface-base)]/10 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full transition-all duration-700 ${needsMore === 0 ? 'bg-[#76885B]' : 'bg-[var(--dd-surface-base)]'}`}
                  style={{ width: `${Math.min((selectedProducts.size / bundleMin) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[13px] font-bold italic leading-tight">
                {needsMore > 0 ? `Add ${needsMore} more for 15% off` : '15% Discount Activated'}
              </p>
            </div>
            
            <button
              disabled={selectedProducts.size === 0}
              className="mt-4 w-full py-4 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] text-white text-[13px] font-bold uppercase tracking-widest shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-20"
            >
              Secure Checkout
            </button>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 bg-[var(--dd-surface-muted)] p-6 md:p-12 overflow-y-auto no-scrollbar">
          <header className="mb-12 max-w-3xl">
            <h1 className="text-[40px] font-bold leading-tight tracking-tight md:text-[56px]">{catData.title}</h1>
            <p className="mt-4 text-[18px] leading-relaxed opacity-60 font-medium">{catData.subtitle}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
            {catData.products.map((product) => (
              <div key={product.id} className="group flex flex-col rounded-[var(--dd-radius-xs)] bg-white p-3 shadow-sm transition hover:shadow-md">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--dd-radius-xs)] bg-[#f8f9fa] flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105 p-6" />
                  {product.badge && (
                    <div className="absolute left-3 top-3 rounded-full bg-[var(--dd-surface-base)] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                      {product.badge}
                    </div>
                  )}
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute right-3 top-3 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:scale-110 transition active:scale-90"
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-[#EB1700] text-[#EB1700]' : 'text-black opacity-40'}`} />
                  </button>
                </div>
                
                <div className="mt-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[18px] font-bold leading-tight">{product.name}</h3>
                      <p className="text-[12px] opacity-40 font-bold uppercase tracking-wider mt-1">{product.tagline}</p>
                    </div>
                    <span className="text-[16px] font-bold whitespace-nowrap">{formatLKR(product.curatorPrice)}</span>
                  </div>
                  
                  <p className="mt-3 text-[14px] leading-relaxed opacity-60 line-clamp-2 min-h-[3rem]">{product.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--dd-surface-strong)] flex flex-col gap-4">
                    {product.stockLeft && (
                      <div className="flex items-center gap-2">
                         <div className="flex-1 h-1 bg-[var(--dd-surface-strong)] rounded-full overflow-hidden">
                            <div className="h-full bg-[#EB1700]" style={{ width: `${product.stockPercent}%` }} />
                         </div>
                         <span className="text-[11px] font-bold text-[#EB1700]">Only {product.stockLeft} left</span>
                      </div>
                    )}
                    <button 
                      onClick={() => toggleProduct(product.id)}
                      className={`w-full py-3 rounded-[var(--dd-radius-sm)] text-[13px] font-bold uppercase tracking-widest transition active:scale-[0.98] ${
                        selectedProducts.has(product.id)
                          ? 'bg-[#76885B] text-white'
                          : 'border border-[var(--dd-surface-base)] hover:bg-[var(--dd-surface-base)] hover:text-white'
                      }`}
                    >
                      {selectedProducts.has(product.id) ? 'Added to Ritual' : 'Add to Ritual'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Curator Note */}
          <section className="bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center">
             <div className="h-32 w-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-[var(--dd-surface-strong)] shadow-sm">
                <img src={CURATOR_PORTRAIT} alt="Curator" className="h-full w-full object-cover grayscale" />
             </div>
             <div>
                <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#76885B]">From the Curator</span>
                <h4 className="text-[24px] font-bold mt-4 mb-6 italic">" {catData.curatorNote.quote} "</h4>
                <p className="text-[14px] font-bold uppercase tracking-widest opacity-40">— {catData.curatorNote.attribution}</p>
             </div>
          </section>
        </main>

        {/* Selection Summary Sidebar */}
        <aside className="hidden xl:flex flex-col w-96 bg-white border-l border-[var(--dd-surface-strong)] p-8">
          <div className="mb-8">
            <h2 className="text-[20px] font-bold tracking-tight">Your Ritual</h2>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 mt-1">Selection Summary</p>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2">
            {selectedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                 <ShoppingBag className="h-12 w-12 mb-4" />
                 <p className="text-[14px] font-bold">Your ritual is empty</p>
              </div>
            ) : (
              selectedItems.map(item => (
                <div key={item.id} className="flex gap-4 group">
                   <div className="h-20 w-16 bg-[#f8f9fa] rounded-sm flex-shrink-0 border border-[var(--dd-surface-strong)] overflow-hidden">
                      <img src={item.thumb} alt={item.name} className="h-full w-full object-contain mix-blend-multiply p-1" />
                   </div>
                   <div className="flex-1 min-w-0 border-b border-[var(--dd-surface-strong)] pb-4">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-[13px] font-bold truncate leading-tight">{item.name}</h4>
                        <button onClick={() => removeProduct(item.id)} className="opacity-20 hover:opacity-100 transition">
                           <Check className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[11px] opacity-40 font-medium mt-1">{item.tagline}</p>
                      <p className="text-[13px] font-bold mt-2">{formatLKR(item.curatorPrice)}</p>
                   </div>
                </div>
              ))
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-[var(--dd-surface-base)] space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[14px]">
                  <span className="opacity-40 font-medium">Subtotal</span>
                  <span className="font-bold">{formatLKR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[14px] text-[#76885B]">
                    <span className="font-bold italic">Bundle Discount (15%)</span>
                    <span className="font-bold">-{formatLKR(discount)}</span>
                  </div>
                )}
                <div className="pt-4 flex justify-between items-center text-[20px] font-bold">
                  <span>Total</span>
                  <span>{formatLKR(total)}</span>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] text-white text-[14px] font-bold shadow-lg transition hover:opacity-90"
              >
                Checkout Ritual
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </aside>
      </div>
    </BrandedLayout>
  );
}