# The Heritage Curator — Supabase Schema & Admin Design Spec

**Date:** 2026-04-13
**Project:** The Heritage Curator (luxury beauty clearance e-commerce)
**Status:** Implemented

---

## Architecture Overview

- **Frontend:** React 19 + TypeScript + Tailwind CSS v4 + React Router v7 + Vite 6
- **Backend:** Supabase (PostgreSQL 17 + Auth + Storage + Realtime)
- **Payment:** PayHere (Sri Lankan payment gateway)
- **Deployment:** Local development (port 3000)

---

## Supabase Project

- **Project ID:** `xbnsztyfyrhrdqhbboip`
- **Region:** ap-south-1
- **Ref:** `xbnsztyfyrhrdqhbboip`
- **Database Host:** `db.xbnsztyfyrhrdqhbboip.supabase.co`
- **Status:** Active

---

## Database Schema

### Core Catalog (8 tables)

| Table | Description |
|-------|-------------|
| `brands` | Brand info (name, slug, description, logo_url, country, website) |
| `categories` | Category tree with parent_id self-reference for nesting |
| `products` | Product catalog with full-text search vector, brand/category FKs |
| `product_images` | Multiple images per product with display_order |
| `product_variants` | Size/shade variants with own pricing and stock |

### Ritual Builder (2 tables)

| Table | Description |
|-------|-------------|
| `ritual_categories` | Hair / Skin / Fragrance ritual collections |
| `ritual_category_products` | Junction table linking products to ritual categories with curator pricing, badges, stock data |

### Users & Auth (2 tables)

| Table | Description |
|-------|-------------|
| `profiles` | Extends `auth.users` with role (customer/admin/super_admin), phone, avatar, preferences |
| `addresses` | Multiple shipping/billing addresses per user |

### Commerce (6 tables)

| Table | Description |
|-------|-------------|
| `carts` | Cart state per user or session_id |
| `cart_items` | Items in cart with price snapshot |
| `orders` | Order with auto-generated order_number (HC-YYMM-NNNNNN) |
| `order_items` | Line items with price snapshot |
| `payments` | Payment records linked to orders (PayHere integration) |
| `shipping_methods` | Configurable shipping options |

### Supporting (5 tables)

| Table | Description |
|-------|-------------|
| `promotions` | Promo codes (percentage/fixed/free_shipping) with usage limits |
| `reviews` | Product reviews with verified purchase flag |
| `wishlist` | User wishlist items |
| `consultations` | AI ritual consultation requests |
| `admin_activity_log` | Admin action audit trail |

### Admin (1 table)

| Table | Description |
|-------|-------------|
| `store_settings` | Key-value config (public keys visible to frontend) |

---

## Triggers & Functions

### Auto-generate order number
```sql
BEFORE INSERT ON orders → generate_order_number()
Format: HC-YYMM-NNNNNN (e.g., HC-2604-000001)
```

### Auto-create profile on signup
```sql
AFTER INSERT ON auth.users → handle_new_user()
Creates profile row with id=auth.uid(), email, full_name from metadata
```

### Auto-update updated_at
```sql
BEFORE UPDATE ON brands, categories, products, product_variants,
ritual_categories, profiles, addresses → handle_updated_at()
```

---

## RLS Policies

- **Public reads:** brands, categories, products (active only), product_images (via product), product_variants (via product), ritual_categories, ritual_category_products, shipping_methods, promotions (active), reviews (approved)
- **Users:** Own profile, addresses, cart, orders, wishlist, consultations
- **Admins:** All records on all tables via `is_admin()` function

### is_admin() function
```sql
SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
```

---

## Key Design Decisions

1. **Prices stored as LKR cents (integers)** — avoids floating-point issues (850000 = LKR 8,500.00)
2. **Brand-centric catalog** — organized by brand, not product type
3. **Ritual Builder as curated sub-catalog** — separate from main product catalog with curator-specific pricing
4. **Cart persists to Supabase** — syncs on login, merges anonymous cart
5. **Order number auto-generated** — human-readable format for customer support
6. **Profile auto-created on auth signup** — via database trigger, no app-level race condition
7. **Store settings as key-value** — allows runtime config without code changes

---

## Environment Variables

