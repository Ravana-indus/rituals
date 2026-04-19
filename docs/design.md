design System

## Context and Goals

Provide implementation-ready design-system guidance for Lakbima Beauty, a branded cosmetics and personal care e-commerce platform operating in Sri Lanka. This system ensures visual consistency, premium brand expression, and WCAG 2.2 AA compliance across web, iOS, and Android storefronts, catering to local user behaviors, delivery logistics, and currency conventions.

---

## Design Tokens and Foundations

### Color

| Token | Value | Usage |
|---|---|---|
| `color.brand.primary` | `#A44668` | CTAs, active states, accent fills, promotional badges |
| `color.brand.primary.hover` | `#8C3955` | Hover state on brand-colored surfaces |
| `color.brand.primary.active` | `#742F48` | Pressed/active state |
| `color.brand.secondary` | `#D4A574` | Secondary accents, star ratings, premium highlights |
| `color.brand.secondary.hover` | `#C49464` | Hover state on secondary accents |
| `color.surface.base` | `#FEFCFA` | Page background, card surfaces (warm white) |
| `color.surface.raised` | `#F7F4F0` | Inset sections, secondary card backgrounds, input fields |
| `color.surface.muted` | `#EFEAE4` | Dividers, disabled fills, subtle backgrounds |
| `color.surface.overlay` | `rgba(26, 26, 26, 0.6)` | Modal and sheet backdrops |
| `color.text.primary` | `#1A1A1A` | Headings, primary labels |
| `color.text.secondary` | `#5C5347` | Descriptions, supporting copy |
| `color.text.tertiary` | `#8A8078` | Metadata, timestamps, placeholder text |
| `color.text.inverse` | `#FEFCFA` | Text on brand-primary or dark surfaces |
| `color.icon.primary` | `#1A1A1A` | Default icon fill |
| `color.icon.secondary` | `#8A8078` | Muted icon fill |
| `color.border.default` | `#E8E3DD` | Card borders, input outlines |
| `color.border.focus` | `#A44668` | Focus-visible ring on interactive elements |
| `color.semantic.success` | `#1B7A4E` | In-stock status, cash-on-delivery badge |
| `color.semantic.error` | `#C72C2C` | Error states, out-of-stock badges |
| `color.semantic.warning` | `#C28A15` | Low stock indicators |
| `color.star.fill` | `#D4A574` | Rating star fill |

### Typography

| Token | Value | Usage |
|---|---|---|
| `font.family.display` | `"Playfair Display", Georgia, serif` | Hero headings, campaign titles |
| `font.family.primary` | `"Inter", -apple-system, "Segoe UI", sans-serif` | All UI text, body copy |
| `font.size.xs` | `12px` | Badges, captions, legal, strikethrough prices |
| `font.size.sm` | `14px` | Body text, metadata, list items |
| `font.size.md` | `16px` | Primary body, input text |
| `font.size.lg` | `18px` | Section headings |
| `font.size.xl` | `20px` | Page-level headings |
| `font.size.2xl` | `24px` | Hero titles (UI context) |
| `font.size.3xl` | `32px` | Promotional hero titles |
| `font.weight.regular` | `400` | Body text |
| `font.weight.medium` | `500` | Labels, emphasis |
| `font.weight.bold` | `700` | Headings, numeric highlights |
| `font.lineHeight.tight` | `1.25` | Headings |
| `font.lineHeight.normal` | `1.5` | Body text |
| `font.lineHeight.relaxed` | `1.625` | Long-form product descriptions |

### Spacing

| Token | Value |
|---|---|
| `space.0` | `0px` |
| `space.1` | `4px` |
| `space.2` | `8px` |
| `space.3` | `12px` |
| `space.4` | `16px` |
| `space.5` | `20px` |
| `space.6` | `24px` |
| `space.7` | `32px` |
| `space.8` | `40px` |
| `space.9` | `48px` |
| `space.10` | `64px` |

### Radius

