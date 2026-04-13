import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function Contact() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative">
      <div className="fixed inset-0 opacity-5 z-0 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZICOHjaFfnZdch5nYBotzENkZndrT4v5Ct8cznnGgOTw7AhBPXKefeBwfrhCkxGz__ZnEf7GYJJ8NWaTSzrHEO_dkQj_LD0wMMAcnp0LF-F51W-YBrSnyTX_2PaXi_B5wl_v1SW7tNyJSiQxT-myLBlNmcfeRjtuKAKwokdJ4qOeA54VY8Yk74mT7mckGbpGTB1ZglEmV_H57h6NEL7SNVy3IYYV9u8eN070BIOk559q8_oid1n-cmVRop4PM_MXwRE2tEcGUsj4_')" }}></div>

      <Header />

      <main className="pt-8 pb-24 relative overflow-hidden flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-outline-variant/15 pb-16">
            <div className="max-w-2xl">
              <span className="text-secondary font-manrope text-xs uppercase tracking-[0.3em] mb-4 block">Concierge Services</span>
              <h1 className="text-5xl md:text-7xl font-noto-serif text-primary leading-tight mb-8">Connect with the Curator</h1>
              <p className="text-lg text-on-surface-variant font-manrope leading-relaxed">
                Whether you seek a bespoke wellness ritual or have inquiries regarding our heirloom apothecary, our concierge is here to guide your journey. Step into our digital sanctuary for personalized assistance.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-48 h-48 rounded-full overflow-hidden border border-outline-variant/20 p-2">
                <img className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700" alt="Curator" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFfeAl-adS4zOEgZYmKtKS8A2diVark0TXEjjvPK_ZmyD3T0ozN7hk10BVjadoP7L3As3ry-jnt8Wy7UTRRGcj6JfmHQaPDrEtKstCwxukCFIMZdJzP7aShyhuyfOOp4HOeWa3Yu0jSQsaMBMw5IgxqPhJMioCxrSmy1WE6e64EFaG-9779j5MQpNL_bqRaCfc_yVLdBnjXI0k0vJGHfYyML2ZGHaSkSZYQreaiVxD4EMrpIlLJPndXZ4cTLeAnuSDa5aY9UjZNo1U" />
              </div>
            </div>
          </div>
        </section>

        {/* Direct Inquiry & Touchpoints Layout */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 relative z-10">
          {/* Direct Inquiry Form */}
          <div className="lg:col-span-7 bg-surface-container-low p-8 md:p-12 rounded-xl">
            <h2 className="text-3xl font-noto-serif text-primary mb-12">Submit an Inquiry</h2>
            <form className="space-y-10">
              <div className="relative">
                <label className="block text-xs font-manrope uppercase tracking-widest text-on-surface-variant mb-2">Your Essence (Name)</label>
                <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-all duration-300 py-3 font-manrope text-on-surface placeholder-stone-300 outline-none" placeholder="E.g. Amara Perera" type="text" />
              </div>
              <div className="relative">
                <label className="block text-xs font-manrope uppercase tracking-widest text-on-surface-variant mb-2">Digital Path (Email)</label>
                <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-all duration-300 py-3 font-manrope text-on-surface placeholder-stone-300 outline-none" placeholder="hello@path.com" type="email" />
              </div>
              <div className="relative">
                <label className="block text-xs font-manrope uppercase tracking-widest text-on-surface-variant mb-2">Your Inquiry</label>
                <textarea className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-all duration-300 py-3 font-manrope text-on-surface placeholder-stone-300 resize-none outline-none" placeholder="Describe your needs..." rows={4}></textarea>
              </div>
              <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <p className="text-xs text-on-surface-variant italic font-manrope max-w-xs">
                  * We aim to respond within one lunar cycle of your inquiry.
                </p>
                <button type="button" className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-4 rounded-md font-manrope uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/10">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Concierge Touchpoints */}
          <div className="lg:col-span-5 space-y-16">
            {/* Touchpoint Grid */}
            <div className="space-y-12">
              <div className="group">
                <div className="flex items-start gap-4 mb-4">
                  <Icon name="chat_bubble" className="text-secondary text-3xl" />
                  <div>
                    <h3 className="text-xl font-noto-serif text-primary mb-1">Speak with a Curator</h3>
                    <p className="text-sm font-manrope text-secondary uppercase tracking-wider mb-2">Live Chat Available</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Engage in a live dialogue with our experts for immediate guidance.<br/>
                      <span className="font-semibold text-on-surface">9am — 6pm SLT</span>
                    </p>
                  </div>
                </div>
                <Link to="/support" className="inline-flex items-center gap-2 text-primary text-sm font-bold border-b border-primary/20 hover:border-primary transition-all pb-1 ml-11">
                  Begin Conversation
                  <Icon name="arrow_forward" className="text-sm" />
                </Link>
              </div>
              <div className="group">
                <div className="flex items-start gap-4 mb-4">
                  <Icon name="alternate_email" className="text-secondary text-3xl" />
                  <div>
                    <h3 className="text-xl font-noto-serif text-primary mb-1">Direct Correspondence</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      For detailed requests and wholesale inquiries.<br/>
                      <a className="text-on-surface font-semibold hover:text-secondary transition-colors" href="mailto:concierge@heritagecurator.com">concierge@heritagecurator.com</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="flex items-start gap-4 mb-4">
                  <Icon name="location_on" className="text-secondary text-3xl" />
                  <div>
                    <h3 className="text-xl font-noto-serif text-primary mb-1">The Physical Sanctuary</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                      Experience the ritual in person at our flagship apothecary.<br/>
                      <span className="text-on-surface italic">No. 42, Galle Face Court II, Colombo 03, Sri Lanka.</span>
                    </p>
                    <div className="w-full h-40 rounded-lg overflow-hidden bg-surface-container-highest">
                      <img className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" alt="Map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF4YoR9lcEyHiSKLKSu16cf5qgVgNeqG6zRwkz6HonydDM0ib9QsYNFR7AjvVXrQd0Pz_ck3SUSdzIzxMOx_rtg6fLEsuRxTLp2r1qbONAh8m5-3ttaATNezmTR9eHaISaRIrFwM07Y5aORn69ebBFrA-_nR2v525gWlw2R6u9Jz4C65w2y0gXDKhPwpIIs8YznFambeVN6JEi-Npvv2bSsK_Leug_t6Y_Ht-3HSpj2EXEoHl9EzDo3Pz-H12k9hnsgnXNDQ9-1hqw" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Archives */}
            <div className="border-t border-outline-variant/15 pt-12">
              <h4 className="text-xs font-manrope uppercase tracking-[0.3em] text-on-surface-variant mb-6">Visual Chronicles</h4>
              <div className="flex gap-12">
                <Link to="/support" className="group flex items-center gap-3">
                  <Icon name="photo_library" className="text-primary group-hover:text-secondary transition-colors" />
                  <span className="text-sm font-manrope uppercase tracking-widest text-on-surface hover:text-secondary transition-colors">Instagram</span>
                </Link>
                <Link to="/support" className="group flex items-center gap-3">
                  <Icon name="bookmarks" className="text-primary group-hover:text-secondary transition-colors" />
                  <span className="text-sm font-manrope uppercase tracking-widest text-on-surface hover:text-secondary transition-colors">Pinterest</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Trust */}
        <section className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-8">
              {/* Stamp Badge */}
              <div className="w-24 h-24 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full text-tertiary-container animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                  <path d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" id="circlePath"></path>
                  <text className="text-[8px] uppercase tracking-[0.1em] fill-on-primary">
                    <textPath href="#circlePath">Authenticity Guaranteed • Handcrafted Heritage •</textPath>
                  </text>
                </svg>
                <Icon name="verified" filled className="text-on-primary-container text-4xl" />
              </div>
            </div>
            <h3 className="text-2xl font-noto-serif text-primary mb-4 italic">Respecting the Ritual</h3>
            <p className="max-w-xl text-on-surface-variant text-sm font-manrope leading-relaxed">
              Every formulation and artifact is curated with meticulous attention to Sri Lankan heritage. We ensure that your journey with us is as authentic as the traditions we preserve.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-[#f1eee5] flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8">
        <div className="font-noto-serif text-lg font-semibold text-[#1c1c17]">The Heritage Curator</div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link to="/support" className="font-manrope text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-[#D2691E] transition-colors duration-300">Privacy Policy</Link>
          <Link to="/support" className="font-manrope text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-[#D2691E] transition-colors duration-300">Terms of Service</Link>
          <Link to="/support" className="font-manrope text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-[#D2691E] transition-colors duration-300">Shipping & Returns</Link>
          <Link to="/support" className="font-manrope text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-[#D2691E] transition-colors duration-300">Wholesale</Link>
        </div>
        <div className="font-manrope text-xs uppercase tracking-[0.2em] text-[#2A5D5D] text-center md:text-right">
          © 2024 The Heritage Curator. Handcrafted in Sri Lanka.
        </div>
      </footer>
    </div>
  );
}
