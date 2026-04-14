import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import type { Order, OrderItem, Address } from '../../types/database';
import { formatPriceCents } from '../../types/database';
import { Icon } from '../ui/Icon';

type OrderDetail = Order & { items: OrderItem[]; shipping_address: Address | null; billing_address: Address | null };

interface Props {
  orderId: string;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  refunded: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = id!;
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [newNote, setNewNote] = React.useState('');
  const [savingNote, setSavingNote] = React.useState(false);
  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function loadOrder() {
    try {
      const data = await api.orders.getById(orderId);
      setOrder(data as OrderDetail | null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function updateStatus(status: string) {
    setUpdating(true);
    try {
      await api.orders.updateStatus(orderId, status);
      await loadOrder();
    } catch (e) { console.error(e); }
    finally { setUpdating(false); }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const appendedNote = order?.notes ? `${order.notes}\n\n[${new Date().toLocaleString('en-LK')}] ${newNote}` : `[${new Date().toLocaleString('en-LK')}] ${newNote}`;
      await supabase.from('orders').update({ notes: appendedNote }).eq('id', orderId);
      setNewNote('');
      await loadOrder();
    } catch(e) { console.error(e) } finally { setSavingNote(false); }
  }

  async function updatePaymentStatus(paymentStatus: string) {
    setUpdating(true);
    try {
      await api.orders.updatePaymentStatus(orderId, paymentStatus);
      await loadOrder();
    } catch (e) { console.error(e); }
    finally { setUpdating(false); }
  }



  if (!order) {
    return (
      <div className="min-h-screen bg-surface-container-low p-6 flex items-center justify-center">
        <div className="text-center text-on-surface-variant">
          {loading ? 'Loading...' : 'Order not found'}
          <br/>
          <button onClick={() => navigate('/admin/orders')} className="mt-4 text-primary underline">Back to Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface p-6 space-y-6">
      <div className="max-w-4xl mx-auto bg-surface rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 sticky top-0 bg-surface z-10">
        <div>
          <h2 className="text-xl font-noto-serif text-primary">Order {order.order_number}</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">{order.created_at ? new Date(order.created_at).toLocaleString('en-LK') : '—'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.open(`/admin/print/invoice/${order.id}`, '_blank')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2" title="Print Invoice">
            <Icon name="receipt" className="text-lg" />
            <span className="text-sm hidden sm:inline">Invoice</span>
          </button>
          <button onClick={() => window.open(`/admin/print/sticker/${order.id}`, '_blank')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2" title="Print Sticker">
            <Icon name="local_shipping" className="text-lg" />
            <span className="text-sm hidden sm:inline">Sticker</span>
          </button>
          <button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2">
            <Icon name="arrow_back" className="text-lg" />
            <span className="text-sm">Back</span>
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex gap-3 flex-wrap">
          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Status</label>
            <select
              value={order.status ?? 'pending'}
              onChange={e => updateStatus(e.target.value)}
              disabled={updating}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border-0 cursor-pointer font-semibold ${STATUS_COLORS[order.status ?? 'pending']}`}
            >
              {['pending','confirmed','processing','shipped','delivered','cancelled','refunded'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Payment</label>
            <select
              value={order.payment_status ?? 'pending'}
              onChange={e => updatePaymentStatus(e.target.value)}
              disabled={updating}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border-0 cursor-pointer font-semibold ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              {['pending','paid','failed','refunded','partially_refunded'].map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Customer</p>
            <p className="font-medium">{order.first_name} {order.last_name}</p>
            <p className="text-xs text-on-surface-variant">{order.email}</p>
            {order.phone && <p className="text-xs text-on-surface-variant">{order.phone}</p>}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Order Total</p>
            <p className="font-noto-serif text-lg font-bold text-primary">{formatPriceCents(order.total_cents)}</p>
            <p className="text-xs text-on-surface-variant">
              Subtotal: {formatPriceCents(order.subtotal_cents)} | Shipping: {formatPriceCents(order.shipping_cents ?? 0)}
              {order.discount_cents ? ` | Discount: -${formatPriceCents(order.discount_cents)}` : ''}
            </p>
          </div>
        </div>

        {order.shipping_address && (
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Shipping Address</p>
            <div className="bg-surface-container-low rounded-lg p-3 text-sm">
              <p className="font-medium">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
              <p className="text-on-surface-variant text-xs">{order.shipping_address.address_line_1}</p>
              {order.shipping_address.address_line_2 && <p className="text-on-surface-variant text-xs">{order.shipping_address.address_line_2}</p>}
              <p className="text-on-surface-variant text-xs">{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}</p>
              <p className="text-on-surface-variant text-xs">{order.shipping_address.country}</p>
              {order.shipping_address.phone && <p className="text-on-surface-variant text-xs mt-1">{order.shipping_address.phone}</p>}
            </div>
          </div>
        )}

        {order.billing_address && (
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Billing Address</p>
            <div className="bg-surface-container-low rounded-lg p-3 text-sm">
              <p className="font-medium">{order.billing_address.first_name} {order.billing_address.last_name}</p>
              <p className="text-on-surface-variant text-xs">{order.billing_address.address_line_1}</p>
              {order.billing_address.address_line_2 && <p className="text-on-surface-variant text-xs">{order.billing_address.address_line_2}</p>}
              <p className="text-on-surface-variant text-xs">{order.billing_address.city}, {order.billing_address.province} {order.billing_address.postal_code}</p>
              <p className="text-on-surface-variant text-xs">{order.billing_address.country}</p>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Items</p>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product_name}</p>
                  <p className="text-xs text-on-surface-variant">Qty: {item.quantity} × {formatPriceCents(item.unit_price_cents)}</p>
                </div>
                <p className="text-sm font-semibold ml-4">{formatPriceCents(item.total_cents)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Notes & History</p>
            {order.notes && (
              <div className="text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3 whitespace-pre-wrap mb-3">
                {order.notes}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a note (e.g., Refund processed...)"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-md py-2 px-3 text-sm focus:border-primary outline-none"
              />
              <button
                onClick={handleAddNote}
                disabled={savingNote || !newNote.trim()}
                className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-md text-xs font-bold hover:bg-outline-variant/20 disabled:opacity-50"
              >
                {savingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>

        {order.payment_method && (
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Payment Method</p>
            <p className="text-sm">{order.payment_method}</p>
          </div>
        )}
              </div>

        {/* New feature: Detailed Timeline / Extra Notes */}
        <div className="mt-8 pt-8 border-t border-outline-variant/10">
          <h3 className="text-sm uppercase tracking-widest text-on-surface-variant mb-4">Order Timeline</h3>
          <div className="space-y-4">
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                 <div className="w-px h-full bg-outline-variant/20 my-1"></div>
               </div>
               <div>
                 <p className="text-sm font-medium">Order Placed</p>
                 <p className="text-xs text-on-surface-variant">{order.created_at ? new Date(order.created_at).toLocaleString('en-LK') : '—'}</p>
               </div>
             </div>
             {order.status !== 'pending' && (
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
               </div>
               <div>
                 <p className="text-sm font-medium">Order {order.status}</p>
                 <p className="text-xs text-on-surface-variant">{order.updated_at ? new Date(order.updated_at).toLocaleString('en-LK') : '—'}</p>
               </div>
             </div>
             )}
          </div>
        </div>
          </div>
    </div>
  );
}
