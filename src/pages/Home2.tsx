import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  Droplets,
  FlaskConical,
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Brand, Category, Product, ProductImage } from '../types/database';
import { formatPriceCents } from '../types/database';

type FeaturedProduct = Product & { brand: Brand; images: ProductImage[] };

type CategoryVisual = {
  icon: LucideIcon;
  glow: string;
  tint: string;
  label: string;
};

const home2Tokens = {
  '--home2-primary': '#A44668',
  '--home2-primary-hover': '#8C3955',
  '--home2-secondary': '#D4A574',
  '--home2-surface': '#FEFCFA',
  '--home2-surface-raised': '#F7F4F0',
  '--home2-surface-muted': '#EFEAE4',
  '--home2-border': '#E8E3DD',
  '--home2-text': '#1A1A1A',
  '--home2-text-secondary': '#5C5347',
  '--home2-text-muted': '#8A8078',
  '--home2-success': '#1B7A4E',
} as React.CSSProperties;

const fallbackCategories = [
  { id: 'skincare', slug: 'skincare', name: 'Skincare', is_active: true },
  { id: 'makeup', slug: 'makeup', name: 'Makeup', is_active: true },
  { id: 'hair-body', slug: 'hair-body', name: 'Hair & Body', is_active: true },
  { id: 'fragrance', slug: 'fragrance', name: 'Fragrance', is_active: true },
] as Pick<Category, 'id' | 'slug' | 'name' | 'is_active'>[];

const categoryVisuals: Record<string, CategoryVisual> = {
  skincare: {
    icon: Droplets,
    glow: 'from-[#F6D7E2] to-[#FEFCFA]',
    tint: 'bg-[#F7E7EE]',
    label: 'Barrier-safe essentials',
  },
  makeup: {
    icon: Sparkles,
    glow: 'from-[#F2D6C2] to-[#FEFCFA]',
    tint: 'bg-[#F8EADF]',
    label: 'Editorial colour stories',
  },
  'hair-body': {
    icon: Leaf,
    glow: 'from-[#E3E8D8] to-[#FEFCFA]',
    tint: 'bg-[#ECF0E6]',
    label: 'Climate-aware care',
  },
  fragrance: {
    icon: FlaskConical,
    glow: 'from-[#EADFCF] to-[#FEFCFA]',
    tint: 'bg-[#F4EBDE]',
    label: 'Long-wear signatures',
  },
  default: {
    icon: Star,
    glow: 'from-[#E9D7DE] to-[#FEFCFA]',
    tint: 'bg-[#F7F4F0]',
    label: 'Curated picks',
  },
};

const promisePillars = [
  {
    title: 'Delivery tuned for Sri Lanka',
    body: 'Location-first browsing, cash-on-delivery support, and predictable doorstep updates.',
  },
  {
    title: 'Premium brands, warm retail language',
    body: 'Playful editorial storytelling softened with trust signals and clear conversion paths.',
  },
  {
    title: 'Accessible beauty commerce',
    body: 'Touch-friendly actions, high-contrast copy, and live-stock cues that stay readable.',
  },
];

const ritualSteps = [
  {
    title: 'Choose your beauty chapter',
    body: 'Move from skincare to fragrance without losing your place. Categories stay visible and touch-friendly.',
  },
  {
    title: 'Check delivery before you fall in love',
    body: 'The location selector sets expectations early, so shipping and availability feel certain rather than hidden.',
  },
  {
    title: 'Shop cards built for decisions',
    body: 'Shade hints, pricing, stock urgency, and concise rituals all live in a single quick-scan block.',
  },
];

