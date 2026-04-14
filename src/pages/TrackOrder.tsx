import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../lib/api';
import { formatPriceCents } from '../types/database';
import type { Order } from '../types/database';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'bg-secondary-fixed/20 text-secondary' },
    confirmed: { label: 'Confirmed', color: 'bg-primary/20 text-primary' },
    processing: { label: 'Processing', color: 'bg-primary/20 text-primary' },
    shipped: { label: 'Shipped', color: 'bg-secondary-fixed/20 text-secondary' },
    delivered: { label: 'Delivered', color: 'bg-green-600/20 text-green-700 ' },
    cancelled: { label: 'Cancelled', color: 'bg-error/20 text-error' },
    refunded: { label: 'Refunded', color: 'bg-error/20 text-error' },
  };
  const { label, color } = map[status] ?? { label: status, color: 'bg-surface-container text-on-surface-variant' };
  return React.createElement('span', {
    className: `inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-tighter ${color}`,
    style: { clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }
  }, label);
}

function TimelineItem({ label, description, date, done, current }: { label: string; description: string; date?: string; done?: boolean; current?: boolean }) {
  return React.createElement('div', { className: 'relative pl-12 flex items-start gap-4' },
    React.createElement('div', {
      className: `absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-lg ${
        done ? 'bg-primary' : current ? 'bg-secondary-fixed animate-pulse' : 'bg-surface-container-highest border-2 border-outline-variant/20'
      }`
    },
      done && React.createElement(Icon, { name: "check", filled: true, className: "text-on-primary text-sm" }),
      current && React.createElement(Icon, { name: "local_shipping", filled: true, className: "text-on-secondary-fixed text-sm" }),
      !done && !current && React.createElement(Icon, { name: "radio_button_unchecked", className: "text-outline text-sm" })
    ),
    React.createElement('div', { className: done || current ? '' : 'opacity-50' },
      React.createElement('h4', { className: `font-bold text-sm uppercase tracking-wide ${done || current ? 'text-primary' : 'text-on-surface-variant'}` }, label),
      React.createElement('p', { className: 'text-xs text-on-surface-variant mt-1 italic' }, description),
      date && React.createElement('span', { className: 'text-xs text-outline mt-2 block' }, date)
    )
  );
}