| Token | Value | Usage |
|---|---|---|
| `radius.sm` | `4px` | Small badges, inline chips |
| `radius.md` | `8px` | Buttons, inputs, standard cards |
| `radius.lg` | `12px` | Product cards, promotional banners |
| `radius.xl` | `16px` | Modal containers, bottom sheets |
| `radius.full` | `9999px` | Avatars, category pills, shade swatches |

### Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow.none` | `none` | Flat elements |
| `shadow.sm` | `0 1px 2px rgba(26, 26, 26, 0.05)` | Subtle elevation for inputs |
| `shadow.md` | `0 2px 8px rgba(26, 26, 26, 0.08)` | Cards at rest |
| `shadow.lg` | `0 4px 16px rgba(26, 26, 26, 0.1)` | Hovered cards, dropdowns |
| `shadow.xl` | `0 8px 32px rgba(26, 26, 26, 0.14)` | Modals, bottom sheets |

### Motion

| Token | Value | Usage |
|---|---|---|
| `motion.duration.instant` | `100ms` | Micro-feedback (wishlist toggle) |
| `motion.duration.fast` | `150ms` | Hover transitions, focus rings |
| `motion.duration.normal` | `200ms` | Expand/collapse, filter panels |
| `motion.duration.slow` | `300ms` | Page transitions, sheet appearances |
| `motion.easing.default` | `cubic-bezier(0.2, 0, 0, 1)` | Standard deceleration |
| `motion.easing.enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering view |
| `motion.easing.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving view |

### Breakpoints

| Token | Value | Target |
|---|---|
| `breakpoint.sm` | `640px` | Large phone / small tablet |
| `breakpoint.md` | `768px` | Tablet portrait |
| `breakpoint.lg` | `1024px` | Tablet landscape / small desktop |
| `breakpoint.xl` | `1280px` | Desktop |
| `breakpoint.2xl` | `1440px` | Large desktop |

---

## Component-Level Rules

### 1. Delivery Zone Selector

**Intent:** Allow users to confirm their delivery location to determine product availability and shipping fees within Sri Lanka.

**Anatomy:**
- Icon (map pin, `color.icon.primary`)
- Location label (`font.size.md`, `font.weight.medium`)
- Subtext ("Colombo 03" or "Select Location", `font.size.xs`, `color.text.tertiary`)
- Chevron-down icon (`color.icon.secondary`)

**States:**
| State | Visual |
|---|---|
| Default | Base background, location text, chevron |
| Hover | `color.surface.raised` background |
| Focus-visible | `2px solid color.border.focus` inset, `2px offset` |
| Active | `color.surface.muted` background |
| Loading | Skeleton pulse on text area |
| Error | Red border, error icon, tooltip ("Delivery is not available in this area") |

**Responsive:**
- Mobile: Full-width, `space.4` horizontal padding
- Tablet+: Inline in header, fixed width `200px`

**Behavior:**
- Opens a modal with city/district dropdown (e.g., Colombo, Kandy, Galle) and optional sub-zone.
- Keyboard: `Enter` or `Space` activates; `Escape` closes modal.

---

### 2. Category Navigation

**Intent:** Enable quick navigation to cosmetic and personal care verticals.

**Anatomy:**
- Scrollable container with `overflow-x: auto` (hidden scrollbar)
- Category item: Circular image (`64×64px`) above label
- Label: `font.size.sm`, `font.weight.medium`, single line, centered
- Active indicator: `color.brand.primary` 2px bottom border, `font.weight.bold`
- Container: `space.4` gap between items

**States:**
| State | Visual |
|---|---|
| Default | Secondary text color |
| Hover | `color.text.primary` text |
| Focus-visible | `2px solid color.border.focus` around item, `radius.md` |
| Active/Selected | Brand-primary bottom border, bold text |
| Disabled | `opacity: 0.4`, `pointer-events: none` |

**Responsive:**
- Mobile: Horizontal scroll, `space.3` horizontal edge padding, peek of next item (`space.2`)
- Desktop: Horizontal scroll or static row depending on category count

