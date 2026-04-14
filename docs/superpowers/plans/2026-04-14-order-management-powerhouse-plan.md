# Order Management Powerhouse — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a full Shopify-grade order management system: search/filter, bulk actions, fulfillment tracking, refund processing, order editing, timeline/notes, tags, and CSV export — all via a slide-out drawer UX.

**Architecture:** Modular Drawer. Order list page stays as primary view; clicking a row slides out a 60%-width drawer from the right with tabbed sections. Shared state via `OrderContext`. Direct Supabase queries through the `api.*` namespace.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Supabase (no new dependencies).

---

## File Structure

```
supabase/migrations/2026-04-14-order-powerhouse.sql     → New tables + column additions
src/types/database.ts                                   → New type definitions
src/components/ui/Icon.tsx                               → Shared Icon component
src/lib/api.ts                                          → New API methods
src/context/OrderContext.tsx                            → Shared order state
src/hooks/useOrderSearch.ts                              → Search + filter + pagination state
src/pages/admin/Orders.tsx                               → Rewrite: list page scaffold
src/components/admin/orders/OrderList.tsx               → Table with search, sort, pagination
src/components/admin/orders/OrderFilters.tsx             → Collapsible filter panel
src/components/admin/orders/OrderBulkActions.tsx         → Bulk action toolbar
src/components/admin/orders/OrderExport.tsx              → CSV export
src/components/admin/orders/OrderDrawer.tsx              → Slide-out panel
src/components/admin/orders/OrderDetailOverview.tsx      → Details tab content
src/components/admin/orders/OrderFulfillment.tsx         → Fulfillment tab content
src/components/admin/orders/OrderPayment.tsx            → Payment tab content
src/components/admin/orders/OrderTimeline.tsx           → Timeline tab content
src/components/admin/orders/OrderRefundModal.tsx        → Refund modal
src/components/admin/orders/OrderEditModal.tsx           → Order edit modal
src/components/admin/OrderDetail.tsx                     → DELETE (old component, replaced)
```

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/2026-04-14-order-powerhouse.sql`

- [ ] **Step 1: Create SQL migration file**

```sql
-- Order Management Powerhouse Migration
-- Run this in Supabase SQL Editor

-- 1. New tables

CREATE TABLE IF NOT EXISTS order_fulfillments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number TEXT,
  carrier TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered')),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_fulfillment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fulfillment_id UUID NOT NULL REFERENCES order_fulfillments(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS order_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  reason TEXT NOT NULL CHECK (reason IN ('damaged', 'wrong_item', 'customer_request', 'other')),
  status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('pending', 'processed', 'failed')),
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_refund_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_id UUID NOT NULL REFERENCES order_refunds(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0)
);

CREATE TABLE IF NOT EXISTS order_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'internal' CHECK (note_type IN ('internal', 'customer', 'activity')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(order_id, tag)
);

CREATE TABLE IF NOT EXISTS order_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  edit_type TEXT NOT NULL CHECK (edit_type IN ('add_item', 'remove_item', 'change_quantity', 'change_price')),
  before_data JSONB NOT NULL,
  after_data JSONB NOT NULL,
  edited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Columns added to orders

ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;

-- 3. Columns added to order_items

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS fulfilled_quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS refunded_quantity INTEGER NOT NULL DEFAULT 0;

-- 3b. RPC helper functions (called from api.fulfillments and api.refunds)

CREATE OR REPLACE FUNCTION increment_fulfilled_quantity(item_id UUID, qty INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE order_items SET fulfilled_quantity = fulfilled_quantity + qty WHERE id = item_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_refunded_quantity(item_id UUID, qty INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE order_items SET refunded_quantity = refunded_quantity + qty WHERE id = item_id;
END;
$$;

-- 4. RLS Policies (same pattern as existing tables)

ALTER TABLE order_fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_fulfillment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_refund_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_edits ENABLE ROW LEVEL SECURITY;

-- Admins get full access to all new tables
CREATE POLICY "Admins have full access to order_fulfillments" ON order_fulfillments FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));
CREATE POLICY "Admins have full access to order_fulfillment_items" ON order_fulfillment_items FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));
CREATE POLICY "Admins have full access to order_refunds" ON order_refunds FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));
CREATE POLICY "Admins have full access to order_refund_items" ON order_refund_items FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));
CREATE POLICY "Admins have full access to order_notes" ON order_notes FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));
CREATE POLICY "Admins have full access to order_tags" ON order_tags FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));
CREATE POLICY "Admins have full access to order_edits" ON order_edits FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));

-- 5. Indexes for performance

