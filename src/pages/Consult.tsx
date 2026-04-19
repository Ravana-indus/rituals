import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  User,
  History,
  Sparkles,
  ChevronRight,
  Droplets,
  Zap,
  Info,
  Beaker,
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';

type Message = { role: 'curator' | 'seeker'; content: string };

const CONDITION_CHIPS: { label: string; icon: any }[] = [
  { label: 'Dry Skin', icon: Droplets },
  { label: 'Stress', icon: Sparkles },
  { label: 'Hair Loss', icon: Zap },
  { label: 'Hyper-pigmentation', icon: Zap },
  { label: 'Insomnia', icon: Sparkles },
  { label: 'Oily Scalp', icon: Droplets },
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

  return (
    <BrandedLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] overflow-hidden">
        {/* Chat Column */}
        <section className="flex flex-1 flex-col min-w-0 bg-white border-r border-[var(--dd-surface-strong)]">
          {/* Chat Header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-[var(--dd-surface-strong)] bg-white sticky top-0 z-10">
            <div className="h-10 w-10 rounded-full bg-[var(--dd-surface-base)] flex items-center justify-center text-white">
              <Beaker className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[16px] font-bold tracking-tight">The Apothecary's Curator</h2>
              <p className="text-[12px] opacity-40 font-bold uppercase tracking-wider">Digital Consultation</p>
            </div>
            <span className="rounded-full bg-[#76885B]/10 px-3 py-1 text-[11px] font-bold text-[#76885B] uppercase tracking-wider">Live</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 no-scrollbar bg-[var(--dd-surface-muted)]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 items-end ${msg.role === 'seeker' ? 'justify-end' : 'max-w-2xl'}`}>
                {msg.role === 'curator' && (
                  <div className="h-8 w-8 rounded-full bg-[var(--dd-surface-base)] flex-shrink-0 flex items-center justify-center text-white mb-1">
                    <Beaker className="h-4 w-4" />
                  </div>
                )}
                <div className={`px-5 py-4 rounded-2xl shadow-sm ${
                  msg.role === 'seeker' 
                    ? 'bg-[var(--dd-surface-base)] text-white rounded-br-md' 
                    : 'bg-white border border-[var(--dd-surface-strong)] rounded-bl-md'
                }`}>
                  <p className={`text-[15px] leading-relaxed ${msg.role === 'curator' ? 'italic font-medium' : 'font-medium'}`}>
                    {msg.content}
                  </p>
                </div>
                {msg.role === 'seeker' && (
                  <div className="h-8 w-8 rounded-full bg-[var(--dd-surface-strong)] flex-shrink-0 flex items-center justify-center text-black mb-1 border border-[var(--dd-surface-base)]/10">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-end max-w-2xl">
                <div className="h-8 w-8 rounded-full bg-[var(--dd-surface-base)] flex-shrink-0 flex items-center justify-center text-white mb-1">
                  <Beaker className="h-4 w-4" />
                </div>
                <div className="bg-white border border-[var(--dd-surface-strong)] px-5 py-4 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--dd-surface-base)]/20 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--dd-surface-base)]/20 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--dd-surface-base)]/20 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Dock */}
          <div className="border-t border-[var(--dd-surface-strong)] bg-white p-4 md:p-6">
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {CONDITION_CHIPS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => toggleCondition(label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedConditions.includes(label)
                      ? 'bg-[var(--dd-surface-base)] text-white border-[var(--dd-surface-base)] shadow-md'
                      : 'bg-white border-[var(--dd-surface-strong)] text-black hover:border-[var(--dd-surface-base)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-4 items-end max-w-4xl mx-auto">
              <div className="flex-1 relative flex items-center rounded-xl bg-[var(--dd-surface-muted)] border border-[var(--dd-surface-strong)] px-4 focus-within:border-[var(--dd-surface-base)] transition">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your concern as you would to a friend…"
                  rows={1}
                  className="w-full bg-transparent py-4 text-[14px] outline-none resize-none font-medium italic min-h-[56px] max-h-32"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() && selectedConditions.length === 0}
                className="h-14 w-14 rounded-xl bg-[var(--dd-surface-base)] text-white flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all disabled:opacity-20 shadow-lg"
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-30 mt-3 text-center">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </section>

        {/* Info Sidebar */}
        <aside className="hidden lg:flex flex-col w-96 flex-shrink-0 bg-white p-8 space-y-8 overflow-y-auto no-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-bold tracking-tight">Past Journeys</h3>
              <History className="h-5 w-5 opacity-40" />
            </div>
            <div className="space-y-4">
              <JourneyCard 
                date="March 14, 2024" 
                title="The Monsoon Skin Rescue" 
                status="Resolved"
                treatment="Sandalwood & Honey Paste"
              />
              <JourneyCard 
                date="Feb 28, 2024" 
                title="Scalp Vitality Ritual" 
                status="Ongoing"
                treatment="Gotu Kola Infusion"
                active
              />
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgsDGHA0LFDWT73Z6Yjj6-n6Y0vV48a2EdcuPsgthhGKghIrECnLKWEfvTxX_wRMQuk7CYbGfdBwAmPd_rYpBJNCKlEymu7m_oCneS2yt8YUnQ4jytqxF9Q5Dk0Ks0nAGGuBshHIxDWdWHqZ6XpXZGBFWsgea6xCpY8VdKpAfjjRTNGc2cLwCsia-RV_MnOm9YwSdfKHurrhRkhE8FdZGyb_EqkY8Dzw0wU6pSxcY2bMCdboNial45JRjq4Ejb3c86tTfJUObwoeq9"
              alt="Botanicals"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">Wisdom of the Week</span>
              <h4 className="text-[20px] font-bold leading-tight mt-2">The Cooling Spirit of Vetiver</h4>
              <p className="mt-3 text-[13px] opacity-80 leading-relaxed font-medium">
                "When the mind burns with anxiety, the earth provides its roots. Vetiver calms the fire within."
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] text-white text-[14px] font-bold shadow-lg transition hover:opacity-90 active:scale-[0.98]"
          >
            Explore apothecary
            <ChevronRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </BrandedLayout>
  );
}

function JourneyCard({ date, title, status, treatment, active }: any) {
  return (
    <div className={`p-5 rounded-[var(--dd-radius-xs)] border transition-all cursor-pointer hover:shadow-md ${
      active ? 'border-[var(--dd-surface-base)] ring-1 ring-[var(--dd-surface-base)]' : 'border-[var(--dd-surface-strong)] bg-white'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">{date}</span>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
          active ? 'bg-[var(--dd-surface-base)] text-white' : 'bg-[var(--dd-surface-strong)] text-black'
        }`}>{status}</span>
      </div>
      <h4 className="text-[15px] font-bold tracking-tight">{title}</h4>
      <p className="text-[12px] opacity-60 mt-1 font-medium italic">Prescribed: {treatment}</p>
    </div>
  );
}