function OrderResultCard({ order }: { order: Order }) {
  const steps = [
    { key: 'pending', label: 'Ritual Prepared', description: 'Items curated in our Galle Fort apothecary.', done: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) },
    { key: 'confirmed', label: 'Confirmed', description: 'Order confirmed and payment verified.', done: ['processing', 'shipped', 'delivered'].includes(order.status), current: order.status === 'confirmed' },
    { key: 'processing', label: 'Processing', description: 'Being carefully packed for delivery.', done: ['shipped', 'delivered'].includes(order.status), current: order.status === 'processing' },
    { key: 'shipped', label: 'Journey Begun', description: 'Entrusted to our artisan logistics network.', done: order.status === 'delivered', current: order.status === 'shipped' },
    { key: 'delivered', label: 'Arriving at Sanctuary', description: 'Expected within 48 hours of dispatch.', done: order.status === 'delivered', current: order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing' },
  ];

  return React.createElement('div', { className: 'bg-surface-container-low p-8 rounded-xl shadow-sm border border-outline-variant/15 mb-8' },
    React.createElement('div', { className: 'flex flex-col md:flex-row md:justify-between gap-4 mb-6' },
      React.createElement('div', null,
        React.createElement('p', { className: 'text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1' }, 'Order Reference'),
        React.createElement('p', { className: 'text-xl font-bold font-noto-serif text-primary' }, order.order_number ?? 'N/A')
      ),
      React.createElement('div', { className: 'text-right' },
        React.createElement('p', { className: 'text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1' }, 'Order Total'),
        React.createElement('p', { className: 'text-xl font-bold text-secondary' }, formatPriceCents(order.total_cents)),
        React.createElement('div', { className: 'mt-1' },
          React.createElement(OrderStatusBadge, { status: order.status })
        )
      )
    ),
    React.createElement('div', { className: 'relative' },
      React.createElement('div', { className: 'absolute left-4 top-0 bottom-0 w-[2px] bg-outline-variant/20' }),
      React.createElement('div', { className: 'space-y-12' },
        ...steps.map(step => React.createElement(TimelineItem, {
          key: step.key,
          label: step.label,
          description: step.description,
          date: step.done || step.current ? new Date(order.created_at ?? '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
          done: step.done,
          current: step.current
        }))
      )
    )
  );
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<Order[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() && !email.trim()) {
      setError('Please enter an order number or email address.');
      return;
    }
    setSearching(true);
    setError(null);
    setHasSearched(true);
    try {
      const found: Order[] = [];
      if (orderNumber.trim()) {
        const byNumber = await api.orders.getByNumber(orderNumber.trim());
        if (byNumber) found.push(byNumber);
      }
      if (email.trim()) {
        const byEmail = await api.orders.getByEmail(email.trim());
        byEmail.forEach(o => { if (!found.some(r => r.id === o.id)) found.push(o); });
      }
      setResults(found);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col relative">
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-5" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHr5znIqrNIUwpABtqC4sH0HmEbneboSw7S95jp_Ln5B-ENqFwUAYxGPsA46q0LyWgvrsltKwK2UvqDCOS4Bo8NGCJkEC1hKDRKcQxGfAHETaaHqDNpc8tMMUzFXBp8HgufJjGIc_tvD7zDYEMnerlH-m0pQv1ycLYjI8gVnI3DWjWsRGtnueTjKEMnDmGdamrqIOL-p7II9j3x6ciTpc0PzKK_ie8HA_KaaZhQHBX9kc-ZHMf3_-czNx3Wq_qJcq_-H5imB1CuG9L')" }}></div>
      
      <Header />

      <main className="pt-8 pb-20 px-6 max-w-6xl mx-auto flex-grow w-full">
        <header className="mb-16 text-center">
          <h1 className="font-noto-serif text-4xl lg:text-5xl lg:text-6xl text-primary mb-4 italic tracking-tight">Trace Your Ritual</h1>
          <p className="font-manrope text-on-surface-variant max-w-xl mx-auto leading-relaxed">Each heritage artifact travels with intent. Enter your details below to follow the journey from our apothecary to your sanctuary.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <section className="lg:col-span-5 bg-surface-container-low p-8 rounded-xl shadow-sm border border-outline-variant/15">
            <div className="mb-8">
              <h2 className="font-noto-serif text-xl text-primary mb-2">Identification</h2>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">Verify your journey</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-manrope text-sm font-semibold mb-2 text-on-surface/80">Ritual Tracking Number</label>
                <input
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  className="w-full bg-surface py-3 px-4 border-b-2 border-surface-variant focus:border-primary focus:ring-0 transition-all outline-none text-on-surface font-medium placeholder:text-outline-variant"
                  placeholder="e.g. HC-9928-102"
                  type="text"
                />
              </div>
              <div className="text-center text-xs text-outline-variant my-2">— or —</div>
              <div>
                <label className="block font-manrope text-sm font-semibold mb-2 text-on-surface/80">Email Identity</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface py-3 px-4 border-b-2 border-surface-variant focus:border-primary focus:ring-0 transition-all outline-none text-on-surface font-medium placeholder:text-outline-variant"
                  placeholder="ritualist@example.com"
                  type="email"
                />
              </div>
              {error && React.createElement('p', { className: 'text-sm text-error font-medium' }, error)}
              <button
                disabled={searching}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-lg font-bold tracking-wide hover:opacity-95 transition-opacity flex justify-center items-center gap-2 group disabled:opacity-60"
                type="submit"
              >
                {searching ? 'Searching...' : 'Begin Search'}
                {!searching && React.createElement(Icon, { name: "arrow_right_alt", className: "text-xl group-hover:translate-x-1 transition-transform" })}
              </button>
            </form>
            <div className="mt-12 pt-8 border-t border-outline-variant/15 text-center">
              <div className="inline-flex items-center gap-3 bg-secondary-fixed/30 px-6 py-3 rounded-full mb-4">
                <Icon name="verified" filled className="text-secondary" />
                <span className="text-on-secondary-fixed font-bold text-xs uppercase tracking-tighter">Authenticity Guaranteed</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">Every item in your delivery is ethically sourced, hand-curated, and certified authentic by our curators.</p>
            </div>
          </section>

          <section className="lg:col-span-7 flex flex-col gap-8">
            {!hasSearched ? (
              React.createElement('div', { className: 'bg-surface-container rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(28,28,23,0.06)] relative aspect-video md:aspect-[16/10]' },
                React.createElement('img', {
                  alt: 'Delivery Journey',
                  className: 'w-full h-full object-cover grayscale-[20%] opacity-90',
                  src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBygVHnI10wU7ThMDc58oxYzh-vqKGCZukW1N34r0-AB_KZQ4WMpY4PiFK-8h5U1h7PW30GWzSev2SLgIcTETNqRrUQ1taJf6MUPfddKFJxksMLlctWntRFoVNFRGQUQAJn1aANdiUZGQO9cQPPQtuMYz9vtY3ZbLF2CnuFIXCuiFoRL1R7AHJYXHEDyDyMaCL3sVo-CxHFxHJT4mD3WiPnHsvhD8U5SmMgDQH64w2t_covm_3YiT9I_ElONA_8uCe_4f6aW3_wUEqg'
                }),
                React.createElement('div', { className: 'absolute inset-0 bg-primary/5 mix-blend-multiply' }),
                React.createElement('div', { className: 'absolute top-6 left-6 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-3' },
                  React.createElement('div', { className: 'w-3 h-3 bg-secondary rounded-full animate-pulse' }),
                  React.createElement('span', { className: 'text-xs font-bold text-primary uppercase tracking-widest' }, 'Awaiting Search')
                )
              )
            ) : searching ? (
              React.createElement('div', { className: 'bg-surface-container rounded-xl p-8 shadow-sm border border-outline-variant/15 text-center animate-pulse' },
                React.createElement(Icon, { name: "search", className: "text-5xl text-outline-variant mb-4" }),
                React.createElement('p', { className: 'text-on-surface-variant' }, 'Searching your ritual...')
              )
            ) : results.length === 0 ? (
              React.createElement('div', { className: 'bg-surface-container rounded-xl p-12 shadow-sm border border-outline-variant/15 text-center' },
                React.createElement(Icon, { name: "search_off", className: "text-6xl text-outline-variant mb-4" }),
                React.createElement('h3', { className: 'font-noto-serif text-xl font-bold text-primary mb-2' }, 'No Rituals Found'),
                React.createElement('p', { className: 'text-sm text-on-surface-variant mb-6 max-w-sm mx-auto' },
                  'We could not find any orders matching your details. Please check the order number or email and try again.'
                ),
                React.createElement('button', {
                  onClick: () => { setHasSearched(false); setError(null); },
                  className: 'bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity'
                }, 'Try Again')
              )
            ) : (
              React.createElement(React.Fragment, null,
                React.createElement('p', { className: 'text-sm font-bold text-primary mb-4' },
                  { plural: results.length, 1: '1 ritual found', default: `${results.length} rituals found` }[results.length] ?? `${results.length} rituals found`
                ),
                results.map(order => React.createElement(OrderResultCard, { key: order.id, order }))
              )
            )}
          </section>
        </div>
      </main>

      <footer className="bg-surface-container  w-full border-t border-outline-variant/15 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 max-w-screen-2xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="font-noto-serif text-lg font-bold text-primary ">Heritage Curator</div>
            <p className="font-manrope text-sm uppercase tracking-widest text-on-surface/60 ">© 2024 The Heritage Curator. Crafted with Intent.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Privacy Policy</Link>
            <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Terms of Service</Link>
            <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Shipping & Returns</Link>
            <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Wholesale</Link>
            <Link to="/contact" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