**Behavior:**
- Touch: Free scroll with deceleration.
- Pointer: Scroll buttons at edges on desktop.
- Keyboard: `ArrowRight`/`ArrowLeft` moves focus; focused item scrolls into view via `scrollIntoView`.

---

### 3. Promotional Banner (Hero)

**Intent:** Surface seasonal campaigns (e.g., Avurudu, Black Friday), new brand launches, or skincare routines.

**Anatomy:**
- Image container: `aspect-ratio: 16/9` (mobile), `21/9` (desktop), `radius.lg`, `overflow: hidden`
- Optional overlay gradient for text legibility
- Headline: `font.family.display`, `font.size.2xl`, `font.weight.bold`, `color.text.inverse`
- Subtitle (optional): `font.size.sm`, `color.text.inverse`, `opacity: 0.9`
- CTA button: `color.brand.primary` pill, `font.size.sm`, `font.weight.medium`

**States:**
| State | Visual |
|---|---|
| Default | Full image, text overlay |
| Hover | `transform: scale(1.01)`, `shadow.lg`, `motion.duration.normal` |
| Focus-visible | `2px solid color.text.inverse` offset `2px` outside card |
| Loading | `color.surface.muted` skeleton matching aspect ratio |
| Error | Broken-image fallback: `color.surface.raised` with centered image-icon |

---

### 4. Product Card

**Intent:** Present a cosmetic product with enough detail (shade, price, stock) for a purchase decision.

**Anatomy:**
- Hero image: `aspect-ratio: 3/4` (standard beauty packaging), `radius.md` top corners, `object-fit: cover`
- Badges: Absolute top-left. "New" (`color.surface.base`, `color.text.primary`), "Sale" (`color.semantic.error`, `color.text.inverse`), "Out of Stock" (greyscale overlay)
- Wishlist button: Absolute top-right, `32×32px`, `radius.full`, `color.surface.base`, `shadow.sm`, heart icon
- Info section: `space.3` padding
  - Brand name: `font.size.xs`, `font.weight.medium`, `color.text.tertiary`, uppercase, max 1 line
  - Product name: `font.size.sm`, `font.weight.medium`, `color.text.primary`, max 2 lines
  - Shade swatches (optional): Row of `14×14px` circles, `space.1` gap, `border: 2px solid color.text.primary` on selected
  - Price block: Current price (`font.size.md`, `font.weight.bold`, `color.text.primary`), Strikethrough price (`font.size.xs`, `color.text.tertiary`) if on sale
  - "Add to Bag" button: Full-width, `radius.md`, `color.brand.primary` background, `font.size.sm`, `font.weight.medium`

**States:**
| State | Visual |
|---|---|
| Default | Resting elevation `shadow.md` |
| Hover | `shadow.lg`, `translateY(-2px)`, `motion.duration.fast` |
| Focus-visible | `2px solid color.border.focus`, `radius.lg + 2px` |
| Active | `shadow.sm`, `translateY(0)`, `motion.duration.instant` |
| Out of Stock | Image greyscale `opacity: 0.6`, "Add to Bag" changes to "Out of Stock", `color.surface.muted` bg, `pointer-events: none` |
| Loading | Skeleton matching layout |

**Wishlist button states:** Same as Store Card rules (Outlined/Filled heart, `aria-label` toggle).

**Responsive:**
- Mobile: 2-column grid, `space.3` gap
- Tablet: 3-column grid, `space.4` gap
- Desktop: 4-column grid, `space.4` gap

**Behavior:**
- "Add to Bag" click must `stopPropagation`—does not navigate to PDP.
- Card click (non-button area) navigates to Product Detail Page (PDP).
- Touch: Minimum `44×44px` hit target for wishlist and "Add to Bag".

---

### 5. Shade Swatch Selector (Inline)

**Intent:** Allow users to select a product variation directly from the product card or list.

