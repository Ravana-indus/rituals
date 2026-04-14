import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

type Message = { role: 'curator' | 'seeker'; content: string };

const CONDITION_CHIPS: { label: string; icon: string }[] = [
  { label: 'Dry Skin', icon: 'water_drop' },
  { label: 'Stress', icon: 'spa' },
  { label: 'Hair Loss', icon: 'content_cut' },
  { label: 'Hyper-pigmentation', icon: 'wb_sunny' },
  { label: 'Insomnia', icon: 'bedtime' },
  { label: 'Oily Scalp', icon: 'opacity' },
];

const INITIAL_MESSAGES: Message[] = [
  { role: 'curator', content: 'Ayubowan. I am the Apothecary\'s Curator — here to listen to your skin, your breath, and your rhythm. How are you feeling today?' },
  { role: 'curator', content: 'To heal the flower, one must understand the soil. Tell me, what elements of your being feel out of balance?' },
];

export default function Consult() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const sendMessage = () => {
    const text = inputValue.trim();
    const chips = selectedConditions.slice();
    if (!text && chips.length === 0) return;

    const userContent = [text, chips.length > 0 ? `Selected: ${chips.join(', ')}` : ''].filter(Boolean).join(' — ');
    setMessages(prev => [...prev, { role: 'seeker', content: userContent }]);
    setInputValue('');
    setSelectedConditions([]);
    setIsTyping(true);

    // Simulate a curator response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'curator',
          content: 'Thank you for sharing that. Based on what you\'ve described, I am beginning to see a pattern. Let me prepare a personalised ritual analysis for you — rooted in Ayurvedic tradition and refined for your unique needs.',
        },
      ]);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const adjustTextareaHeight = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfHnwCQOdAh-quvLEapn7MA132wVvOPjv5wdSn1tCpVepdfNoGZ39FMzaizRl04TfIMwccIQSalrB4g3JJar9qBZNvLu4lZa6GBH10rlsQJHELc3Id5sufOiQUT8rsVqLfHIZMVH6yuHxFZLSeB60ZwiukQN1uQW1ywetlWYowwCyRc0F_YLBXXVOnbakdphqKUPV6ZhCdX5HALTxx6iB1mKXZU7Nb8jHADczjJp_Zt1UslUHBJQPOwq8haPmlCDjfDu1ewQbPAI7n')" }}></div>

      <div className="relative z-10 flex flex-col h-screen">
        <Header />

        <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full px-0 lg:px-6 gap-0 lg:gap-8 lg:py-6">

          {/* ── Chat Column ── */}
          <section className="flex flex-col flex-1 min-w-0 bg-surface lg:bg-surface-container-low lg:rounded-2xl overflow-hidden">

            {/* Chat header bar */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-outline-variant/15 bg-surface-container-low lg:bg-surface-container flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
                <Icon name="psychiatry" filled className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-noto-serif font-bold text-on-surface leading-tight">The Apothecary's Curator</p>
                <p className="text-xs text-on-surface-variant font-manrope">Digital Consultation · Ayurvedic Wisdom</p>
              </div>
              <span className="bg-tertiary-container text-on-tertiary-container text-xs font-bold tracking-[0.15em] px-3 py-1 rounded-full uppercase hidden sm:block">Live</span>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 no-scrollbar">
              {messages.map((msg, i) => (
                msg.role === 'curator' ? (
                  /* Curator bubble – left aligned */
                  <div key={i} className="flex gap-3 items-end max-w-2xl">
                    <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-on-primary mb-1">
                      <Icon name="psychiatry" filled className="text-base" />
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/10 px-5 py-4 rounded-t-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md shadow-sm">
                      <p className="text-on-surface leading-relaxed italic font-noto-serif text-sm md:text-base">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  /* Seeker bubble – right aligned */
                  <div key={i} className="flex gap-3 items-end justify-end max-w-2xl ml-auto">
                    <div className="bg-primary px-5 py-4 rounded-t-2xl rounded-tl-2xl rounded-bl-2xl rounded-br-md shadow-sm">
                      <p className="text-on-primary leading-relaxed font-manrope text-sm md:text-base">{msg.content}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center text-on-surface-variant mb-1 border border-outline-variant/20">
                      <Icon name="person" className="text-base" />
                    </div>
                  </div>
                )
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 items-end max-w-2xl">
                  <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-on-primary mb-1">
                    <Icon name="psychiatry" filled className="text-base" />
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/10 px-5 py-4 rounded-t-2xl rounded-br-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input dock ── */}
            <div className="flex-shrink-0 border-t border-outline-variant/15 bg-surface-container-low lg:bg-surface-container px-4 md:px-6 pt-3 pb-4 md:pb-5">
              {/* Condition chips */}
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                {CONDITION_CHIPS.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => toggleCondition(label)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedConditions.includes(label)
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface text-on-surface-variant border-outline-variant/40 hover:border-primary/60 hover:text-primary'
                    }`}
                  >
                    <Icon name={icon} filled={selectedConditions.includes(label)} className="text-xs" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Textarea + send */}
              <div className="flex gap-3 items-end">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={e => { setInputValue(e.target.value); adjustTextareaHeight(e.target); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your concern — as you would to a trusted friend…"
                  rows={1}
                  className="flex-1 resize-none bg-surface rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary/60 transition-colors text-on-surface placeholder:text-outline/60 px-4 py-3 font-noto-serif text-sm italic leading-relaxed overflow-hidden"
                  style={{ minHeight: '48px', maxHeight: '160px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() && selectedConditions.length === 0}
                  className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                  aria-label="Send message"
                >
                  <Icon name="send" filled className="text-xl" />
                </button>
              </div>
              <p className="text-xs text-on-surface/30 font-manrope mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </section>

          {/* ── Right sidebar ── */}
          <aside className="hidden lg:flex flex-col w-80 xl:w-96 flex-shrink-0 space-y-6 overflow-y-auto no-scrollbar">

            {/* Past Journeys */}
            <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-noto-serif font-bold text-lg">Past Journeys</h3>
                <Icon name="history_edu" className="text-primary" />
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-surface-container-lowest rounded-xl border-l-4 border-secondary transition-transform hover:-translate-x-1 cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">March 14, 2024</span>
                    <span className="bg-secondary-fixed px-2 py-0.5 rounded text-xs font-bold text-on-secondary-fixed">RESOLVED</span>
                  </div>
                  <p className="font-noto-serif text-sm font-semibold mt-1">The Monsoon Skin Rescue</p>
                  <p className="text-xs text-on-surface-variant mt-1 italic">Prescribed: Sandalwood & Honey Paste</p>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border-l-4 border-primary transition-transform hover:-translate-x-1 cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Feb 28, 2024</span>
                    <span className="bg-primary-fixed px-2 py-0.5 rounded text-xs font-bold text-on-primary-fixed">ONGOING</span>
                  </div>
                  <p className="font-noto-serif text-sm font-semibold mt-1">Scalp Vitality Ritual</p>
                  <p className="text-xs text-on-surface-variant mt-1 italic">Prescribed: Gotu Kola Infusion</p>
                </div>
              </div>
              <button className="w-full mt-5 text-center text-primary/60 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                VIEW COMPLETE ARCHIVE
              </button>
            </div>

            {/* Curator's Tip */}
            <div className="relative rounded-2xl overflow-hidden min-h-[340px] flex flex-col justify-end">
              <img
                alt="Traditional botanical herbs"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgsDGHA0LFDWT73Z6Yjj6-n6Y0vV48a2EdcuPsgthhGKghIrECnLKWEfvTxX_wRMQuk7CYbGfdBwAmPd_rYpBJNCKlEymu7m_oCneS2yt8YUnQ4jytqxF9Q5Dk0Ks0nAGGuBshHIxDWdWHqZ6XpXZGBFWsgea6xCpY8VdKpAfjjRTNGc2cLwCsia-RV_MnOm9YwSdfKHurrhRkhE8FdZGyb_EqkY8Dzw0wU6pSxcY2bMCdboNial45JRjq4Ejb3c86tTfJUObwoeq9"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent"></div>
              <div className="relative z-10 text-on-primary p-7">
                <span className="font-noto-serif italic text-base text-primary-fixed">Wisdom of the Week</span>
                <h4 className="text-xl font-noto-serif font-bold mt-2">The Cooling Spirit of Vetiver</h4>
                <p className="text-sm mt-3 font-manrope opacity-90 leading-relaxed">
                  "When the mind burns with anxiety, the earth provides its roots. Vetiver calms the fire within."
                </p>
                <button className="mt-5 border border-white/30 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-all">
                  Discover More
                </button>
              </div>
            </div>

            {/* Begin Ritual Analysis CTA */}
            <Link
              to="/"
              className="block w-full text-center bg-secondary text-on-secondary px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg"
            >
              Begin Ritual Analysis
            </Link>
          </aside>
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-surface z-50 rounded-t-3xl shadow-[0_-10px_30px_rgba(28,28,23,0.06)] border-t border-outline-variant/15">
          <Link to="/consult" className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-xl min-w-[64px] min-h-[44px] px-3 py-2">
            <Icon name="chat_bubble" filled />
            <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Consult</span>
          </Link>
          <Link to="/ritual-builder" className="flex flex-col items-center justify-center text-on-surface/40 min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-surface-container transition-all rounded-xl">
            <Icon name="auto_awesome" />
            <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Rituals</span>
          </Link>
          <Link to="/ritual-builder" className="flex flex-col items-center justify-center text-on-surface/40 min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-surface-container transition-all rounded-xl">
            <Icon name="auto_stories" />
            <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Stories</span>
          </Link>
          <Link to="/" className="flex flex-col items-center justify-center text-on-surface/40 min-w-[64px] min-h-[44px] px-3 py-2 hover:bg-surface-container transition-all rounded-xl">
            <Icon name="local_pharmacy" />
            <span className="font-manrope text-xs font-bold uppercase tracking-widest mt-1">Shop</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