export default function Home2() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadPageData() {
      setLoading(true);
      try {
        const { api } = await import('../lib/api');
        const [featuredData, categoriesData, allProducts] = await Promise.all([
          api.products.getFeatured(),
          api.categories.getAll(),
          api.products.getAll(),
        ]);

        if (ignore) {
          return;
        }

        const activeCategories = categoriesData.filter((category) => category.is_active);
        const curatedProducts = featuredData.length > 0
          ? featuredData
          : (allProducts.slice(0, 4) as FeaturedProduct[]);

        setCategories(activeCategories);
        setFeaturedProducts(curatedProducts.slice(0, 4));
      } catch (error) {
        console.error('Failed to load /home2 landing data', error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPageData();
    return () => {
      ignore = true;
    };
  }, []);

  const visibleCategories = (categories.length > 0 ? categories : fallbackCategories).slice(0, 4);

  return (
    <div
      style={{ ...home2Tokens, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      className="min-h-screen bg-[var(--home2-surface)] text-[var(--home2-text)]"
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-12rem] h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(164,70,104,0.18),_transparent_58%)]" />
        <div className="pointer-events-none absolute right-[-8rem] top-[16rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(212,165,116,0.22),_transparent_70%)] blur-3xl" />

        <header className="relative z-10 border-b border-[var(--home2-border)]/70 bg-[rgba(254,252,250,0.9)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-4">
                <Link
                  to="/home2"
                  className="min-h-[44px] text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--home2-text)]"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Lakbima Beauty
                </Link>
                <button
                  type="button"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--home2-border)] bg-[var(--home2-surface-raised)] px-4 text-sm font-medium text-[var(--home2-text)] transition hover:border-[var(--home2-primary)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)] lg:hidden"
                >
                  <MapPin className="h-4 w-4" />
                  Delivery
                  <ChevronDown className="h-4 w-4 text-[var(--home2-text-muted)]" />
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="hidden min-h-[44px] items-center gap-2 rounded-full border border-[var(--home2-border)] bg-[var(--home2-surface-raised)] px-4 text-sm font-medium text-[var(--home2-text)] transition hover:border-[var(--home2-primary)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)] lg:inline-flex"
                >
                  <MapPin className="h-4 w-4" />
                  Colombo 03
                  <span className="text-[var(--home2-text-muted)]">Delivery</span>
                  <ChevronDown className="h-4 w-4 text-[var(--home2-text-muted)]" />
                </button>

                <Link
                  to="/search"
                  className="inline-flex min-h-[44px] items-center gap-3 rounded-full border border-[var(--home2-border)] bg-white px-4 text-sm text-[var(--home2-text-secondary)] transition hover:border-[var(--home2-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)]"
                >
                  <Search className="h-4 w-4 text-[var(--home2-text-muted)]" />
                  Search skincare, SPF, fragrance
                </Link>
              </div>
            </div>

            <nav className="flex items-center gap-5 overflow-x-auto pb-1 text-sm font-medium text-[var(--home2-text-secondary)]">
              <a className="min-h-[44px] whitespace-nowrap py-2 transition hover:text-[var(--home2-primary)]" href="#categories">Categories</a>
              <a className="min-h-[44px] whitespace-nowrap py-2 transition hover:text-[var(--home2-primary)]" href="#new-arrivals">New Arrivals</a>
              <a className="min-h-[44px] whitespace-nowrap py-2 transition hover:text-[var(--home2-primary)]" href="#rituals">Ritual Journey</a>
              <Link className="min-h-[44px] whitespace-nowrap py-2 transition hover:text-[var(--home2-primary)]" to="/consult">AI Consultation</Link>
              <Link className="min-h-[44px] whitespace-nowrap py-2 transition hover:text-[var(--home2-primary)]" to="/support">Support</Link>
            </nav>
          </div>
        </header>

        <main className="relative z-10">
          <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1.1fr)_26rem] lg:px-8 lg:py-14">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--home2-border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home2-primary)] shadow-[0_10px_30px_rgba(26,26,26,0.04)]">
                <Sparkles className="h-4 w-4" />
                Alternative Landing Concept
              </div>

              <div className="space-y-5">
                <h1
                  className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--home2-text)] sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Lakbima Beauty for rituals that start with trust and end at your door.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--home2-text-secondary)] sm:text-lg">
                  An editorial beauty storefront shaped for Sri Lanka: premium product storytelling, visible delivery logic,
                  and conversion blocks that feel warm instead of transactional.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#new-arrivals"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--home2-primary)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--home2-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)]"
                >
                  Shop New Arrivals
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/consult"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--home2-border)] bg-white px-6 text-sm font-semibold text-[var(--home2-text)] transition hover:border-[var(--home2-primary)] hover:text-[var(--home2-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)]"
                >
                  Book Beauty Consultation
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {promisePillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-[1.5rem] border border-[var(--home2-border)] bg-white/80 p-5 shadow-[0_20px_60px_rgba(26,26,26,0.04)] backdrop-blur-sm"
                  >
                    <p className="text-sm font-semibold text-[var(--home2-text)]">{pillar.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--home2-text-secondary)]">{pillar.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[2rem] border border-[var(--home2-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,244,240,0.96))] p-6 shadow-[0_30px_80px_rgba(26,26,26,0.08)]">
              <div className="absolute inset-x-8 top-0 h-40 rounded-b-full bg-[radial-gradient(circle,_rgba(164,70,104,0.16),_transparent_70%)] blur-2xl" />
              <div className="relative space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home2-text-muted)]">Today’s Store Logic</p>
                    <h2
                      className="mt-3 text-3xl leading-tight text-[var(--home2-text)]"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      Delivery, authenticity, and climate cues stay above the fold.
                    </h2>
                  </div>
                  <div className="rounded-full bg-[var(--home2-primary)]/10 p-3 text-[var(--home2-primary)]">
                    <WandSparkles className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Home2SignalCard icon={ShieldCheck} title="100% authentic" body="Batch-code confidence and direct sourcing language." />
                  <Home2SignalCard icon={Truck} title="Island-wide delivery" body="Location-first delivery messaging for quick trust." />
                  <Home2SignalCard icon={Sparkles} title="Routine-first shopping" body="Beauty chapters that guide discovery before the first click." />
                </div>

                <div className="rounded-[1.5rem] border border-[var(--home2-border)] bg-white px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--home2-text-muted)]">Editorial CTA</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--home2-text-secondary)]">
                        Pair product discovery with a concierge-style consultation for skincare, makeup, or fragrance.
                      </p>
                    </div>
                    <Link
                      to="/consult"
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--home2-secondary)] px-4 text-sm font-semibold text-[var(--home2-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)]"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          <section className="border-y border-[var(--home2-border)] bg-[var(--home2-surface-raised)]/80">
            <div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 sm:grid-cols-3 lg:px-8">
              <Home2Stat label="Delivery zones" value="25+" note="District-aware logistics" />
              <Home2Stat label="Consultation styles" value="3" note="Skin, colour, fragrance" />
              <Home2Stat label="Promise" value="WCAG AA" note="Readable, touch-safe actions" />
            </div>
          </section>

          <section id="categories" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home2-primary)]">Category Navigation</p>
                <h2
                  className="mt-3 text-3xl text-[var(--home2-text)] sm:text-4xl"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Browse by beauty chapter, not just a product list.
                </h2>
              </div>
              <Link className="hidden text-sm font-semibold text-[var(--home2-primary)] lg:inline-flex" to="/search">
                Explore the Collection
              </Link>
            </div>

            <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
              {visibleCategories.map((category) => {
                const visual = categoryVisuals[category.slug] ?? categoryVisuals.default;
                const Icon = visual.icon;
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="group min-w-[10.5rem] flex-1 rounded-[1.75rem] border border-[var(--home2-border)] bg-white p-4 shadow-[0_16px_40px_rgba(26,26,26,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[var(--home2-primary)] hover:shadow-[0_22px_50px_rgba(26,26,26,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)] motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${visual.glow} text-[var(--home2-primary)]`}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${visual.tint}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-base font-semibold text-[var(--home2-text)]">{category.name}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--home2-text-secondary)]">{visual.label}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section id="new-arrivals" className="mx-auto max-w-7xl px-5 py-4 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home2-primary)]">Promotional Banner + Product Grid</p>
                <h2
                  className="mt-3 text-3xl text-[var(--home2-text)] sm:text-4xl"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Shop New Arrivals
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--home2-text-secondary)]">
                  The alternative landing direction keeps product cards quick to scan while preserving the softer premium tone from the design brief.
                </p>
              </div>

              <Link
                to="/search"
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--home2-primary)] transition hover:text-[var(--home2-primary-hover)]"
              >
                Explore the Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="overflow-hidden rounded-[1.6rem] border border-[var(--home2-border)] bg-white p-4 shadow-[0_18px_44px_rgba(26,26,26,0.05)]"
                    >
                      <div className="aspect-[3/4] animate-pulse rounded-[1.2rem] bg-[var(--home2-surface-muted)]" />
                      <div className="mt-4 h-3 w-20 animate-pulse rounded-full bg-[var(--home2-surface-muted)]" />
                      <div className="mt-3 h-6 w-3/4 animate-pulse rounded-full bg-[var(--home2-surface-muted)]" />
                      <div className="mt-6 h-11 w-full animate-pulse rounded-full bg-[var(--home2-surface-muted)]" />
                    </div>
                  ))
                : featuredProducts.map((product) =>
                    React.createElement(Home2ProductCard, { product, key: product.id })
                  )}
            </div>
          </section>

          <section id="rituals" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
            <div className="rounded-[2rem] bg-[linear-gradient(160deg,#A44668,#8C3955)] p-8 text-white shadow-[0_28px_70px_rgba(140,57,85,0.26)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">Scroll-Triggered Storytelling</p>
              <h2
                className="mt-4 text-3xl leading-tight sm:text-4xl"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                The page moves from aspiration to delivery clarity to product action.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/84">
                This keeps the luxury tone intact while showing the practical things beauty shoppers in Sri Lanka need before they convert.
              </p>

              <div className="mt-8 space-y-4">
                {ritualSteps.map((step, index) => (
                  <div key={step.title} className="rounded-[1.4rem] border border-white/18 bg-white/8 p-5 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/64">Chapter {index + 1}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{step.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/78">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[2rem] border border-[var(--home2-border)] bg-[var(--home2-surface-raised)] p-7 shadow-[0_20px_60px_rgba(26,26,26,0.05)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home2-primary)]">Delivery Zone Selector</p>
                    <h3
                      className="mt-3 text-3xl text-[var(--home2-text)]"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      Delivery certainty starts the conversation.
                    </h3>
                  </div>
                  <div className="rounded-full bg-[var(--home2-primary)]/10 p-3 text-[var(--home2-primary)]">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-[var(--home2-border)] bg-white p-5">
                    <p className="text-sm font-semibold text-[var(--home2-text)]">Colombo 03</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--home2-text-secondary)]">
                      Same-day windows, cash on delivery, and quick concierge routing.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-[var(--home2-border)] bg-white p-5">
                    <p className="text-sm font-semibold text-[var(--home2-text)]">Kandy + Galle</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--home2-text-secondary)]">
                      Shipping timelines are surfaced before cart, so expectations stay realistic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.8rem] border border-[var(--home2-border)] bg-white p-6 shadow-[0_16px_40px_rgba(26,26,26,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home2-primary)]">Promotions</p>
                  <h3
                    className="mt-3 text-2xl text-[var(--home2-text)]"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    Campaign blocks behave like glossy editorial covers.
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--home2-text-secondary)]">
                    Seasonal launches, premium bundles, and festival offers sit inside a softer card system rather than loud discount slabs.
                  </p>
                </div>

                <div className="rounded-[1.8rem] border border-[var(--home2-border)] bg-white p-6 shadow-[0_16px_40px_rgba(26,26,26,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home2-primary)]">Consultation</p>
                  <h3
                    className="mt-3 text-2xl text-[var(--home2-text)]"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    Beauty guidance is part of the storefront, not hidden after signup.
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--home2-text-secondary)]">
                    Consultation entry points appear beside products and delivery content, supporting discovery for higher-consideration shoppers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
            <div className="rounded-[2.2rem] border border-[var(--home2-border)] bg-[linear-gradient(135deg,rgba(247,244,240,0.98),rgba(255,255,255,0.94))] px-6 py-10 shadow-[0_20px_60px_rgba(26,26,26,0.05)] sm:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home2-primary)]">Final CTA</p>
              <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2
                    className="max-w-2xl text-3xl text-[var(--home2-text)] sm:text-4xl"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    A warmer alternative to the current home page, built for brand trust first and product browsing second.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--home2-text-secondary)]">
                    Use this route as a second landing-page direction for stakeholder comparison, QA, or future iteration.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#new-arrivals"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--home2-primary)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--home2-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)]"
                  >
                    Review the Collection
                  </a>
                  <Link
                    to="/register"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--home2-border)] bg-white px-6 text-sm font-semibold text-[var(--home2-text)] transition hover:border-[var(--home2-primary)] hover:text-[var(--home2-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)]"
                  >
                    Create an Account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[var(--home2-border)] bg-white/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[var(--home2-text-secondary)] lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>Alternative landing page concept for Lakbima Beauty.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/support" className="transition hover:text-[var(--home2-primary)]">Shipping & Returns</Link>
              <Link to="/consult" className="transition hover:text-[var(--home2-primary)]">AI Consultation</Link>
              <Link to="/search" className="transition hover:text-[var(--home2-primary)]">Catalog</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Home2SignalCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[1.35rem] border border-[var(--home2-border)] bg-white/88 p-4">
      <div className="rounded-full bg-[var(--home2-primary)]/10 p-3 text-[var(--home2-primary)]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--home2-text)]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[var(--home2-text-secondary)]">{body}</p>
      </div>
    </div>
  );
}

