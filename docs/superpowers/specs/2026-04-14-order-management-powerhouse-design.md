# Order Management Powerhouse — Design Spec

**Date:** 2026-04-14  
**Status:** Approved  
**Architecture:** Modular Drawer (Approach A)  
**Phasing:** All at once  

## Problem

The current `/admin/orders` view is minimal: a flat table with status filter tabs and a small detail dialog. It lacks search, bulk operations, fulfillment tracking, refund management, order editing, timeline/notes, tags, and CSV export — all essential for running a real store.

There is also a field name mismatch bug in `OrderDetail.tsx`: it references `first_name`, `last_name`, and `province`, but the database schema uses `recipient_name` and `district`.

## Architecture Decision

**Approach A: Modular Drawer Architecture** — selected over full-page routes (loses list context) and monolithic components (unmaintainable at this scope).

- Order list stays as primary view with search, filters, bulk actions, pagination
- Clicking a row opens a slide-out drawer from the right (~60% width)
- Drawer has tabbed sections: Details, Fulfillment, Payment, Timeline
- Shared state via `OrderContext`
- Direct Supabase queries through `api.orders.*` namespace (no Edge Functions)

## Database Schema Changes

### New Tables

#### `order_fulfillments`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | |
| order_id | uuid (fk → orders) | |
| tracking_number | text | nullable |
| carrier | text | e.g., "SL Post", "FedEx", "DHL" |
| status | text | 'pending', 'in_transit', 'delivered' |
| shipped_at | timestamptz | nullable |
| delivered_at | timestamptz | nullable |
| created_by | uuid (fk → auth.users) | nullable |
| created_at | timestamptz | auto |

#### `order_fulfillment_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | |
| fulfillment_id | uuid (fk → order_fulfillments) | |
| order_item_id | uuid (fk → order_items) | |
| quantity | integer | |

#### `order_refunds`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | |
| order_id | uuid (fk → orders) | |
| amount_cents | integer | total refund amount |
| reason | text | 'damaged', 'wrong_item', 'customer_request', 'other' |
| status | text | 'pending', 'processed', 'failed' |
| note | text | nullable |
| created_by | uuid (fk → auth.users) | nullable |
| created_at | timestamptz | auto |

#### `order_refund_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | |
| refund_id | uuid (fk → order_refunds) | |
| order_item_id | uuid (fk → order_items) | |
| quantity | integer | |
| amount_cents | integer | refund for this line item |

#### `order_notes`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | |
| order_id | uuid (fk → orders) | |
| content | text | |
| note_type | text | 'internal', 'customer', 'activity' |
| created_by | uuid (fk → auth.users) | nullable |
| created_at | timestamptz | auto |

#### `order_tags`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | |
| order_id | uuid (fk → orders) | |
| tag | text | |

#### `order_edits`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | |
| order_id | uuid (fk → orders) | |
| edit_type | text | 'add_item', 'remove_item', 'change_quantity', 'change_price' |
| before_data | jsonb | state before edit |
| after_data | jsonb | state after edit |
| edited_by | uuid (fk → auth.users) | nullable |
| created_at | timestamptz | auto |

### Columns Added to `orders`
| Column | Type | Default | Notes |
|--------|------|---------|-------|
| fulfillment_status | text | 'unfulfilled' | 'unfulfilled', 'partial', 'fulfilled' |
| cancelled_at | timestamptz | nullable | |
| cancelled_reason | text | nullable | |
| edited_at | timestamptz | nullable | |

### Columns Added to `order_items`
| Column | Type | Default | Notes |
|--------|------|---------|-------|
| fulfilled_quantity | integer | 0 | |
| refunded_quantity | integer | 0 | |

### RLS Policies
Same pattern as existing tables — public read for own data, admins get full access via `is_admin()`.

## API Layer

New methods to add to `src/lib/api.ts` under `api.orders.*` and new namespaces:

### `api.orders.*`
```typescript
search(query: string, filters: OrderSearchFilters, pagination: Pagination): Promise<PaginatedOrders>
getBulk(ids: string[]): Promise<Order[]>
bulkUpdateStatus(ids: string[], status: OrderStatus): Promise<void>
bulkArchive(ids: string[]): Promise<void>
exportCsv(filters: OrderSearchFilters): Promise<Blob>
addNote(orderId: string, content: string, type: 'internal' | 'customer'): Promise<OrderNote>
getNotes(orderId: string): Promise<OrderNote[]>
addTag(orderId: string, tag: string): Promise<void>
removeTag(orderId: string, tag: string): Promise<void>
getTags(orderId: string): Promise<string[]>
```

### `api.fulfillments.*`
```typescript
create(orderId: string, data: CreateFulfillmentData): Promise<OrderFulfillment>
update(id: string, data: UpdateFulfillmentData): Promise<void>
getByOrder(orderId: string): Promise<OrderFulfillment[]>
```

### `api.refunds.*`
```typescript
create(orderId: string, data: CreateRefundData): Promise<OrderRefund>
getByOrder(orderId: string): Promise<OrderRefund[]>
```

### `api.orderEdits.*`
```typescript
apply(orderId: string, edits: OrderEditData): Promise<void>
getHistory(orderId: string): Promise<OrderEdit[]>
```

### Types (add to `src/types/database.ts`)
```typescript
type OrderSearchFilters = {
  status?: OrderStatus
  payment_status?: PaymentStatus
  fulfillment_status?: 'unfulfilled' | 'partial' | 'fulfilled'
  date_from?: string
  date_to?: string
  tags?: string[]
}

type Pagination = {
  page: number
  per_page: number
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}

type PaginatedOrders = {
  data: Order[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
```

## Component Architecture

```
src/pages/admin/Orders.tsx                    → Rewritten root page
src/components/admin/orders/
  ├── OrderList.tsx                           → Table with search, filters, bulk actions
  ├── OrderDrawer.tsx                         → Slide-out panel (60% width)
  ├── OrderDetailOverview.tsx                 → Status, customer, items, addresses, totals, tags
  ├── OrderFulfillment.tsx                    → Tracking, shipment management
  ├── OrderPayment.tsx                       → Payment details, refund history
  ├── OrderTimeline.tsx                      → Activity feed + internal notes
  ├── OrderRefundModal.tsx                   → Full/partial refund with line item selection
  ├── OrderEditModal.tsx                      → Add/remove items, adjust qty/price
  ├── OrderBulkActions.tsx                   → Bulk action toolbar
  ├── OrderFilters.tsx                         → Advanced filter panel
  └── OrderExport.tsx                          → CSV export logic
src/hooks/
  └── useOrderSearch.ts                       → Search + filter + pagination state
src/context/
  └── OrderContext.tsx                         → Shared order state (list ↔ drawer)
```

## Feature Specifications

### 1. Order List Page (Rewrite of `Orders.tsx`)

**Search bar** at the top: searches order_number, customer email, customer name.

**Filter panel** (collapsible, below search):
- Status: multi-select from OrderStatus values
- Payment status: multi-select from PaymentStatus values
- Fulfillment status: unfulfilled / partial / fulfilled
- Date range: from/to date pickers
- Tags: multi-select from existing tags

**Table columns** (sortable by click):
| Column | Sortable | Default Sort |
|--------|----------|-------------|
| Checkbox | No | — |
| Order # | Yes | Desc (newest first) |
| Customer | Yes | — |
| Items count | No | — |
| Total | Yes | — |
| Payment | Yes | — |
| Fulfillment | Yes | — |
| Status | Yes | — |
| Date | Yes | Yes |
| Tags | No | — |

**Pagination:** 20 per page, cursor-based with page numbers.

**Bulk action toolbar:** appears when 1+ rows selected:
- Change Status → dropdown
- Mark as Shipped → requires fulfilled items selection
- Archive selected
- Export selected

**Row click:** opens slide-out drawer for that order.

### 2. Order Drawer

Width: 60% of viewport, slides from right. Semi-transparent overlay behind it. Close on backdrop click or X button.

**Header:** Order # + date + close button

**Tab bar:** Details | Fulfillment | Payment | Timeline

### 3. Details Tab (OrderDetailOverview.tsx)