```
VITE_SUPABASE_URL=https://xbnsztyfyrhrdqhbboip.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_PAYHERE_MERCHANT_ID=<merchant id>
VITE_PAYHERE_CALLBACK_URL=http://localhost:3000/payment-callback
```

---

## Frontend File Structure

```
src/
  lib/
    supabase.ts       # Supabase client (singleton)
    api.ts            # Typed API functions for all tables
  types/
    supabase.ts       # Raw Supabase-generated types
    database.ts        # Typed aliases + utility functions
  context/
    AuthContext.tsx    # Auth state + signIn/signUp/signOut + isAdmin
    CartContext.tsx    # Cart state + Supabase sync
  pages/
    admin/
      Dashboard.tsx    # Stats, recent orders, low stock alerts
      Products.tsx    # Product CRUD
      Brands.tsx      # Brand CRUD
      Categories.tsx  # Category CRUD
      Orders.tsx      # Order management + status updates
      Users.tsx        # User management + role assignment
      Settings.tsx     # Store settings editor
  components/
    AdminLayout.tsx    # Admin sidebar + role guard + Outlet
```

---

## Admin Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | AdminLayout + Dashboard | Main dashboard |
| `/admin/products` | AdminLayout + Products | Product management |
| `/admin/brands` | AdminLayout + Brands | Brand management |
| `/admin/categories` | AdminLayout + Categories | Category management |
| `/admin/orders` | AdminLayout + Orders | Order status updates |
| `/admin/users` | AdminLayout + Users | User roles |
| `/admin/settings` | AdminLayout + Settings | Store configuration |

Admin routes are protected by `AdminLayout` which checks `isAdmin` from `AuthContext`. Non-admins see an access denied screen.

---

## Seeded Data

### Brands (8)
Augustinus Bader, Byredo, Gucci Beauty, Elemis, Vintner's Daughter, Pat McGrath Labs, Ayurvedic Heritage, Ceylon Botanica

### Categories (8)
Skincare, Hair & Body, Fragrance, Makeup, Serums & Oils, Cleansing Balms, Heritage Hair, Heritage Skin

### Ritual Categories (3)
- Hair Rituals (slug: hair) — subtitle "Nourish & Strengthen"
- Skin Rituals (slug: skin) — subtitle "Brighten & Renew"
- Fragrance Rituals (slug: fragrance) — subtitle "Illuminate & Captivate"

### Products (14)
- 6 home page clearance products (Augustinus Bader, Byredo, Gucci Beauty, Elemis, Vintner's Daughter, Pat McGrath Labs)
- 4 Hair ritual products (Neem Scalp Elixir, Hibiscus Mask, Sandalwood Comb, Lotus Silk Serum)
- 4 Skin ritual products (Saffron Elixir, Turmeric Mask, Rosehip Oil, Kesar Cream)
- Product images from Google CDN URLs (kept as-is, not migrated to Supabase Storage yet)

---

## Next Steps (Phase 3)

1. **PayHere integration** — Add payment initiation and callback handling
2. **Supabase Storage** — Migrate product images from Google CDN to Supabase buckets
3. **Dynamic product pages** — Replace `/product` static page with `/product/:slug` dynamic routes fetching from Supabase
4. **Home page dynamic data** — Replace hardcoded productData in Home.tsx with `api.products.getAll()`
5. **Ritual Builder dynamic data** — Replace hardcoded PRODUCTS_HAIR/SKIN/FRAGRANCE arrays with `api.ritualCategories.getProducts()`
6. **Cart checkout flow** — Connect Checkout.tsx to `api.cart.convertToOrder()` and PayHere payment
7. **Admin product creation form** — Full CRUD form with image upload to Supabase Storage
8. **Order confirmation page** — Wire to Supabase order data
9. **Email notifications** — Supabase Edge Functions for order confirmation emails
10. **Search** — Full-text search using PostgreSQL `search_vector` TSVECTOR column

---

## Authentication Flow

1. User signs up via `/register` → `supabase.auth.signUp()` → trigger creates profile with `role='customer'`
2. User signs in via `/login` → `supabase.auth.signInWithPassword()` → AuthContext loads profile
3. Admin user role upgraded manually via `/admin/users` → `api.admin.updateUserRole()`
4. First admin must be created manually in Supabase dashboard (Profiles table → update role to 'admin')
