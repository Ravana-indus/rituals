import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function CuratedSelection() {
  const [searchParams] = useSearchParams();
  const conditions = searchParams.get('conditions')?.split(',').filter(Boolean) || [];
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddToRitual = (id: string) => {
    setAddedItems(prev => new Set([...prev, id]));
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header />

      <main className="flex-grow pt-8 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-16 w-full">
        {/* Header Section */}
        <header className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold tracking-widest uppercase mb-4">
            <Icon name="auto_awesome" filled className="text-sm" />
            <span>AI-Curated Selection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-noto-serif italic tracking-tight text-primary leading-tight">Master Curator's Selection</h1>
          <p className="max-w-2xl mx-auto text-on-surface-variant font-manrope">Based on your recent botanical consultation, we have curated these specific rituals to restore balance to your unique Prakriti.</p>
        </header>

        {/* Bento Layout: Why this is for you & Featured Bundle */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* AI Reasoning Panel */}
          <div className="lg:col-span-4 bg-surface-container-low p-8 rounded-xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Icon name="psychology" filled className="text-8xl" />
            </div>
            <h3 className="text-2xl font-noto-serif text-primary italic">Why this is for you</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex gap-4">
                <Icon name="spa" filled className="text-secondary" />
                <p className="text-sm leading-relaxed text-on-surface-variant">Your profile indicates high <strong>Pitta</strong> activity, requiring cooling Sandalwood and Vetiver base notes.</p>
              </div>
              <div className="flex gap-4">
                <Icon name="water_drop" filled className="text-secondary" />
                <p className="text-sm leading-relaxed text-on-surface-variant">The humidity levels in Colombo right now suggest a lighter, serum-based hydration rather than heavy creams.</p>
              </div>
              <div className="flex gap-4">
                <Icon name="temp_preferences_custom" filled className="text-secondary" />
                <p className="text-sm leading-relaxed text-on-surface-variant">Based on your sleep patterns, we've prioritized high-concentration night botanicals.</p>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-primary  font-bold text-xs uppercase tracking-wider hover:text-secondary  transition-colors flex items-center gap-1"
              >
                View Full Analysis <Icon name="arrow_forward" className="text-sm" />
              </button>
            </div>
          </div>

          {/* Main Featured Ritual Bundle */}
          <div className="lg:col-span-8 bg-surface-container-highest rounded-xl overflow-hidden flex flex-col md:flex-row shadow-[0_20px_40px_rgba(28,28,23,0.04)]">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <img alt="The Radiant Skin Ritual" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxwB-5-53l0fMcuJx-Hcmdim4J0kZOBYjSjttVSRAeZU9IsF01dDoMXvzZsnfGJT2KmhkFX_fUCEIgAn5CrpULqOUEbxLn0VAe_34Z3YAwBXx7B9ojLnTzJMq4n3W7nTF7sTFBAvs5hh48N3GECkXC3T9yz7NuvHohTYxXUMVVh7bzjMyHfUo-0RxyjK4v2CXwOyl5jjS8Z3WwvmV9T_UFngLGdKxPH0YtyY0Z_8xhEZTtsuZH66jIAU7SAPRQk9pYjGJbnh13w-tE" />
              <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tighter" style={{ clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }}>
                Save 15%
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-noto-serif text-primary mb-2">The Radiant Skin Ritual</h2>
                <p className="text-on-surface-variant text-sm mb-6">A 4-step sequence featuring Turmeric, Saffron, and Virgin Coconut oil to restore natural luminescence.</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-xs text-on-surface/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Golden Glow Cleansing Balm
                  </div>
                  <div className="flex items-center gap-3 text-xs text-on-surface/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Saffron Infused Tonic
                  </div>
                  <div className="flex items-center gap-3 text-xs text-on-surface/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Night Recovery Elixir
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="block text-xs text-on-surface/40 line-through font-manrope">LKR 12,400</span>
                  <span className="text-2xl font-bold text-secondary font-manrope">LKR 10,540</span>
                </div>
                <Link to="/ritual-builder" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg">
                  Add Ritual
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-outline-variant/10">
                <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '25%' }} />
                </div>
                <span className="text-xs text-secondary font-black">Only 5 left</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-2">
                <span className="flex items-center gap-0.5 text-primary"><Icon name="verified" className="text-xs" filled /> Authenticity Guaranteed</span>
                <span className="text-outline">·</span>
                <span className="text-outline">Exp: Dec 2026</span>
                <span className="text-outline">·</span>
                <span className="flex items-center gap-0.5 text-secondary"><Icon name="sell" className="text-xs" /> Bundle discount</span>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Ritual Bundles */}
        <section className="space-y-8">
          <div className="flex justify-between items-end border-b border-outline-variant/15 pb-4">
            <h3 className="text-2xl font-noto-serif italic text-primary">Secondary Focus Rituals</h3>
            <Link to="/" className="text-xs font-bold uppercase tracking-widest text-on-surface/60 hover:text-primary transition-colors">Explore All Bundles</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bundle 2 */}
            <div className="bg-surface-container-low rounded-xl p-2 group hover:bg-surface-container transition-colors duration-300">
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <img alt="The Strengthening Hair Ritual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcOQK4tL1tcOwZsGNzPyxop0SyOjtbnIz42ZoBu23RYLYXKimRS1oTuELM3dtwPV9s-UhX3ZqwTJYWOlm9eoPPXYmzkBmDU8c5mOGp4KJ1WFQ2B3SKsq_fAURMbjlHA0XiG8VYxf3T2OafMG0jf8ccEaWcw-wdWBmFNVA6OZVLAAgd8BE_NqU6asmAAYlZlk2mJmileuqbINKl0s9bjLI_ZZjUxWpIfGDQvUmjvQNcbkW5IOrsEmK0SB1YfPt3WmBSfY6nPE1ZP29y" />
                <div className="absolute top-4 right-4 bg-tertiary-container text-on-tertiary px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tighter" style={{ clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }}>
                  Ritual Value
                </div>
              </div>
              <div className="px-4 pb-4">
                <h4 className="text-xl font-noto-serif text-primary mb-2">The Strengthening Hair Ritual</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-6">Repair environmental damage with traditional Neelibringadi and Gotu Kola extracts.</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-on-surface/40 line-through">LKR 8,900</span>
                    <span className="text-lg font-bold text-secondary">LKR 7,500</span>
                  </div>
                  <button
                    onClick={() => handleAddToRitual('product-2')}
                    className={`bg-secondary text-on-secondary w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-all ${addedItems.has('product-2') ? 'bg-green-600' : ''}`}
                  >
                    {addedItems.has('product-2') ? <Icon name="check" /> : <Icon name="add_shopping_cart" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/10">
                  <div className="flex-1 h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-2">
                  <span className="flex items-center gap-0.5 text-primary"><Icon name="verified" className="text-xs" filled /> Auth</span>
                  <span className="text-outline">·</span>
                  <span className="text-outline">Exp: Nov 2026</span>
                  <span className="text-outline">·</span>
                  <span className="flex items-center gap-0.5 text-secondary"><Icon name="sell" className="text-xs" /> Limited batch</span>
                </div>
              </div>
            </div>

            {/* Bundle 3 */}
            <div className="bg-surface-container-low rounded-xl p-2 group hover:bg-surface-container transition-colors duration-300">
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <img alt="The Evening Calm Ritual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFTCRH0upS9rv3LmtXIsLl7in7SdAh74amhlZHxGcY8lciIeN25cln1tJxIznq-MKA7ZlK04tOrM2trmgO2TU0LMHxgy4vw9pn8iKbUYUIuIQH66hRQblJ6RgLpfoJmNy51AgXjg_92MHBA0giJUH9uX30xGMk6_9tVy5E_g4Rrrwfvn9WD9W_IDbwyoj3BMhSa6iENRwu4iZmHzKCJuwdvTzN8tVhAGPpMc8PEJpp0oyNjc50Gnly31-Oe4SqgukMfwWYpxhcx2vl" />
                <div className="absolute top-4 right-4 bg-tertiary-container text-on-tertiary px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tighter" style={{ clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }}>
                  Deal Applied
                </div>
              </div>
              <div className="px-4 pb-4">
                <h4 className="text-xl font-noto-serif text-primary mb-2">The Evening Calm Ritual</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-6">Soothe the senses before sleep with Ashwagandha tea and Lavender temple balms.</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-on-surface/40 line-through">LKR 6,200</span>
                    <span className="text-lg font-bold text-secondary">LKR 5,200</span>
                  </div>
                  <button
                    onClick={() => handleAddToRitual('product-3')}
                    className={`bg-secondary text-on-secondary w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-all ${addedItems.has('product-3') ? 'bg-green-600' : ''}`}
                  >
                    {addedItems.has('product-3') ? <Icon name="check" /> : <Icon name="add_shopping_cart" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/10">
                  <div className="flex-1 h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '40%' }} />
                  </div>
                  <span className="text-xs text-secondary font-black">Only 8 left</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-2">
                  <span className="flex items-center gap-0.5 text-primary"><Icon name="verified" className="text-xs" filled /> Auth</span>
                  <span className="text-outline">·</span>
                  <span className="text-outline">Exp: Oct 2026</span>
                  <span className="text-outline">·</span>
                  <span className="flex items-center gap-0.5 text-secondary"><Icon name="sell" className="text-xs" /> Seasonal</span>
                </div>
              </div>
            </div>

            {/* Hand-picked suggestion */}
            <div className="bg-surface border-2 border-dashed border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center">
                <Icon name="auto_fix_high" className="text-on-secondary-fixed text-3xl" />
              </div>
              <h4 className="text-xl font-noto-serif text-primary italic">Modify Your Ritual</h4>
              <p className="text-xs text-on-surface-variant">Prefer different scents or textures? Adjust your curated selection here.</p>
              <Link to="/ritual-builder" className="border border-primary text-primary px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors">
                Re-Curate
              </Link>
            </div>
          </div>
        </section>

        {/* Thrifty Tagline Footer Section */}
        <div className="bg-surface-container py-12 px-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYm2G3b54rGoamdz3QvlkjQFBqZrCGdJsvFQLZQhI5kqkXXVsPpkchA5DmHOrAudgSWvrQN0jzb_0Z7Nl7_u_RJylcY2TDiE1IyYbfph2WOaHn9JH4Vuw8zK0jkdb1-FFjwXsDA1E4WDvE0rsNOYs8v7F2Lmqk2sLNh5pG9Ten6n8DSVvTBJhCbiE9KZJU0tTLWDMjDCZd3Y7lWCyVPW_oqnLRcLnfgmRS5zuYYiDxCy3sU3Z7m3JqEvUwAB1ip3d_Gb00hLvb3v4k')", backgroundRepeat: 'repeat' }}>
          <div className="relative z-10">
            <h3 className="text-3xl font-noto-serif text-primary italic mb-2">The Heritage Promise</h3>
            <p className="text-on-surface-variant text-sm max-w-lg">Sourced from small-scale Sri Lankan farmers, bottled with clinical precision, and curated specifically for your biological clock.</p>
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="text-center">
              <span className="block text-3xl font-bold text-primary">100%</span>
              <span className="text-xs uppercase font-bold tracking-widest text-on-surface/40">Ethical Sourcing</span>
            </div>
            <div className="w-px h-12 bg-outline-variant/20"></div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-primary">Fresh</span>
              <span className="text-xs uppercase font-bold tracking-widest text-on-surface/40">Batch Blended</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile) */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-surface  z-50 rounded-t-3xl shadow-[0_-10px_30px_rgba(28,28,23,0.04)] border-t border-outline-variant/15">
          <Link to="/consult" className="flex flex-col items-center justify-center bg-primary text-on-surface rounded-xl min-w-[64px] min-h-[44px] px-3 py-2 scale-95 transition-transform duration-500 ease-in-out">
            <Icon name="chat_bubble" />
            <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Consult</span>
          </Link>
          <Link to="/ritual-builder" className="flex flex-col items-center justify-center text-on-surface/40  min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-surface-container  transition-all">
            <Icon name="auto_awesome" />
            <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Rituals</span>
          </Link>
          <Link to="/curated-selection" className="flex flex-col items-center justify-center text-on-surface/40  min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-surface-container  transition-all">
            <Icon name="auto_stories" />
            <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Curations</span>
          </Link>
          <Link to="/" className="flex flex-col items-center justify-center text-on-surface/40  min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-surface-container  transition-all">
            <Icon name="local_pharmacy" />
            <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Apothecary</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
