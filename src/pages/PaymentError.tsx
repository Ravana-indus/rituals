import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function PaymentError() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-8 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Status Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-tertiary-container/10 mb-8">
            <Icon name="error_outline" className="text-tertiary-container text-4xl" />
          </div>
          <h1 className="font-noto-serif text-4xl md:text-5xl text-primary mb-4">Your Ritual Encountered a Slight Delay</h1>
          <p className="font-manrope text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            The essence of our apothecary rituals is patience, but we want to ensure your curation arrives without further pause. Your payment could not be processed at this time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left Column: Actions & Reassurance */}
          <div className="md:col-span-7 space-y-10">
            <section className="bg-surface-container-low p-8 rounded-xl">
              <h2 className="font-noto-serif text-2xl text-primary mb-6">Secure Your Selection</h2>
              <div className="flex flex-col gap-4">
                <Link to="/checkout" className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Icon name="refresh" className="text-xl" />
                  Retry Payment
                </Link>
                <Link to="/checkout" className="w-full py-4 bg-secondary text-on-secondary font-bold rounded-lg tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Icon name="credit_card" className="text-xl" />
                  Change Payment Method
                </Link>
              </div>

              <div className="mt-8 flex items-start gap-4 p-4 bg-surface-container-high/50 rounded-lg">
                <Icon name="verified_user" filled className="text-primary-container" />
                <div>
                  <p className="font-manrope text-sm font-bold text-on-surface">Data Security Guaranteed</p>
                  <p className="font-manrope text-xs text-on-surface-variant">Your transaction is encrypted with bank-level 256-bit SSL protocols. Your financial details never touch our servers.</p>
                </div>
              </div>
            </section>

            {/* Help Section */}
            <section className="border-l-4 border-outline-variant/30 pl-8 py-2">
              <h3 className="font-noto-serif text-xl text-primary mb-3">Need Assistance?</h3>
              <p className="text-on-surface-variant mb-6 italic">Our heritage consultants are standing by to help you complete your ritual.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <a href="mailto:support@heritagecurator.com" className="flex items-center gap-3 text-primary hover:underline">
                  <Icon name="mail" />
                  <span className="font-manrope uppercase tracking-widest text-xs">Email Concierge</span>
                </a>
                <Link to="/contact" className="flex items-center gap-3 text-primary hover:underline">
                  <Icon name="chat_bubble" />
                  <span className="font-manrope uppercase tracking-widest text-xs">Live Chat Ritual</span>
                </Link>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="md:col-span-5">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(28,28,23,0.06)] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBles08RjmWYblVXnIn6WzBITmqxsoUqfieGEUUUMLbPSWgCels7To4Sqm1R7Bj0p8-EtxKZiOjgicLeuej0dxxgyfWa4E1ZhNKVkhDKpHz52CIL1PORypS2P8-ljjw0g5nNZM6lyRZUDE_80_1dmUVzzM1ouMy6B0reChagBnyGNOKDFiHUZV2eZtv2PsBAMcmqb9JM9ninH8NC6gGUS1VhJh8Q_5xx6YbXLLRjkFLG94Ic_kZFbCtbuO0DGEgzeIiBgGBBpOfd28Z')" }}></div>
              
              <h2 className="font-noto-serif text-xl text-primary mb-8 border-b border-outline-variant/15 pb-4">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 overflow-hidden">
                    <img className="w-full h-full object-cover mix-blend-multiply" alt="Island Vetiver Infusion" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK_gGqQpaCjfCbaR8Ssh0L5YPoskJAMRIa-wSP1sGtJEal0L5BoWH28IkFoQjJj9hP--7LQQnT5_Caikpx8aCNj3FDa57ZXiJIpm45QhxrqarGKf4F2YpGViG17Gfybvj91Pa1hX9slaUoaMG_QUU5c2IsSFlzidt8huCivzc74CF3Vymd3rTFQKsiZrtz5MQ96c6pRr_oj6Zuc4dOqUHWswn4vWScAo7yCfSYR520c45dvHzGp8BAGN4alqOOS--NjQcdvWVTVCpn" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-noto-serif text-sm font-bold">Island Vetiver Infusion</p>
                    <p className="font-manrope text-xs text-on-surface-variant">Ritual Oil • 50ml</p>
                  </div>
                  <p className="font-manrope font-bold text-sm">LKR 4,200</p>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 overflow-hidden">
                    <img className="w-full h-full object-cover mix-blend-multiply" alt="Hand-Loomed Spa Cloth" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-lQfQITfEGaWMK_Y9lmvMbteUdGXlCwVtW_G5Cwdx8UTfpkxnpt_MuS8gI5PkEIeA3oCdgVk6JOvlCp8JWM3ONDCfmTkpHgx0YNn890nAafm7drnDNpPM17y3MAaun32HWotf7Ul0fmseSLBfHyYpZYD3IQL0ORIEwOyX9LTeAKtJ7QaJEG9GQnTHMKC0fLEGNEP1XUjSyNetpSBm0OcF4Qgg0To63naDsRuEgOLXp9788Ny2KNaUnHw0psozUBA6IlDnFAPYW-mi" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-noto-serif text-sm font-bold">Hand-Loomed Spa Cloth</p>
                    <p className="font-manrope text-xs text-on-surface-variant">Terracotta • Set of 2</p>
                  </div>
                  <p className="font-manrope font-bold text-sm">LKR 1,850</p>
                </div>
              </div>

              <div className="bg-secondary-fixed/30 p-4 rounded-lg mb-8 relative">
                <div className="flex items-center gap-2 text-on-secondary-fixed-variant mb-2">
                  <Icon name="stars" filled className="text-sm" />
                  <p className="font-manrope text-[10px] uppercase tracking-widest font-bold">Limited Offering</p>
                </div>
                <p className="font-manrope text-sm leading-snug">
                  Complete your purchase now to secure <span className="font-bold text-secondary">LKR 1,200</span> in Curated Savings.
                </p>
                <div className="absolute -top-3 -right-3 rotate-12 bg-tertiary-container text-on-tertiary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter" style={{ clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }}>
                  Clearance
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant/15">
                <div className="flex justify-between font-manrope text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>LKR 6,050</span>
                </div>
                <div className="flex justify-between font-manrope text-sm text-secondary">
                  <span>Heritage Discount</span>
                  <span>- LKR 1,200</span>
                </div>
                <div className="flex justify-between font-manrope text-lg font-bold text-primary pt-2">
                  <span>Total</span>
                  <span>LKR 4,850</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#c1c8c7]/15 bg-[#f1eee5] dark:bg-stone-950 flex flex-col md:flex-row justify-between items-center px-8 py-12 mt-auto">
        <div className="font-noto-serif italic text-stone-800 dark:text-stone-200 mb-6 md:mb-0">
          The Heritage Curator
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
          <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-[#D2691E] dark:hover:text-orange-400 transition-colors">Privacy Policy</Link>
          <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-[#D2691E] dark:hover:text-orange-400 transition-colors">Terms of Service</Link>
          <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-[#D2691E] dark:hover:text-orange-400 transition-colors">Shipping & Returns</Link>
          <Link to="/contact" className="font-manrope text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-[#D2691E] dark:hover:text-orange-400 transition-colors">Contact Us</Link>
        </div>
        <div className="font-manrope text-[10px] uppercase tracking-widest text-stone-400">
          © 2024 The Heritage Curator. High-End Apothecary & Rituals.
        </div>
      </footer>
    </div>
  );
}