function Home2Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[var(--home2-border)] bg-white/80 px-5 py-4 shadow-[0_10px_30px_rgba(26,26,26,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--home2-text-muted)]">{label}</p>
      <p
        className="mt-2 text-3xl text-[var(--home2-text)]"
        style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-[var(--home2-text-secondary)]">{note}</p>
    </div>
  );
}

function Home2ProductCard({ product }: { product: FeaturedProduct }) {
  const firstImage = product.images?.[0];
  const hasSalePrice = Boolean(product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents);

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-[var(--home2-border)] bg-white p-4 shadow-[0_18px_44px_rgba(26,26,26,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_rgba(26,26,26,0.08)] motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative overflow-hidden rounded-[1.2rem] bg-[var(--home2-surface-raised)]">
        {firstImage?.url ? (
          <img
            src={firstImage.url}
            alt={firstImage.alt_text || product.name}
            className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        ) : (
          <div className="flex aspect-[3/4] items-end bg-[linear-gradient(180deg,#F7F4F0,#EFEAE4)] p-5">
            <p
              className="max-w-[11rem] text-2xl leading-tight text-[var(--home2-text)]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              {product.name}
            </p>
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--home2-text)]">
            {product.is_featured ? 'Featured' : 'New'}
          </span>
          {hasSalePrice && (
            <span className="rounded-full bg-[var(--home2-primary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              Sale
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--home2-text-muted)]">{product.brand?.name ?? 'Lakbima Beauty'}</p>
        <Link to={`/product?slug=${product.slug}`} className="mt-2 block">
          <h3
            className="text-2xl leading-tight text-[var(--home2-text)] transition group-hover:text-[var(--home2-primary)]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {product.name}
          </h3>
        </Link>
        {product.tagline && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--home2-text-secondary)]">{product.tagline}</p>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <p className="text-lg font-semibold text-[var(--home2-text)]">{formatPriceCents(product.price_cents)}</p>
        {hasSalePrice && product.compare_at_price_cents && (
          <p className="text-sm text-[var(--home2-text-muted)] line-through">{formatPriceCents(product.compare_at_price_cents)}</p>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-[var(--home2-success)]">
        <ShieldCheck className="h-4 w-4" />
        Authentic stock with delivery-ready handling
      </div>

      <div className="mt-5 flex gap-3">
        <Link
          to={`/product?slug=${product.slug}`}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-[var(--home2-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--home2-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)]"
        >
          View Product
        </Link>
        <Link
          to="/consult"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-[var(--home2-border)] px-4 text-sm font-semibold text-[var(--home2-text)] transition hover:border-[var(--home2-primary)] hover:text-[var(--home2-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home2-primary)]"
        >
          Ask Expert
        </Link>
      </div>
    </article>
  );
}
