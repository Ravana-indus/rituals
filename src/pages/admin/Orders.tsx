import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import type { Order, OrderStatus } from '../../types/database';
import { formatPriceCents } from '../../types/database';
import OrderList from '../../components/admin/orders/OrderList';
import { OrderDrawer } from '../../components/admin/orders/OrderDrawer';
import { Icon } from '../../components/ui/Icon';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  refunded: 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    try {
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function updateStatus(id: string, status: string) {
    await api.orders.updateStatus(id, status);
    await loadOrders();
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-noto-serif text-primary">Orders</h1>
          <p className="text-sm text-on-surface-variant mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest transition-colors ${filter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}>All</button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest transition-colors ${filter === s ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}>{s}</button>
        ))}
      </div>

      <OrderList />

      <div className="bg-surface rounded-xl border border-outline-variant/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10 text-xs uppercase tracking-widest text-on-surface-variant">
              <th className="text-left p-4">Order #</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {filtered.map(order => (
              <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                <td className="p-4"><span className="font-mono text-xs font-bold text-primary">{order.order_number}</span></td>
                <td className="p-4"><p className="text-sm">{order.email}</p></td>
                <td className="p-4"><p className="text-sm font-semibold">{formatPriceCents(order.total_cents)}</p></td>
                <td className="p-4">
                  <span className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded-full ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{order.payment_status}</span>
                </td>
                <td className="p-4">
                  <select value={order.status ?? 'pending'} onChange={e => updateStatus(order.id, e.target.value)} className={`text-xs uppercase tracking-wider px-2 py-1 rounded-full border-0 cursor-pointer font-semibold ${STATUS_COLORS[order.status ?? 'pending']}`}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-xs text-on-surface-variant">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-LK') : '—'}</td>
                <td className="p-4">
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                    title="View Details"
                  >
                    <Icon name="visibility" className="text-sm" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant">
            <Icon name="receipt_long" className="text-4xl mb-3 opacity-30" />
            <p>No orders found.</p>
          </div>
        )}
      </div>

      <OrderDrawer />
    </div>
  );
}
