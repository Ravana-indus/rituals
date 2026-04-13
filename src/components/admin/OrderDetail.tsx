import React, { useEffect, useRef } from 'react';
import { api } from '../../lib/api';
import type { Order, OrderItem, Address } from '../../types/database';
import { formatPriceCents } from '../../types/database';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

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

export default function OrderDetail({ orderId, onClose }: Props) {
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
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

  async function updatePaymentStatus(paymentStatus: string) {
    setUpdating(true);
    try {
      await api.orders.updatePaymentStatus(orderId, paymentStatus);
      await loadOrder();
    } catch (e) { console.error(e); }
    finally { setUpdating(false); }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === dialogRef.current) onClose();
  }

  if (!order) {
    return (
      <dialog ref={dialogRef} onClose={onClose} onClick={handleBackdropClick} className="fixed inset-0 m-auto max-w-md w-[95vw] max-h-[90vh] bg-surface rounded-2xl border border-outline-variant/10 shadow-2xl backdrop:bg-black/50 overflow-hidden">
        <div className="p-8 text-center text-on-surface-variant">
          {loading ? 'Loading...' : 'Order not found'}
        </div>
      </dialog>
    );
  }

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={handleBackdropClick} className="fixed inset-0 m-auto max-w-lg w-[95vw] max-h-[90vh] bg-surface rounded-2xl border border-outline-variant/10 shadow-2xl backdrop:bg-black/50 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 sticky top-0 bg-surface z-10">
        <div>
          <h2 className="text-xl font-noto-serif text-primary">Order {order.order_number}</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">{order.created_at ? new Date(order.created_at).toLocaleString('en-LK') : '—'}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant transition-colors">
          <Icon name="close" className="text-lg" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
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

        {order.notes && (
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Notes</p>
            <p className="text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3">{order.notes}</p>
          </div>
        )}

        {order.payment_method && (
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Payment Method</p>
            <p className="text-sm">{order.payment_method}</p>
          </div>
        )}
      </div>
    </dialog>
  );
}