**Anatomy:**
- Container: Flex row, `space.1` gap
- Swatch: `14×14px` circle (on card) or `24×24px` circle (on PDP), `radius.full`, `border: 1px solid color.border.default`
- Selected state: `border: 2px solid color.text.primary`, `box-shadow: 0 0 0 1px color.surface.base` (creates inner gap)

**Accessibility Critical:** Every swatch must have `aria-label="Shade: [Name]"` (e.g., `aria-label="Shade: Berry Red"`). Color alone is not accessible.

**States:**
| State | Visual |
|---|---|
| Default | Standard border |
| Hover | `transform: scale(1.15)`, `motion.duration.instant` |
| Focus-visible | `2px solid color.border.focus` outside swatch |
| Selected | Thick dark border, inner base-color gap |
| Unavailable | Diagonal line through swatch, `opacity: 0.4` |

---

### 6. Search Input

**Intent:** Persistent search for brands, ingredients, or product types.

**Anatomy:**
- Container: `radius.full`, `color.surface.raised`, `border: 1px solid color.border.default`, `height: 48px`
- Leading icon: Search, `color.icon.secondary`
- Placeholder: "Search brands, skincare, makeup..."
- Clear button when value present

**States:**
| State | Visual |
|---|---|
| Focus | `border-color: color.brand.primary`, `shadow: 0 0 0 3px rgba(164, 70, 104, 0.15)` |

**Behavior:**
- Debounced autocomplete at `300ms`.
- Desktop: Expands on focus. Mobile: Opens full-screen search overlay.

---

### 7. Filter Chip / Pill

**Intent:** Toggle filtering constraints (e.g., "Vegan", "Cruelty-Free", "Under Rs. 2,000").

**Anatomy:** Same as standard pill, but must accommodate text like "Cruelty-Free".

**States:**
| State | Visual |
|---|---|
| Selected | `color.brand.primary` background, `color.text.inverse` text |

**Behavior:** Uses `aria-pressed`. Keyboard: `Space` toggles.

---

### 8. Price Display

**Intent:** Standardize currency formatting for the Sri Lankan market.

**Rules:**
- Must use the format: `Rs. X,XXX.00` (e.g., `Rs. 2,450.00`).
- Strikethrough original price must be visually smaller (`font.size.xs`) and positioned inline before the sale price.
- No floating decimals unless cents exist (e.g., `Rs. 2,450` is acceptable, `Rs. 2,450.00` is standard).

---

### 9. Bottom Navigation (Mobile)

**Intent:** Core e-commerce navigation for mobile users.

**Anatomy:**
- Items: Home, Categories, Cart (with count badge), Wishlist, Account.
- Active indicator: `color.brand.primary` icon + label.
- Cart badge: `color.brand.primary` bg, `color.text.inverse`, `font.size.xs`, `radius.full`, minimum `16×16px`.

**Responsive:** Visible below `breakpoint.md`. Replaced by top header above.

---

### 10. Skeleton Loader

**Intent:** Structure hint during data loading.

**Rules:**
- Shape matches loaded component geometry.
- Fill: `color.surface.muted`, pulse animation.
- Product card skeleton: `aspect-ratio: 3/4` image block, 2 text lines (`60%` width, `100%` width), 1 button block.
- `aria-hidden="true"` on skeleton; `aria-busy="true"` on parent region.

---

## Accessibility Requirements and Testable Acceptance Criteria

### General

| ID | Criterion | Test Method |
|---|---|---|
| A1 | All interactive elements must have a visible focus indicator meeting 3:1 contrast against adjacent colors | Inspect focus-visible state; measure contrast of `color.border.focus` against `color.surface.base` (Passes: ~4.5:1) |
| A2 | Focus order follows visual left-to-right, top-to-bottom | Tab through page; verify sequence |
| A3 | No keyboard traps; `Escape` closes overlays/modals | Open overlay; press `Escape`; verify focus return |
| A4 | `prefers-reduced-motion: reduce` disables all transforms and transitions | Set media query; verify no motion |
| A5 | Cosmetic product images must have descriptive `alt` text ("Lakbima Beauty Rose Moisturiser 50ml tube") | Audit with screen reader |
| A6 | Color is never the sole indicator of state (e.g., out-of-stock must use text + visual change, not just grey tint) | Disable colors in DevTools; verify states are distinct |