CREATE INDEX IF NOT EXISTS idx_fulfillments_order_id ON order_fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_items_fulfillment_id ON order_fulfillment_items(fulfillment_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_items_order_item_id ON order_fulfillment_items(order_item_id);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON order_refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refund_items_refund_id ON order_refund_items(refund_id);
CREATE INDEX IF NOT EXISTS idx_refund_items_order_item_id ON order_refund_items(order_item_id);
CREATE INDEX IF NOT EXISTS idx_notes_order_id ON order_notes(order_id);
CREATE INDEX IF NOT EXISTS idx_tags_order_id ON order_tags(order_id);
CREATE INDEX IF NOT EXISTS idx_tags_tag ON order_tags(tag);
CREATE INDEX IF NOT EXISTS idx_edits_order_id ON order_edits(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_search ON orders(order_number, email, created_at);
```

---

## Task 2: New Type Definitions

**Files:**
- Modify: `src/types/database.ts`

- [ ] **Step 1: Add new types to database.ts**

Add the following after the existing type exports (before `formatPriceCents`):

```typescript
export type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled';
export type FulfillmentRecordStatus = 'pending' | 'in_transit' | 'delivered';
export type RefundReason = 'damaged' | 'wrong_item' | 'customer_request' | 'other';
export type RefundStatus = 'pending' | 'processed' | 'failed';
export type NoteType = 'internal' | 'customer' | 'activity';
export type OrderEditType = 'add_item' | 'remove_item' | 'change_quantity' | 'change_price';

export type OrderSearchFilters = {
  query?: string;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  fulfillment_status?: FulfillmentStatus;
  date_from?: string;
  date_to?: string;
  tags?: string[];
};

export type Pagination = {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
};

export type PaginatedOrders = {
  data: Order[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type OrderFulfillment = {
  id: string;
  order_id: string;
  tracking_number: string | null;
  carrier: string | null;
  status: FulfillmentRecordStatus;
  shipped_at: string | null;
  delivered_at: string | null;
  created_by: string | null;
  created_at: string;
};

export type OrderFulfillmentItem = {
  id: string;
  fulfillment_id: string;
  order_item_id: string;
  quantity: number;
};

export type OrderRefund = {
  id: string;
  order_id: string;
  amount_cents: number;
  reason: RefundReason;
  status: RefundStatus;
  note: string | null;
  created_by: string | null;
  created_at: string;
};

export type OrderRefundItem = {
  id: string;
  refund_id: string;
  order_item_id: string;
  quantity: number;
  amount_cents: number;
};

export type OrderNote = {
  id: string;
  order_id: string;
  content: string;
  note_type: NoteType;
  created_by: string | null;
  created_at: string;
};

export type OrderTag = {
  id: string;
  order_id: string;
  tag: string;
};

export type OrderEdit = {
  id: string;
  order_id: string;
  edit_type: OrderEditType;
  before_data: Record<string, unknown>;
  after_data: Record<string, unknown>;
  edited_by: string | null;
  created_at: string;
};
```

---

## Task 3: Shared Icon Component

**Files:**
- Create: `src/components/ui/Icon.tsx`

- [ ] **Step 1: Create shared Icon component**

```tsx
import React from 'react';

interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, filled = false, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
  >
    {name}
  </span>
);
```

- [ ] **Step 2: Update all files using the inline Icon pattern to import from the shared component**

Files that define their own Icon: `src/pages/admin/Orders.tsx`, `src/components/admin/OrderDetail.tsx`, `src/pages/admin/Dashboard.tsx`, `src/pages/admin/Products.tsx`, `src/pages/admin/Brands.tsx`, `src/pages/admin/Categories.tsx`, `src/pages/admin/Users.tsx`, `src/pages/admin/Settings.tsx`.

For each file, replace the inline `const Icon = ...` definition with:
```tsx
import { Icon } from '../../components/ui/Icon';
```

---

## Task 4: API Methods

**Files:**
- Modify: `src/lib/api.ts`

- [ ] **Step 1: Add imports for new types**

Add to the existing import block:
```typescript
  FulfillmentStatus, OrderFulfillment, OrderFulfillmentItem,
  OrderRefund, OrderRefundItem, OrderNote, OrderTag, OrderEdit,
  OrderSearchFilters, PaginatedOrders, Pagination,
  OrderEditType,
```

- [ ] **Step 2: Add `api.orders.search` method**

Add after the existing `orders` block's `updateShipping` method:

```typescript
    search: async (
      filters: OrderSearchFilters,
      pagination: Pagination
    ): Promise<PaginatedOrders> => {
      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order(pagination.sort_by ?? 'created_at', {
          ascending: pagination.sort_dir === 'asc',
        });

      if (filters.query) {
        query = query.or(
          `order_number.ilike.%${filters.query}%,email.ilike.%${filters.query}%,first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%`
        );
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
      }
      if (filters.fulfillment_status) {
        query = query.eq('fulfillment_status', filters.fulfillment_status);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to + 'T23:59:59');
      }

      const from = (pagination.page - 1) * pagination.per_page;
      query = query.range(from, from + pagination.per_page - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data ?? [],
        total: count ?? 0,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: Math.ceil((count ?? 0) / pagination.per_page),
      };
    },
```

- [ ] **Step 3: Add `api.orders.getBulk`, `bulkUpdateStatus`, `bulkArchive`**

```typescript
    getBulk: async (ids: string[]): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('id', ids);
      if (error) throw error;
      return data ?? [];
    },
    bulkUpdateStatus: async (ids: string[], status: string): Promise<void> => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .in('id', ids);
      if (error) throw error;
    },
    bulkArchive: async (ids: string[]): Promise<void> => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .in('id', ids);
      if (error) throw error;
    },
