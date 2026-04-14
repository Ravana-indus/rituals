import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { Order } from '../../types/database';

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function Fulfillment() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadOrders();
  }, [date]);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await api.orders.getAll();

      // Filter for processing/pending and matching the selected date.
      // Compare date strings directly to avoid UTC vs local timezone mismatch.
      const filtered = data.filter(o => {
        if (!o.created_at) return false;
        const orderDateStr = o.created_at.split('T')[0];
        return orderDateStr === date && (o.status === 'pending' || o.status === 'processing');
      });

      // Fetch full order details (including items) for each filtered order
      const detailedOrders = await Promise.all(
        filtered.map(async o => {
          const detail = await api.orders.getById(o.id);
          return detail;
        })
      );

      setOrders(detailedOrders.filter(Boolean) as any[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Aggregate items across all orders for the pick list
  const summary: Record<string, { name: string; variant: string | null; quantity: number }> = {};
  orders.forEach((o: any) => {
    (o.items ?? []).forEach((item: any) => {
      const key = `${item.product_id}-${item.variant_id || 'base'}`;
      if (!summary[key]) {
        summary[key] = { name: item.product_name, variant: item.variant_name ?? null, quantity: 0 };
      }
      summary[key].quantity += item.quantity;
    });
  });

  const summaryItems = Object.values(summary).sort((a, b) => a.name.localeCompare(b.name));

  function downloadCsvManifest() {
    const rows: string[][] = [];
    rows.push(['Order #', 'Customer', 'Product', 'Variant', 'Qty', 'Shipping Address']);

    orders.forEach((o: any) => {
      const customer = o.shipping_address
        ? `${o.shipping_address.first_name ?? ''} ${o.shipping_address.last_name ?? ''}`.trim()
        : o.email ?? '';
      const address = o.shipping_address
        ? [
            o.shipping_address.address_line_1,
            o.shipping_address.address_line_2,
            o.shipping_address.city,
            o.shipping_address.district,
            o.shipping_address.postal_code,
          ].filter(Boolean).join(', ')
        : '';
      (o.items ?? []).forEach((item: any) => {
        rows.push([
          o.order_number ?? '',
          customer,
          item.product_name ?? '',
          item.variant_name ?? '',
          String(item.quantity),
          address,
        ]);
      });
    });

    const csv = rows
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fulfillment-manifest-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface p-6 space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-3xl font-noto-serif text-primary">Daily Fulfillment Summary</h1>
          <p className="text-sm text-on-surface-variant mt-1">Pick list for warehouse</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={downloadCsvManifest}
            disabled={summaryItems.length === 0}
            className="flex items-center gap-2 bg-surface border border-outline-variant/30 text-on-surface px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="download" className="text-sm" />
            CSV Manifest
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
          >
            <Icon name="print" className="text-sm" />
            Print List
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-surface rounded-xl border border-outline-variant/10 p-8 print:border-none print:p-0 print:bg-surface print:text-black">
          <div className="hidden print:block mb-6 border-b pb-4">
            <h1 className="text-2xl font-serif font-bold uppercase">The Heritage Curator</h1>
            <h2 className="text-lg uppercase mt-1">Daily Pick List — {new Date(date + 'T00:00:00').toLocaleDateString()}</h2>
          </div>

          <h3 className="font-bold uppercase tracking-widest text-sm mb-4 print:text-black text-on-surface-variant">Products to Pick</h3>

          {summaryItems.length === 0 ? (
            <p className="text-sm italic">No pending/processing orders found for this date.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-outline-variant/20 print:border-black">
                  <th className="py-2 font-bold uppercase text-xs tracking-wider">Product Name</th>
                  <th className="py-2 font-bold uppercase text-xs tracking-wider">Variant</th>
                  <th className="py-2 font-bold uppercase text-xs tracking-wider text-right w-24">Total Qty</th>
                  <th className="py-2 font-bold uppercase text-xs tracking-wider text-center w-24 print:table-cell hidden">Picked</th>
                </tr>
              </thead>
              <tbody>
                {summaryItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-outline-variant/10 print:border-gray-300">
                    <td className="py-3 text-sm">{item.name}</td>
                    <td className="py-3 text-sm text-on-surface-variant">{item.variant ?? '—'}</td>
                    <td className="py-3 text-sm text-right font-bold">{item.quantity}</td>
                    <td className="py-3 text-center print:table-cell hidden">
                      <div className="w-6 h-6 border-2 border-black inline-block rounded-sm"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {orders.length > 0 && (
            <div className="mt-12 print:mt-8">
              <h3 className="font-bold uppercase tracking-widest text-sm mb-4 print:text-black text-on-surface-variant">Packing List — Orders ({orders.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((o: any) => (
                  <div key={o.id} className="border border-outline-variant/20 print:border-gray-400 p-4 rounded-lg break-inside-avoid">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-mono font-bold">{o.order_number}</h4>
                      <span className="text-xs uppercase bg-surface-container px-2 py-0.5 rounded print:border print:border-black">{o.status}</span>
                    </div>
                    <p className="text-sm font-medium">
                      {o.shipping_address?.first_name} {o.shipping_address?.last_name}
                    </p>
                    {o.shipping_address && (
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {[
                          o.shipping_address.address_line_1,
                          o.shipping_address.address_line_2,
                          o.shipping_address.city,
                          o.shipping_address.district,
                          o.shipping_address.postal_code,
                        ].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <div className="mt-3 text-xs space-y-1 border-t border-outline-variant/10 print:border-gray-300 pt-2">
                      {(o.items ?? []).map((i: any) => (
                        <div key={i.id} className="flex justify-between gap-2">
                          <span className="truncate">
                            {i.product_name}
                            {i.variant_name && <span className="text-on-surface-variant ml-1">({i.variant_name})</span>}
                          </span>
                          <span className="font-bold shrink-0">×{i.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-outline-variant/10 print:border-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant">Packed by:</span>
                        <div className="flex-1 border-b border-dashed border-outline-variant/40 print:border-gray-400 h-4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