### Component-Specific

| ID | Component | Criterion | Test Method |
|---|---|---|---|
| A10 | Delivery Zone | Must be a button with `aria-label` including current zone | Screen reader announcement check |
| A11 | Product Card | Entire card is `<a>` with accessible name = Brand + Product Name + Price | Screen reader reads: "Lakbima Beauty Rose Moisturiser, Rs. 2,450, link" |
| A12 | Product Card | "Add to Bag" must be a `<button>` nested inside, separately focusable | Tab directly to button; verify focus and action |
| A13 | Shade Swatch | Must have `aria-label` with shade name; `aria-checked` for selection state | Screen reader announces "Berry Red, checked" |
| A14 | Shade Swatch | Unavailable swatch must have `aria-disabled="true"` | Verify screen reader announces as disabled/unavailable |
| A15 | Search Input | Autocomplete listbox uses `aria-activedescendant` | Arrow through suggestions; verify announcement |
| A16 | Bottom Nav | `<nav>` with `aria-label="Main navigation"`; cart badge announced (e.g., "Cart, 3 items") | Landmark navigation + badge announcement |
| A17 | Price Display | Strikethrough price must not be announced as "deleted" or "line through" by screen readers unless semantic `<s>` or `<del>` is used correctly | Verify clean reading of "Was Rs. 3,000, Now Rs. 2,450" |

### Contrast Requirements