- **Status badges row:** Order status (editable dropdown), Payment status (editable dropdown), Fulfillment status (read-only, derived)
- **Customer card:** Name, email, phone — linked to /admin/users if profile exists
- **Addresses:** Shipping + Billing side by side, with copy-to-clipboard
- **Items table:** Product name, variant, qty, unit price, total, fulfilled qty, refunded qty. "Edit Order" button at bottom.
- **Totals summary:** Subtotal, Shipping, Tax, Discount, Total
- **Tags:** Editable tag input with autocomplete from existing tags

### 4. Fulfillment Tab (OrderFulfillment.tsx)

- **Fulfillment status badge** (unfulfilled / partial / fulfilled)
- **Fulfillment records list:** Each record shows tracking #, carrier, items in that shipment, date
- **"Add Tracking" form:** Tracking number input, carrier dropdown (SL Post, DHL, FedEx, UPS, Other), checkbox list of unfulfilled items with qty
- **Action buttons:** "Mark as Shipped" / "Mark as Delivered" per fulfillment

### 5. Payment Tab (OrderPayment.tsx)

- **Payment status badge**
- **Payment method** + provider info (PayHere payment ID, etc.)
- **Amount breakdown**
- **Refund history table:** Date, amount, items refunded, reason, status
- **"Issue Refund" button** → opens RefundModal

### 6. Timeline Tab (OrderTimeline.tsx)

- **"Add note" input** at top: textarea + "Internal" / "Customer" toggle + submit button
- **Chronological event feed** (newest first):
  - Order created
  - Status changed: "Processing → Shipped" by [user] at [timestamp]
  - Payment confirmed/failed/refunded
  - Fulfillment added/tracking updated/delivered
  - Note added (internal or customer-visible)
  - Order edited (with summary: "2 items changed")
  - Tag added/removed

Each event: [icon] [description] — [user] [relative timestamp, with absolute on hover]

### 7. Refund Modal (OrderRefundModal.tsx)

- **Line items list** with checkboxes + quantity input for each
- **Shipping refund** toggle + custom amount
- **Auto-calculated total refund** at bottom
- **Reason dropdown:** Damaged, Wrong item, Customer request, Other
- **Note field** (optional)
- **Submit** → creates order_refunds + order_refund_items records, updates payment_status and item refunded_quantity

### 8. Order Edit Modal (OrderEditModal.tsx)

- **Current items** with:
  - Quantity adjustment (+/- buttons or input)
  - Unit price adjustment (input)
  - Remove item button
- **Add item** section:
  - Search/select product
  - Select variant (if applicable)
  - Set quantity
  - Set price
- **Totals recalculate** in real-time
- **Save** → creates order_edits audit record, recalculates order totals

### 9. CSV Export (OrderExport.tsx)

Export columns: Order #, Date, Customer Name, Email, Phone, Status, Payment Status, Fulfillment Status, Subtotal, Shipping, Tax, Discount, Total, Shipping Address, Billing Address, Items (as concatenated string), Tags

Triggered from list page button (export all) or bulk action (export selected).

### 10. Bug Fix

Fix `OrderDetail.tsx` field name mismatch:
- `order.first_name` / `order.last_name` → should reference address `recipient_name` or profile data
- `order.phone` → should reference address phone or profile phone
- `shipping_address.first_name` / `shipping_address.last_name` → `shipping_address.recipient_name`
- `shipping_address.province` → `shipping_address.district`

## Design Principles

1. **Existing patterns:** Use Material Symbols icons, `bg-surface` / `text-on-surface` / `text-primary` color system, `font-noto-serif` for headings, uppercase tracking-widest labels — all matching the existing admin UI
2. **No new dependencies:** Use React state + Supabase queries, no React Query/SWR
3. **Component isolation:** Each component has a single responsibility, can be tested independently
4. **Audit trail:** Every mutation (status change, fulfillment, refund, edit, note) creates a timeline entry
5. **Direct Supabase:** All reads/writes go through `api.*` namespace hitting Supabase directly (with RLS)
6. **LKR cents:** All monetary values stored as cents, formatted via `formatPriceCents()`
7. **Universal Icon component:** Extract the repeated `Icon` pattern into a shared component