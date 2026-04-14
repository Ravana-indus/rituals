import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../lib/api';
import { formatPriceCents } from '../types/database';
import type { Order, OrderItem, Address } from '../types/database';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

type OrderWithDetails = Order & { items: OrderItem[]; shipping_address: Address | null; billing_address: Address | null };

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'bg-secondary-fixed/20 text-secondary' },
    confirmed: { label: 'Confirmed', color: 'bg-primary/20 text-primary' },
    processing: { label: 'Processing', color: 'bg-primary/20 text-primary' },
    shipped: { label: 'Shipped', color: 'bg-secondary-fixed/20 text-secondary' },
    delivered: { label: 'Ritual Complete', color: 'bg-green-600/20 text-green-700 ' },
    cancelled: { label: 'Cancelled', color: 'bg-error/20 text-error' },
    refunded: { label: 'Refunded', color: 'bg-error/20 text-error' },
  };
  const { label, color } = map[status] ?? { label: status, color: 'bg-surface-container text-on-surface-variant' };
  return React.createElement('span', {
    className: `inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-tighter ${color}`,
    style: { clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }
  }, label);
}

export default function OrderConfirmed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided.');
      setLoading(false);
      return;
    }
    async function load() {
      setLoading(true);
      try {
        const data = await api.orders.getById(orderId);
        if (!data) {
          setError('Order not found.');
        } else {
          setOrder(data as OrderWithDetails);
        }
      } catch (e) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <Header />
        <main className="flex-grow pt-8 pb-20 px-6 max-w-5xl mx-auto w-full">
          <div className="text-center mb-16 animate-pulse">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-low mb-6" />
            <div className="h-10 bg-surface-container-low rounded w-full max-w-xs mx-auto mb-4" />
            <div className="h-5 bg-surface-container-low rounded w-full max-w-sm mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-surface-container-low p-8 rounded-xl animate-pulse">
                <div className="h-6 bg-surface-container-high rounded w-1/3 mb-4" />
                <div className="h-4 bg-surface-container-high rounded w-1/2" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <Header />
        <main className="flex-grow pt-8 pb-20 px-6 max-w-5xl mx-auto w-full flex flex-col items-center justify-center">
          <Icon name="error_outline" className="text-6xl text-secondary mb-4" />
          <h1 className="text-3xl font-bold font-noto-serif text-primary mb-4">Order Not Found</h1>
          <p className="text-on-surface-variant mb-8 text-center">{error ?? 'We could not find your order details.'}</p>
          <Link to="/" className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
            Continue Shopping
          </Link>
        </main>
      </div>
    );
  }

  const shippingAddr = order.shipping_address;
  const shippingCost = order.shipping_cents ?? 0;
  const discount = order.discount_cents ?? 0;
  const itemTotal = order.items.reduce((sum, item) => sum + item.total_cents, 0);
  const calculatedTotal = itemTotal + shippingCost - discount;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Header />

      <main className="flex-grow pt-8 pb-20 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container text-on-primary-container mb-6 shadow-sm">
            <Icon name="check_circle" filled className="text-3xl" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4 font-noto-serif">Your Ritual is Secured</h1>
          <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">Your curation has been processed with the utmost care. A confirmation email is on its way to your sanctuary.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-10 -translate-y-10">
                <Icon name="verified_user" className="text-9xl" />
              </div>
              <div className="flex flex-col md:flex-row md:justify-between gap-6 relative z-10">
                <div>
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Order Reference</p>
                  <p className="text-xl font-bold font-noto-serif text-primary">{order.order_number ?? 'N/A'}</p>
                  <div className="mt-2">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Delivery Timeline</p>
                  <p className="text-xl font-medium text-on-surface">3-5 Business Days</p>
                  {shippingAddr && (
                    <p className="text-sm text-on-surface-variant italic">
                      {shippingAddr.city ? `${shippingAddr.city}, ` : ''}{shippingAddr.district ? `${shippingAddr.district}, ` : ''}Sri Lanka
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-primary border-b border-outline-variant/15 pb-4 font-noto-serif">Order Summary</h2>
              <div className="space-y-4">
                {order.items.map(item => (
                  React.createElement('div', {
                    key: item.id,
                    className: 'flex gap-6 items-center p-4 rounded-lg bg-surface-container-lowest transition-colors hover:bg-surface-container-high group'
                  },
                    React.createElement('div', { className: 'w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-surface-container' },
                      React.createElement('div', {
                        className: 'w-full h-full flex items-center justify-center text-outline-variant',
                      },
                        React.createElement(Icon, { name: "inventory_2", className: "text-3xl" })
                      )
                    ),
                    React.createElement('div', { className: 'flex-grow' },
                      React.createElement('div', { className: 'flex justify-between items-start' },
                        React.createElement('h3', { className: 'text-lg font-bold font-noto-serif leading-tight' }, item.product_name),
                        React.createElement('p', { className: 'font-bold text-primary' }, formatPriceCents(item.total_cents))
                      ),
                      React.createElement('p', { className: 'text-sm text-on-surface-variant mb-2' },
                        `${item.variant_name ?? 'Standard'} × ${item.quantity}`
                      ),
                      React.createElement('span', {
                        className: 'bg-tertiary-container text-on-surface text-xs uppercase font-bold tracking-tighter px-3 py-1 rounded-sm',
                        style: { clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }
                      }, 'Heritage Item')
                    )
                  )
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-surface-container p-8 rounded-xl shadow-[0_20px_40px_rgba(28,28,23,0.06)] border border-outline-variant/5">
              <h2 className="text-xl font-bold font-noto-serif mb-6 text-primary">Financial Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-medium">{formatPriceCents(itemTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Shipping (Insured)</span>
                  <span className="font-medium">{shippingCost > 0 ? formatPriceCents(shippingCost) : 'TBD'}</span>
                </div>
                {discount > 0 && React.createElement('div', { key: 'discount', className: 'flex justify-between text-sm text-green-600 ' },
                  React.createElement('span', null, 'Heritage Discount'),
                  React.createElement('span', { className: 'font-bold' }, `- ${formatPriceCents(discount)}`)
                )}
                <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-end">
                  <span className="text-lg font-bold font-noto-serif">Total</span>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-primary">{formatPriceCents(order.total_cents)}</span>
                    <span className="text-xs text-on-surface-variant uppercase tracking-widest">Taxes Included</span>
                  </div>
                </div>
              </div>

              {shippingAddr && (
                <div className="p-4 bg-surface-container-high rounded border border-dashed border-outline-variant/30 mb-6">
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Shipping To</p>
                  <p className="text-sm font-medium">{shippingAddr.recipient_name}</p>
                  <p className="text-xs text-on-surface-variant">{shippingAddr.address_line_1}</p>
                  {shippingAddr.address_line_2 && <p className="text-xs text-on-surface-variant">{shippingAddr.address_line_2}</p>}
                  <p className="text-xs text-on-surface-variant">
                    {[shippingAddr.city, shippingAddr.district].filter(Boolean).join(', ')}{' '}{shippingAddr.postal_code ?? ''}
                  </p>
                </div>
              )}

              <div className="p-4 bg-surface-container-high rounded border border-dashed border-outline-variant/30 text-center">
                <p className="font-noto-serif italic text-primary text-sm mb-1">Thank you for choosing authenticity</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Your patronage supports traditional artisans and sustainable sourcing practices in the island.</p>
              </div>

              <div className="mt-8">
                <Link to="/" className="block w-full text-center bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-md font-bold text-sm tracking-wide transition-all hover:opacity-90 active:scale-[0.98] duration-300 shadow-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4">
              <Icon name="support_agent" className="text-secondary" />
              <div>
                <p className="text-sm font-bold text-primary">Need assistance?</p>
                <p className="text-xs text-on-surface-variant">Our curators are available via chat or at care@heritagecurator.com</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-surface-container  w-full py-12 px-8 border-t border-outline-variant/15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
          <div>
            <div className="font-noto-serif italic text-lg text-on-surface  mb-2">The Heritage Curator</div>
            <p className="font-manrope text-sm tracking-wide text-on-surface/60 ">© 2024 The Heritage Curator. Crafted with intention.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
            <Link to="/support" className="font-manrope text-sm tracking-wide text-on-surface/60  hover:text-[#D2691E] transition-colors duration-300">Privacy Policy</Link>
            <Link to="/support" className="font-manrope text-sm tracking-wide text-on-surface/60  hover:text-[#D2691E] transition-colors duration-300">Terms of Service</Link>
            <Link to="/support" className="font-manrope text-sm tracking-wide text-on-surface/60  hover:text-[#D2691E] transition-colors duration-300">Authenticity Guarantee</Link>
            <Link to="/support" className="font-manrope text-sm tracking-wide text-on-surface/60  hover:text-[#D2691E] transition-colors duration-300">Shipping & Returns</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