| Element Pair | Minimum Ratio | Status |
|---|---|---|
| `color.text.primary` (#1A1A1A) on `color.surface.base` (#FEFCFA) | 16.8:1 | Passes AAA |
| `color.text.secondary` (#5C5347) on `color.surface.base` (#FEFCFA) | 6.2:1 | Passes AA |
| `color.text.tertiary` (#8A8078) on `color.surface.base` (#FEFCFA) | 3.7:1 | Passes AA for large text only (>18px or >14px bold). **Must not be used for critical info below `font.size.md`** |
| `color.text.inverse` (#FEFCFA) on `color.brand.primary` (#A44668) | 5.8:1 | Passes AA. Safe for button text. |
| `color.brand.primary` (#A44668) on `color.surface.base` (#FEFCFA) | 5.8:1 | Passes AA for large text. **Must not be used for standard `14px` body links**; use `color.brand.primary.hover` (#8C3955) for small links (8.1:1 ratio). |

---

## Content and Tone Standards

### Voice

Elegant, inclusive, and clear. Speak to the user as a trusted beauty advisor. Prioritize ingredient transparency and efficacy over hyperbole. Respect local cultural nuances (e.g., referencing skin concerns relevant to tropical climates like sun protection and humidity resistance).

### Rules

- **Currency formatting:** Always `Rs. X,XXX` (e.g., `Rs. 1,250`). No other formats.
- **Maximum label length:** 3 words for nav, 5 words for buttons, 8 words for section headers.
- **No ALL CAPS** except for acronyms (e.g., "SPF", "UV").
- **No exclamation marks** in UI labels.
- **Ingredient focus:** Prefer "Hyaluronic Acid Hydrating Serum" over "Magic Glow Serum".
- **Stock communication:** Use "Out of stock" not "Sold out". Use "Low in stock" for `color.semantic.warning`.
- **Empty states:** Must include (1) what happened, (2) clear action.
- **Promo banner text:** Max 30 characters for headlines.

### Examples

| Context | ✅ Correct | ❌ Incorrect |
|---|---|---|
| Empty search | "No products match 'xyz'. Check spelling or browse categories." | "Oops! Nothing found! 😔" |
| Sale price | "Rs. 1,500  Rs. 2,000" | "1,500!! (was 2000)" |
| Search placeholder | "Search brands, skincare, makeup" | "What are you looking for today?" |
| Filter chip | "Cruelty-free" | "Not tested on animals" |
| Out of stock | "Out of stock" | "SOLD OUT!!" |
| Sunscreen label | "SPF 50 Sunscreen" | "Sun Blocker 5000" |

---

## Anti-Patterns and Prohibited Implementations

### Prohibited

| ID | Anti-Pattern | Why |
|---|---|---|
| P1 | Using raw hex values in component code | Breaks theming and consistency audits |
| P2 | Displaying shade swatches without accessible text names | Fails WCAG color-only identification rule |
| P3 | Using "Sold out" instead of semantic "Out of stock" | Inconsistent scanning for users; screen reader nuance |
| P4 | Formatting currency as "LKR 1,500" or "1,500 Rs." | Breaks local user expectation; must be "Rs. 1,500" |
| P5 | Using `color.text.tertiary` for prices or important product attributes | Fails AA contrast for normal text sizes |
| P6 | Product image carousels without visible pause controls | Violates WCAG 2.2 SC 2.2.2 |
| P7 | Auto-playing video with sound in promotional banners | Intrusive, violates WCAG and mobile data constraints in SL |
| P8 | Truncating brand names on product cards | Brand is primary identifier in cosmetics; must be 1 line, never truncated (use `text-overflow: ellipsis` as absolute fallback) |
| P9 | Using `onClick` on `pointerdown` for "Add to Bag" | Fires on scroll-start on touch; must use `pointerup` |
| P10 | Showing "Cash on Delivery" as the only payment indicator in the cart if card is also supported | Misleading; must show all available methods or remain neutral until checkout |

---

## QA Checklist

### Tokens
- [ ] No raw hex, px, or font values in component code—all reference semantic tokens
- [ ] Spacing uses only values from the `space.*` scale
- [ ] Border radius uses only values from the `radius.*` scale
- [ ] Shadows use only values from the `shadow.*` scale
- [ ] Currency formatting strictly adheres to `Rs. X,XXX` pattern

### States
- [ ] Every interactive component demonstrates: default, hover, focus-visible, active, disabled
- [ ] Product cards demonstrate: default, out-of-stock, loading
- [ ] Shade swatches demonstrate: default, selected, unavailable
- [ ] State transitions use tokens from `motion.*`

### Accessibility
- [ ] Tab order follows visual order across entire page
- [ ] Every focus-visible indicator meets 3:1 contrast
- [ ] `prefers-reduced-motion` disables all animations
- [ ] All product images have descriptive `alt` text (Brand + Product + Size)
- [ ] Every shade swatch has an `aria-label` with the shade name
- [ ] `aria-pressed`, `aria-checked`, `aria-busy` used correctly
- [ ] No keyboard traps; `Escape` closes all overlays
- [ ] `color.text.tertiary` is not used for critical text below `16px`

### Responsive
- [ ] Layout tested at all breakpoint boundaries: `640px`, `768px`, `1024px`, `1280px`, `1440px`
- [ ] Product card grid adjusts columns: 2 → 3 → 4
- [ ] Bottom navigation visible below `768px`; hidden above
- [ ] Promotional banner aspect ratio shifts from `16/9` to `21/9` at desktop
- [ ] No horizontal page scroll at any breakpoint

### Content
- [ ] No ALL CAPS in UI strings (except SPF, UV, etc.)
- [ ] No exclamation marks in labels or headers
- [ ] Empty states include explanation + action
- [ ] No ambiguous action labels

### Performance & Interaction
- [ ] Skeleton loaders match loaded-state dimensions exactly
- [ ] Product carousels do not render off-screen items beyond `+1` peek
- [ ] Images use `loading="lazy"` below the fold
- [ ] "Add to Bag" clicks fire on `pointerup`, not `pointerdown`
- [ ] "Add to Bag" `stopPropagation` prevents card navigation
- [ ] Touch hit targets are minimum `44×44px`
```