```

- [ ] **Step 4: Add `api.orders.addNote`, `getNotes`, `addTag`, `removeTag`, `getTags`, `getDistinctTags`**

```typescript
    addNote: async (orderId: string, content: string, noteType: 'internal' | 'customer'): Promise<OrderNote> => {
      const { data, error } = await supabase
        .from('order_notes')
        .insert({ order_id: orderId, content, note_type: noteType })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    getNotes: async (orderId: string): Promise<OrderNote[]> => {
      const { data, error } = await supabase
        .from('order_notes')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    addTag: async (orderId: string, tag: string): Promise<void> => {
      const { error } = await supabase
        .from('order_tags')
        .insert({ order_id: orderId, tag })
        .onConflict('order_id,tag')
        .do nothing();
      if (error && error.code !== '23505') throw error;
    },
    removeTag: async (orderId: string, tag: string): Promise<void> => {
      const { error } = await supabase
        .from('order_tags')
        .delete()
        .eq('order_id', orderId)
        .eq('tag', tag);
      if (error) throw error;
    },
    getTags: async (orderId: string): Promise<string[]> => {
      const { data, error } = await supabase
        .from('order_tags')
        .select('tag')
        .eq('order_id', orderId);
      if (error) throw error;
      return (data ?? []).map((r: { tag: string }) => r.tag);
    },
    getDistinctTags: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('order_tags')
        .select('tag');
      if (error) throw error;
      const unique = new Set((data ?? []).map((r: { tag: string }) => r.tag));
      return Array.from(unique).sort();
    },
```

- [ ] **Step 5: Add `api.orders.exportCsv` method**

```typescript
    exportCsv: async (filters: OrderSearchFilters): Promise<string> => {
      // Fetch orders with shipping/billing addresses
      const { data: orders } = await supabase
        .from('orders')
        .select('*, shipping_address:addresses!shipping_address_id(*), billing_address:addresses!billing_address_id(*)')
        .order('created_at', { ascending: false });

      if (!orders || orders.length === 0) {
        const header = ['Order #', 'Date', 'Email', 'Status', 'Payment Status', 'Fulfillment Status', 'Subtotal', 'Shipping', 'Tax', 'Discount', 'Total', 'Shipping Address', 'Items', 'Tags'];
        return header.join(',');
      }

      // Fetch all items and tags for these orders in parallel
      const orderIds = orders.map((o: Record<string, unknown>) => o.id as string);
      const [itemsResult, tagsResult] = await Promise.all([
        supabase.from('order_items').select('*').in('order_id', orderIds),
        supabase.from('order_tags').select('*').in('order_id', orderIds),
      ]);

      const itemsByOrder = (itemsResult.data ?? []).reduce((acc: Record<string, unknown[]>, item: Record<string, unknown>) => {
        if (!acc[item.order_id as string]) acc[item.order_id as string] = [];
        acc[item.order_id as string].push(item);
        return acc;
      }, {});

      const tagsByOrder = (tagsResult.data ?? []).reduce((acc: Record<string, string[]>, tag: Record<string, unknown>) => {
        if (!acc[tag.order_id as string]) acc[tag.order_id as string] = [];
        acc[tag.order_id as string].push(tag.tag as string);
        return acc;
      }, {});

      const header = [
        'Order #', 'Date', 'Email',
        'Status', 'Payment Status', 'Fulfillment Status',
        'Subtotal', 'Shipping', 'Tax', 'Discount', 'Total',
        'Shipping Address', 'Items', 'Tags',
      ];

      const formatAddress = (a: Record<string, unknown> | null) =>
        a ? `${a.recipient_name}, ${a.address_line_1}, ${a.city}, ${a.district}, ${a.postal_code}, ${a.country}` : '';

      const csvRows = orders.map((o: Record<string, unknown>) => {
        const items = itemsByOrder[o.id as string] ?? [];
        const tags = tagsByOrder[o.id as string] ?? [];
        const shippingAddr = o.shipping_address as Record<string, unknown> | null;
        return [
          o.order_number,
          o.created_at ? new Date(o.created_at as string).toLocaleDateString('en-LK') : '',
          o.email,
          o.status,
          o.payment_status,
          o.fulfillment_status,
          ((o.subtotal_cents as number) ?? 0) / 100,
          ((o.shipping_cents as number) ?? 0) / 100,
          ((o.tax_cents as number) ?? 0) / 100,
          ((o.discount_cents as number) ?? 0) / 100,
          (o.total_cents as number) / 100,
          formatAddress(shippingAddr),
          items.map((i: Record<string, unknown>) => `${i.product_name} x${i.quantity}`).join('; '),
          tags.join(', '),
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
      });

      return [header.join(','), ...csvRows].join('\n');
    },
```

- [ ] **Step 6: Add `api.fulfillments` namespace** (add as new top-level key in `api` object, after `orders`)

```typescript
  fulfillments: {
    create: async (orderId: string, data: {
      tracking_number?: string;
      carrier?: string;
      items: { order_item_id: string; quantity: number }[];
    }): Promise<OrderFulfillment> => {
      const { data: fulfillment, error } = await supabase
        .from('order_fulfillments')
        .insert({
          order_id: orderId,
          tracking_number: data.tracking_number ?? null,
          carrier: data.carrier ?? null,
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw error;

      for (const item of data.items) {
        await supabase.from('order_fulfillment_items').insert({
          fulfillment_id: fulfillment.id,
          order_item_id: item.order_item_id,
          quantity: item.quantity,
        });
        // Update fulfilled_quantity on order_item
        await supabase.rpc('increment_fulfilled_quantity', {
          item_id: item.order_item_id,
          qty: item.quantity,
        }) as unknown as void;
      }

      // Recalculate fulfillment_status
      await recalcFulfillmentStatus(orderId);

      return fulfillment;
    },
    update: async (id: string, data: {
      tracking_number?: string;
      carrier?: string;
      status?: 'pending' | 'in_transit' | 'delivered';
      shipped_at?: string;
      delivered_at?: string;
    }): Promise<void> => {
      const { error } = await supabase
        .from('order_fulfillments')
        .update(data)
        .eq('id', id);
      if (error) throw error;

      if (data.status === 'delivered') {
        const { data: ful } = await supabase.from('order_fulfillments').select('order_id').eq('id', id).single();
        if (ful) await recalcFulfillmentStatus(ful.order_id);
      }
    },
    getByOrder: async (orderId: string): Promise<(OrderFulfillment & { items: (OrderFulfillmentItem & { order_item: OrderItem })[] })[]> => {
      const { data, error } = await supabase
        .from('order_fulfillments')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const withItems = await Promise.all(
        (data ?? []).map(async (f) => {
          const { data: items } = await supabase
            .from('order_fulfillment_items')
            .select('*, order_item:order_items(*)')
            .eq('fulfillment_id', f.id);
          return { ...f, items: items ?? [] };
        })
      );
      return withItems;
    },
  },
```

- [ ] **Step 7: Add `api.refunds` namespace**

```typescript
  refunds: {
    create: async (orderId: string, data: {
      items: { order_item_id: string; quantity: number; amount_cents: number }[];
      amount_cents: number;
      reason: 'damaged' | 'wrong_item' | 'customer_request' | 'other';
      note?: string;
    }): Promise<OrderRefund> => {
      const { data: refund, error } = await supabase
        .from('order_refunds')
        .insert({
          order_id: orderId,
          amount_cents: data.amount_cents,
          reason: data.reason,
          note: data.note ?? null,
          status: 'processed',
        })
        .select()
        .single();
      if (error) throw error;

      for (const item of data.items) {
        await supabase.from('order_refund_items').insert({
          refund_id: refund.id,
          order_item_id: item.order_item_id,
          quantity: item.quantity,
          amount_cents: item.amount_cents,
        });
        await supabase.rpc('increment_refunded_quantity', {
          item_id: item.order_item_id,
          qty: item.quantity,
        }) as unknown as void;
      }

      // Update payment_status
      const { data: allRefunds } = await supabase
        .from('order_refunds')
        .select('amount_cents')
        .eq('order_id', orderId)
        .eq('status', 'processed');
      const totalRefunded = (allRefunds ?? []).reduce((s: number, r: { amount_cents: number }) => s + r.amount_cents, 0);
      const { data: order } = await supabase.from('orders').select('total_cents').eq('id', orderId).single();
      if (order) {
        const newStatus = totalRefunded >= order.total_cents ? 'refunded' : totalRefunded > 0 ? 'partially_refunded' : 'paid';
        await supabase.from('orders').update({ payment_status: newStatus }).eq('id', orderId);
      }

      return refund;
    },
    getByOrder: async (orderId: string): Promise<(OrderRefund & { items: OrderRefundItem[] })[]> => {
      const { data, error } = await supabase
        .from('order_refunds')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const withItems = await Promise.all(
        (data ?? []).map(async (r) => {
          const { data: items } = await supabase
            .from('order_refund_items')
            .select('*')
            .eq('refund_id', r.id);
          return { ...r, items: items ?? [] };
        })
      );
      return withItems;
    },
  },
```

- [ ] **Step 8: Add `api.orderEdits` namespace**

```typescript
  orderEdits: {
    apply: async (orderId: string, data: {
      edits: {
        edit_type: OrderEditType;
        order_item_id?: string;
        before_data: Record<string, unknown>;
        after_data: Record<string, unknown>;
        product_id?: string;
        product_name?: string;
        variant_id?: string;
        variant_name?: string;
        unit_price_cents?: number;
        quantity?: number;
      }[];
    }): Promise<void> => {
      for (const edit of data.edits) {
        await supabase.from('order_edits').insert({
          order_id: orderId,
          edit_type: edit.edit_type,
          before_data: edit.before_data,
          after_data: edit.after_data,
        });

        if (edit.edit_type === 'add_item') {
          await supabase.from('order_items').insert({
            order_id: orderId,
            product_id: edit.product_id,
            variant_id: edit.variant_id ?? null,
            product_name: edit.product_name,
            variant_name: edit.variant_name ?? null,
            quantity: edit.quantity ?? 1,
            unit_price_cents: edit.unit_price_cents ?? 0,
            total_cents: (edit.unit_price_cents ?? 0) * (edit.quantity ?? 1),
          });
        } else if (edit.edit_type === 'remove_item' && edit.order_item_id) {
          await supabase.from('order_items').delete().eq('id', edit.order_item_id);
        } else if (edit.edit_type === 'change_quantity' && edit.order_item_id) {
          const newQty = edit.quantity ?? 1;
          const { data: item } = await supabase.from('order_items').select('unit_price_cents').eq('id', edit.order_item_id).single();
          await supabase.from('order_items').update({
            quantity: newQty,
            total_cents: (item?.unit_price_cents ?? 0) * newQty,
          }).eq('id', edit.order_item_id);
        } else if (edit.edit_type === 'change_price' && edit.order_item_id) {
          const { data: item } = await supabase.from('order_items').select('quantity').eq('id', edit.order_item_id).single();
          await supabase.from('order_items').update({
            unit_price_cents: edit.unit_price_cents,
            total_cents: (edit.unit_price_cents ?? 0) * (item?.quantity ?? 1),
          }).eq('id', edit.order_item_id);
        }
      }

      // Recalculate order totals
      const { data: items } = await supabase.from('order_items').select('total_cents').eq('order_id', orderId);
      const subtotal = (items ?? []).reduce((s: number, i: { total_cents: number }) => s + i.total_cents, 0);
      const { data: order } = await supabase.from('orders').select('shipping_cents, discount_cents').eq('id', orderId).single();
      await supabase.from('orders').update({
        subtotal_cents: subtotal,
        total_cents: subtotal + (order?.shipping_cents ?? 0) - (order?.discount_cents ?? 0),
        edited_at: new Date().toISOString(),
      }).eq('id', orderId);
    },
    getHistory: async (orderId: string): Promise<OrderEdit[]> => {
      const { data, error } = await supabase
        .from('order_edits')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  },
```

- [ ] **Step 9: Add helper function `recalFulfillmentStatus` and RPC functions**

Add this helper function before the `api` export, then use it in `fulfillments.create` and `fulfillments.update`:

```typescript
async function recalcFulfillmentStatus(orderId: string): Promise<void> {
  const { data: items } = await supabase.from('order_items').select('quantity, fulfilled_quantity, refunded_quantity').eq('order_id', orderId);
  if (!items || items.length === 0) return;

  const totalQty = items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
  const fulfilledQty = items.reduce((s: number, i: { fulfilled_quantity: number }) => s + i.fulfilled_quantity, 0);
  const refundedQty = items.reduce((s: number, i: { refunded_quantity: number }) => s + i.refunded_quantity, 0);
  const shippableQty = totalQty - refundedQty;

  let status: 'unfulfilled' | 'partial' | 'fulfilled' = 'unfulfilled';
  if (fulfilledQty >= shippableQty && shippableQty > 0) status = 'fulfilled';
  else if (fulfilledQty > 0) status = 'partial';

  await supabase.from('orders').update({ fulfillment_status: status }).eq('id', orderId);
}
```

Also add these two RPC functions to the migration file (Task 1) — add them before the RLS section:

```sql
CREATE OR REPLACE FUNCTION increment_fulfilled_quantity(item_id UUID, qty INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE order_items SET fulfilled_quantity = fulfilled_quantity + qty WHERE id = item_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_refunded_quantity(item_id UUID, qty INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE order_items SET refunded_quantity = refunded_quantity + qty WHERE id = item_id;
END;
$$;
```

---

## Task 5: OrderContext

**Files:**
- Create: `src/context/OrderContext.tsx`

- [ ] **Step 1: Create OrderContext**

```tsx
import React, { createContext, useContext, useState } from 'react';
import type { Order } from '../types/database';

interface OrderContextValue {
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const OrderContext = createContext<OrderContextValue>({
  selectedOrderId: null,
  setSelectedOrderId: () => {},
  refreshTrigger: 0,
  triggerRefresh: () => {},
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(n => n + 1);

  return (
    <OrderContext.Provider value={{ selectedOrderId, setSelectedOrderId, refreshTrigger, triggerRefresh }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
```

- [ ] **Step 2: Wrap AdminLayout with OrderProvider**

Modify `src/components/AdminLayout.tsx` to import and wrap with `OrderProvider`.

---

## Task 6: useOrderSearch Hook

**Files:**
- Create: `src/hooks/useOrderSearch.ts`

- [ ] **Step 1: Create useOrderSearch hook**

```tsx
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { Order, OrderSearchFilters, PaginatedOrders } from '../types/database';

const DEFAULT_PAGINATION = { page: 1, per_page: 20, sort_by: 'created_at', sort_dir: 'desc' as const };

export function useOrderSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<OrderSearchFilters>({});
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [result, setResult] = useState<PaginatedOrders | null>(null);
  const [loading, setLoading] = useState(true);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.orders.search(filters, pagination);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  useEffect(() => { search(); }, [search]);

  const setPage = (page: number) => setPagination(p => ({ ...p, page }));
  const setSort = (sort_by: string) => setPagination(p => ({
    ...p,
    sort_by,
    sort_dir: p.sort_by === sort_by && p.sort_dir === 'asc' ? 'desc' : 'asc',
  }));
  const setFilter = (key: keyof OrderSearchFilters, value: unknown) =>
    setFilters(f => ({ ...f, [key]: value }));
  const clearFilters = () => { setFilters({}); setPagination(DEFAULT_PAGINATION); };

  return {
    query, setQuery,
    filters, setFilter, clearFilters,
    pagination, setPage, setSort,
    orders: result?.data ?? [],
    total: result?.total ?? 0,
    totalPages: result?.total_pages ?? 0,
    loading,
    refresh: search,
  };
}
```

---

## Task 7: Rewrite Orders.tsx (List Page Scaffold)

**Files:**
- Modify: `src/pages/admin/Orders.tsx` (replace entire content)
- Create: `src/components/admin/orders/` directory

- [ ] **Step 1: Replace Orders.tsx with list page scaffold**

```tsx
import React from 'react';
import { Icon } from '../../components/ui/Icon';
import { OrderList } from '../../components/admin/orders/OrderList';
import { OrderDrawer } from '../../components/admin/orders/OrderDrawer';
import { useOrderContext } from '../../context/OrderContext';

export default function AdminOrders() {
  const { selectedOrderId } = useOrderContext();

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-noto-serif text-primary">Orders</h1>
        </div>
      </div>
      <OrderList />
      {selectedOrderId && <OrderDrawer />}
    </div>
  );
}
```

---

## Task 8: OrderList Component

**Files:**
- Create: `src/components/admin/orders/OrderList.tsx`

- [ ] **Step 1: Create OrderList with full table, search, sort, pagination**

This component includes:
- Search input (top bar)
- Filter chips row (status, payment status, fulfillment status) + "Filters" button
- Collapsible filter panel (OrderFilters component inline or imported)
- Sortable table with checkboxes
- Bulk action toolbar (shows when items selected)
- Pagination at bottom
- Row click handler calls `setSelectedOrderId(order.id)`

Sortable columns: Order #, Total, Status, Payment, Fulfillment, Date. Checkbox in first column for bulk select. Tags shown as small chips in last column.

---

## Task 9: OrderFilters Component

**Files:**
- Create: `src/components/admin/orders/OrderFilters.tsx`

- [ ] **Step 1: Create OrderFilters component**

Collapsible panel below search bar:
- Status: multi-select checkboxes for all `OrderStatus` values
- Payment status: multi-select checkboxes for all `PaymentStatus` values
- Fulfillment status: 3 radio/checkbox options (unfulfilled, partial, fulfilled)
- Date range: two date inputs (from, to)
- Tags: multi-select from `api.orders.getDistinctTags()` (loaded on mount)
- "Clear all" button
- "Apply" button (closes panel, triggers search)

---

## Task 10: OrderBulkActions Component

**Files:**
- Create: `src/components/admin/orders/OrderBulkActions.tsx`

- [ ] **Step 1: Create OrderBulkActions component**

Floating bar that appears when 1+ checkboxes selected:
- Shows count: "X orders selected"
- Actions: "Change Status" (dropdown), "Mark as Shipped", "Archive", "Export CSV"
- "Deselect all" button

On action: call respective API method, then refresh list.

---

## Task 11: OrderExport Component

**Files:**
- Create: `src/components/admin/orders/OrderExport.tsx`

- [ ] **Step 1: Create OrderExport utility**

```tsx
import { api } from '../../lib/api';
import type { OrderSearchFilters } from '../../types/database';

export async function exportOrdersCsv(filters: OrderSearchFilters): Promise<void> {
  const csv = await api.orders.exportCsv(filters);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
```

Called from OrderList (export all) and OrderBulkActions (export selected filtered).

---

## Task 12: OrderDrawer Component

**Files:**
- Create: `src/components/admin/orders/OrderDrawer.tsx`

- [ ] **Step 1: Create OrderDrawer slide-out panel**

Width: 60% of viewport, fixed position slides from right edge. Dark overlay behind. Header with order number + close button. Tab bar: Details | Fulfillment | Payment | Timeline.

Each tab renders the respective component: `OrderDetailOverview`, `OrderFulfillment`, `OrderPayment`, `OrderTimeline`.

State: active tab (default 'details'). Loads order data via `api.orders.getById()`. Shows loading state while fetching.

Close behavior: backdrop click or X button calls `setSelectedOrderId(null)`.

---

## Task 13: OrderDetailOverview Component

**Files:**
- Create: `src/components/admin/orders/OrderDetailOverview.tsx`

- [ ] **Step 1: Create OrderDetailOverview tab content**

- Status badges row: order status dropdown (calls `api.orders.updateStatus`), payment status dropdown (`api.orders.updatePaymentStatus`), fulfillment status badge (read-only)
- Customer card: name, email, phone — link to `/admin/users?userId=X` if `user_id` exists
- Addresses: shipping + billing side by side in cards, each with copy-to-clipboard button
- Items table: product name, variant, qty, unit price, total, fulfilled qty (from `fulfilled_quantity`), refunded qty (from `refunded_quantity`). "Edit Order" button at bottom opens `OrderEditModal`
- Totals: subtotal, shipping, tax, discount, total (formatted via `formatPriceCents`)
- Tags: tag input with autocomplete from `api.orders.getDistinctTags()`. Add tag calls `api.orders.addTag`. Remove tag calls `api.orders.removeTag`.

---

## Task 14: OrderFulfillment Component

**Files:**
- Create: `src/components/admin/orders/OrderFulfillment.tsx`

- [ ] **Step 1: Create OrderFulfillment tab content**

- Fulfillment status badge (read-only)
- Fulfillment records list: each shows tracking #, carrier, items included, status badge, date. Calls `api.fulfillments.getByOrder(orderId)`.
- "Add Tracking" form: tracking number input, carrier dropdown (SL Post, DHL, FedEx, UPS, Other), list of unfulfilled items with checkboxes + qty inputs. Submit calls `api.fulfillments.create(orderId, data)`.
- Per-fulfillment action buttons: "Mark as Shipped" (sets status to 'in_transit', updates `shipped_at`), "Mark as Delivered" (sets status to 'delivered', updates `delivered_at`)

---

## Task 15: OrderPayment Component

**Files:**
- Create: `src/components/admin/orders/OrderPayment.tsx`

- [ ] **Step 1: Create OrderPayment tab content**

- Payment status badge
- Payment method (from `order.payment_method`) + PayHere payment ID (from `order.payhere_payment_id`)
- Amount breakdown (subtotal, shipping, tax, discount, total)
- Refund history: table of refunds with date, amount, items refunded, reason, status. Calls `api.refunds.getByOrder(orderId)`.
- "Issue Refund" button at bottom → opens `OrderRefundModal`

---

## Task 16: OrderTimeline Component

**Files:**
- Create: `src/components/admin/orders/OrderTimeline.tsx`

- [ ] **Step 1: Create OrderTimeline tab content**

- "Add note" input at top: textarea, "Internal" / "Customer" toggle, submit button. Calls `api.orders.addNote()`.
- Chronological event feed (newest first). Loads: `api.orders.getNotes(orderId)` + generated activity events from status/payment/fulfillment history.
- Each event: icon (based on event type), description, user, relative timestamp (with absolute tooltip on hover).
- Event types with icons:
  - Order created → `add_circle`
  - Status changed → `swap_horiz`
  - Payment confirmed → `payments`
  - Payment failed → `error`
  - Refund issued → `undo`
  - Fulfillment added → `local_shipping`
  - Tracking updated → `tracking`
  - Delivered → `check_circle`
  - Note added → `note`
  - Order edited → `edit`
  - Tag added/removed → `label`

---

## Task 17: OrderRefundModal Component

**Files:**
- Create: `src/components/admin/orders/OrderRefundModal.tsx`

- [ ] **Step 1: Create OrderRefundModal**

Rendered as a `<dialog>`. Props: `orderId`, `orderItems`, `orderTotalCents`, `onClose`, `onRefund`.

Content:
- Line items list: each with checkbox, product name, qty available to refund, unit price, line total. Input for qty to refund per item.
- Shipping refund: toggle + amount input (defaults to shipping cost)
- Total refund amount (auto-calculated, updates as items selected)
- Reason dropdown (damaged, wrong_item, customer_request, other)
- Note textarea (optional)
- "Issue Refund" button → calls `api.refunds.create(orderId, data)`, updates `payment_status`, triggers `onRefund()` and `onClose()`

---

## Task 18: OrderEditModal Component

**Files:**
- Create: `src/components/admin/orders/OrderEditModal.tsx`

- [ ] **Step 1: Create OrderEditModal**

Rendered as a `<dialog>`. Props: `orderId`, `items`, `onClose`, `onSave`.

Content:
- Current items list: each row shows product name, variant, qty (-/+ buttons), unit price (editable input), total. Remove button per item.
- "Add Item" section: product search input (calls `api.products.getAllAdmin()`), variant selector, qty input, price input. "Add" button.
- Running total recalculation (subtotal + shipping - discount = new total)
- "Save Changes" button → calls `api.orderEdits.apply(orderId, edits)`, creates timeline entry, triggers `onSave()`, `onClose()`

---

## Task 19: Delete Old OrderDetail Component

**Files:**
- Delete: `src/components/admin/OrderDetail.tsx` (completely replaced by drawer-based system)

- [ ] **Step 1: Delete the old component file**

```bash
rm src/components/admin/OrderDetail.tsx
```

Also remove the `OrderDetail` import from `src/pages/admin/Orders.tsx` (the old Orders.tsx, which was replaced in Task 7).

---

## Task 20: Bug Fix — OrderDetail Field Mismatch

**Files:**
- Fix any remaining references to old field names in the new components.

- [ ] **Step 1: Audit all new components for field name issues**

The new `OrderDetailOverview` reads from `api.orders.getById()`. That API returns `shipping_address` and `billing_address` as full `Address` objects (already using `recipient_name`, `district`). Verify that all references in `OrderDetailOverview.tsx` use:
- `shipping_address.recipient_name` (not `first_name`/`last_name`)
- `shipping_address.district` (not `province`)
- `shipping_address.phone`
- `order.email`, `order.phone` (these exist on the `Order` row type — note `order.phone` may not exist in schema, handle with `|| ''`)

Also check `order.first_name`/`order.last_name` — these fields do not exist on the `Order` type and were a bug in the old component. The new components should NOT reference them.

---

## Task 21: Integration & Smoke Test

- [ ] **Step 1: Run typecheck**

```bash
cd "/Users/patu/DEV/001 Websites/018-rituals/Google AI Studio" && npx tsc --noEmit
```

Fix any TypeScript errors before proceeding.

- [ ] **Step 2: Run lint**

```bash
cd "/Users/patu/DEV/001 Websites/018-rituals/Google AI Studio" && npm run lint
```

Fix any lint errors.

- [ ] **Step 3: Verify the app builds**

```bash
cd "/Users/patu/DEV/001 Websites/018-rituals/Google AI Studio" && npm run build
```

- [ ] **Step 4: Manually smoke test** (describe what to test):
  1. Navigate to `/admin/orders` — verify the list page loads with search bar and table
  2. Click an order row — verify drawer slides in from the right
  3. Click each tab — Details, Fulfillment, Payment, Timeline
  4. Try changing order status from the dropdown
  5. Add a note in the Timeline tab
  6. Apply a filter — verify list filters correctly
  7. Select multiple orders — verify bulk action toolbar appears
  8. Open OrderRefundModal — verify line items load correctly

---

## Spec Coverage Check

| Spec Section | Task(s) |
|---|---|
| DB Schema (6 new tables + columns) | Task 1 |
| New Types | Task 2 |
| Shared Icon | Task 3 |
| API methods (orders, fulfillments, refunds, orderEdits) | Task 4 |
| OrderContext | Task 5 |
| useOrderSearch hook | Task 6 |
| Orders.tsx rewrite | Task 7 |
| OrderList (table + sort + pagination) | Task 8 |
| OrderFilters | Task 9 |
| OrderBulkActions | Task 10 |
| OrderExport (CSV) | Task 11 |
| OrderDrawer | Task 12 |
| OrderDetailOverview (Details tab) | Task 13 |
| OrderFulfillment (Fulfillment tab) | Task 14 |
| OrderPayment (Payment tab) | Task 15 |
| OrderTimeline (Timeline tab) | Task 16 |
| OrderRefundModal | Task 17 |
| OrderEditModal | Task 18 |
| Delete old OrderDetail.tsx | Task 19 |
| Bug fix (field name mismatch) | Task 20 |
| Integration + typecheck + build | Task 21 |

**All spec requirements covered.**