import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function Consult() {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed relative">
      <div className="absolute inset-0 z-[60] opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfHnwCQOdAh-quvLEapn7MA132wVvOPjv5wdSn1tCpVepdfNoGZ39FMzaizRl04TfIMwccIQSalrB4g3JJar9qBZNvLu4lZa6GBH10rlsQJHELc3Id5sufOiQUT8rsVqLfHIZMVH6yuHxFZLSeB60ZwiukQN1uQW1ywetlWYowwCyRc0F_YLBXXVOnbakdphqKUPV6ZhCdX5HALTxx6iB1mKXZU7Nb8jHADczjJp_Zt1UslUHBJQPOwq8haPmlCDjfDu1ewQbPAI7n')" }}></div>
      
      <Header />

      <main className="flex-grow pt-8 pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left Column: Conversational Consultation */}
        <section className="lg:col-span-8 space-y-8">
          <header className="max-w-2xl">
            <span className="font-noto-serif italic text-primary text-xl mb-2 block">Ayubowan, Traveler</span>
            <h1 className="text-4xl lg:text-5xl font-noto-serif font-bold text-on-surface leading-tight">What brings you to the <span className="text-primary italic">Apothecary's Desk</span> today?</h1>
            <p className="mt-4 text-on-surface-variant font-manrope leading-relaxed max-w-xl">
              Describe your concerns as you would to an old friend. Our curator listens to the whispers of your skin and the rhythm of your wellness.
            </p>
          </header>

          <div className="bg-surface-container-low rounded-xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-tertiary-container text-on-tertiary-fixed-variant text-xs font-bold tracking-[0.2em] px-3 py-1 rounded-full uppercase">Digital Consultation</span>
            </div>
            <div className="space-y-8">
              {/* Master's Message */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-on-primary">
                  <Icon name="face" />
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] max-w-lg">
                  <p className="text-on-surface leading-relaxed italic font-noto-serif">"To heal the flower, one must understand the soil. Tell me, what elements of your being feel out of balance today?"</p>
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-6">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 block">Seeker's Observation</span>
                  <textarea className="w-full bg-surface border-none border-b-2 border-outline-variant/30 focus:ring-0 focus:border-primary transition-all text-on-surface placeholder:text-outline p-4 font-noto-serif text-lg italic rounded-t-lg" placeholder="e.g., My skin feels parched like the dry season winds..." rows={3}></textarea>
                </label>

                {/* Condition Selection Chips */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Common Imbalances</span>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleCondition('Dry Skin')}
                      className={`px-5 py-2.5 rounded-full border transition-all ${
                        selectedConditions.includes('Dry Skin')
                          ? 'bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed border-primary dark:border-primary-fixed shadow-sm'
                          : 'bg-surface-container-low dark:bg-[#1e1e1a] text-on-surface-variant dark:text-[#c1c8c7] border-primary/30 dark:border-primary-fixed/30 hover:border-primary dark:hover:border-primary-fixed'
                      }`}
                    >
                      <Icon name="water_drop" filled={selectedConditions.includes('Dry Skin')} className="text-sm" /> Dry Skin
                    </button>
                    <button
                      onClick={() => toggleCondition('Stress')}
                      className={`px-5 py-2.5 rounded-full border transition-all ${
                        selectedConditions.includes('Stress')
                          ? 'bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed border-primary dark:border-primary-fixed shadow-sm'
                          : 'bg-surface-container-low dark:bg-[#1e1e1a] text-on-surface-variant dark:text-[#c1c8c7] border-primary/30 dark:border-primary-fixed/30 hover:border-primary dark:hover:border-primary-fixed'
                      }`}
                    >
                      <Icon name="spa" filled={selectedConditions.includes('Stress')} className="text-sm" /> Stress
                    </button>
                    <button
                      onClick={() => toggleCondition('Hair Loss')}
                      className={`px-5 py-2.5 rounded-full border transition-all ${
                        selectedConditions.includes('Hair Loss')
                          ? 'bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed border-primary dark:border-primary-fixed shadow-sm'
                          : 'bg-surface-container-low dark:bg-[#1e1e1a] text-on-surface-variant dark:text-[#c1c8c7] border-primary/30 dark:border-primary-fixed/30 hover:border-primary dark:hover:border-primary-fixed'
                      }`}
                    >
                      <Icon name="content_cut" filled={selectedConditions.includes('Hair Loss')} className="text-sm" /> Hair Loss
                    </button>
                    <button
                      onClick={() => toggleCondition('Hyper-pigmentation')}
                      className={`px-5 py-2.5 rounded-full border transition-all ${
                        selectedConditions.includes('Hyper-pigmentation')
                          ? 'bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed border-primary dark:border-primary-fixed shadow-sm'
                          : 'bg-surface-container-low dark:bg-[#1e1e1a] text-on-surface-variant dark:text-[#c1c8c7] border-primary/30 dark:border-primary-fixed/30 hover:border-primary dark:hover:border-primary-fixed'
                      }`}
                    >
                      <Icon name="wb_sunny" filled={selectedConditions.includes('Hyper-pigmentation')} className="text-sm" /> Hyper-pigmentation
                    </button>
                    <button
                      onClick={() => toggleCondition('Insomnia')}
                      className={`px-5 py-2.5 rounded-full border transition-all ${
                        selectedConditions.includes('Insomnia')
                          ? 'bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed border-primary dark:border-primary-fixed shadow-sm'
                          : 'bg-surface-container-low dark:bg-[#1e1e1a] text-on-surface-variant dark:text-[#c1c8c7] border-primary/30 dark:border-primary-fixed/30 hover:border-primary dark:hover:border-primary-fixed'
                      }`}
                    >
                      <Icon name="bedtime" filled={selectedConditions.includes('Insomnia')} className="text-sm" /> Insomnia
                    </button>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-6 flex justify-end">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center bg-secondary text-on-secondary px-10 py-4 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-on-secondary-fixed-variant transition-all shadow-xl hover:scale-105"
                  >
                    BEGIN RITUAL ANALYSIS {selectedConditions.length > 0 && `(${selectedConditions.length} selected)`}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Contextual History & Wisdom */}
        <aside className="lg:col-span-4 space-y-8">
          {/* User History Card */}
          <details className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 group md:block">
            <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <h3 className="font-noto-serif font-bold text-lg">Past Journeys</h3>
              <div className="flex items-center gap-2">
                <Icon name="history_edu" className="text-primary" />
                <Icon name="expand_more" className="text-primary md:hidden group-open:rotate-180 transition-transform" />
              </div>
            </summary>
            <div className="space-y-4 mt-6">
              <div className="p-4 bg-surface-container-lowest rounded-lg border-l-4 border-secondary transition-transform hover:-translate-x-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">March 14, 2024</span>
                  <span className="bg-secondary-fixed px-2 py-0.5 rounded text-xs font-bold text-on-secondary-fixed">RESOLVED</span>
                </div>
                <p className="font-noto-serif text-sm font-semibold">The Monsoon Skin Rescue</p>
                <p className="text-xs text-on-surface-variant mt-1 italic">Prescribed: Sandalwood & Honey Paste</p>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-lg border-l-4 border-primary transition-transform hover:-translate-x-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Feb 28, 2024</span>
                  <span className="bg-primary-fixed px-2 py-0.5 rounded text-xs font-bold text-on-primary-fixed">ONGOING</span>
                </div>
                <p className="font-noto-serif text-sm font-semibold">Scalp Vitality Ritual</p>
                <p className="text-xs text-on-surface-variant mt-1 italic">Prescribed: Gotu Kola Infusion</p>
              </div>
            </div>
            <button className="w-full mt-6 text-center text-primary/60 dark:text-white/60 text-xs font-bold uppercase tracking-widest hover:text-primary dark:hover:text-white transition-colors">
              VIEW COMPLETE ARCHIVE
            </button>
          </details>

          {/* The Curator's Tip */}
          <details className="md:block group">
            <summary className="flex md:hidden items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden bg-surface-container p-6 rounded-xl border border-outline-variant/10">
              <h3 className="font-noto-serif font-bold text-lg text-primary">Curator's Tip</h3>
              <Icon name="expand_more" className="text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="relative rounded-xl overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[400px] flex flex-col justify-end p-8 group hidden group-open:flex md:flex mt-4 md:mt-0">
            <img alt="Traditional botanical herbs" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgsDGHA0LFDWT73Z6Yjj6-n6Y0vV48a2EdcuPsgthhGKghIrECnLKWEfvTxX_wRMQuk7CYbGfdBwAmPd_rYpBJNCKlEymu7m_oCneS2yt8YUnQ4jytqxF9Q5Dk0Ks0nAGGuBshHIxDWdWHqZ6XpXZGBFWsgea6xCpY8VdKpAfjjRTNGc2cLwCsia-RV_MnOm9YwSdfKHurrhRkhE8FdZGyb_EqkY8Dzw0wU6pSxcY2bMCdboNial45JRjq4Ejb3c86tTfJUObwoeq9" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
            <div className="relative z-10 text-on-primary">
              <span className="font-noto-serif italic text-lg text-primary-fixed">Wisdom of the Week</span>
              <h4 className="text-2xl font-noto-serif font-bold mt-2">The Cooling Spirit of Vetiver</h4>
              <p className="text-sm mt-3 font-manrope opacity-90 leading-relaxed">
                "When the mind burns with anxiety, the earth provides its roots. Vetiver calms the fire within."
              </p>
              <button className="mt-6 border border-white/30 px-6 py-3 rounded-lg text-white/80 text-sm font-medium hover:bg-white/10 hover:text-white transition-all">
                Discover More
              </button>
            </div>
            </div>
          </details>
        </aside>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-[#fcf9f0] dark:bg-[#1c1c17] z-50 rounded-t-3xl shadow-[0_-10px_30px_rgba(28,28,23,0.04)] border-t border-[#c1c8c7]/15">
        <Link to="/consult" className="flex flex-col items-center justify-center bg-[#2A5D5D] text-white rounded-xl min-w-[64px] min-h-[44px] px-3 py-2 scale-95 transition-transform duration-500 ease-in-out">
          <Icon name="chat_bubble" />
          <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Consult</span>
        </Link>
        <Link to="/ritual-builder" className="flex flex-col items-center justify-center text-[#1c1c17]/40 dark:text-[#fcf9f0]/40 min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-[#f1eee5] dark:hover:bg-[#2A5D5D]/20 transition-all">
          <Icon name="auto_awesome" />
          <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Rituals</span>
        </Link>
        <Link to="/ritual-builder" className="flex flex-col items-center justify-center text-[#1c1c17]/40 dark:text-[#fcf9f0]/40 min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-[#f1eee5] dark:hover:bg-[#2A5D5D]/20 transition-all">
          <Icon name="auto_stories" />
          <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Stories</span>
        </Link>
        <Link to="/" className="flex flex-col items-center justify-center text-[#1c1c17]/40 dark:text-[#fcf9f0]/40 min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-[#f1eee5] dark:hover:bg-[#2A5D5D]/20 transition-all">
          <Icon name="local_pharmacy" />
          <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Shop</span>
        </Link>
      </nav>
    </div>
  );
}
