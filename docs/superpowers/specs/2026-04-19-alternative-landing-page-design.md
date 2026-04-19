# Design: Alternative Landing Page (A/B Test Variant)

**Date:** 2026-04-19  
**Project:** Lakbima Beauty E-Commerce  
**Purpose:** A/B test landing page with minimal/clean Swiss aesthetic

---

## Overview

Create an alternative landing page (`home3.html`) as an A/B test variant with minimal Swiss design approach. Uses same Lakbima Beauty brand and design system, but applies more restraint with reduced visual density and increased white space.

---

## Visual Approach

- **Style:** Minimal/Clean (Swiss Style)
- **Philosophy:** Maximum white space, ultra-minimal typography, generous breathing room
- **Key Differentiators:**
  - Less visual density than current landing
  - More white space between elements
  - Subdued color (brand primary used sparingly as accent)
  - Editorial/fashion magazine feel
  - Cleaner product cards with simplified info

---

## Page Sections

### 1. Header
- Sticky positioning
- White background (`color.surface.base`)
- Minimal logo (left)
- Search bar (center)
- Cart icon with count (right)
- Height: 64px desktop, 56px mobile

### 2. Delivery Zone Selector
- Inline location text (subdued, less prominent)
- Format: "Deliver to: Colombo 03"
- Font: `font.size.sm`, `color.text.tertiary`
- Less visual weight than current version

### 3. Hero Section
- Aspect ratio: 21/9 desktop, 16/9 mobile
- Minimal copy (max 30 characters headline)
- Single product shot
- Single CTA button (primary)
- Subtle gradient overlay for text legibility

### 4. Category Navigation
- Horizontal scroll container
- Clean circular icons (48x48px)
- Text labels below, minimal
- Generous spacing: `space.6` gap
- No visual heavy borders

### 5. Search Input
- Persistent in header or below hero
- Rounded full (`radius.full`)
- Placeholder: "Search brands, skincare, makeup"
- Subtle border, expands on focus

### 6. Filter Pills
- Minimal chips
- Active: `color.brand.primary` background
- Inactive: Outlined
- Filters: Vegan, Cruelty-Free, Under Rs. 2,000

### 7. Product Grid
- 2-column desktop (more breathing room)
- 3-column tablet, 2-column mobile
- Gap: `space.6` (wider than current)
- Simplified cards:
  - Product image (3/4 aspect)
  - Brand name (small)
  - Product name
  - Price (single line)
  - Add to Bag button (full width)

### 8. Bottom Navigation (Mobile)
- Minimal icons + labels
- Home, Categories, Cart, Wishlist, Account
- Subdued active state

---

## Design Tokens Usage

Apply existing tokens with restraint:

| Element | Token | Application |
|---|---|---|
| Background | `color.surface.base` | Page and header |
| Text | `color.text.primary` | Headings |
| Text | `color.text.secondary` | Body |
| Text | `color.text.tertiary` | Metadata (sparingly) |
| Accent | `color.brand.primary` | Only CTAs, active states |
| Border | `color.border.default` | Subtle dividers |
| Font Display | `font.family.display` | Hero headline |
| Font Primary | `font.family.primary` | UI text |
| Spacing | `space.*` scale | All spacing |

---

## Responsive Breakpoints

| Breakpoint | Grid Columns | Key Changes |
|---|---|---|
| Mobile (<640px) | 2 | Bottom nav visible, compact spacing |
| Tablet (640-1023px) | 3 | More spacing |
| Desktop (1024px+) | 2 | Maximum white space |

---

## Accessibility

All existing accessibility requirements from design.md apply:
- Focus indicators visible
- Keyboard navigation
- Screen reader labels
- Reduced motion support
- Color not sole indicator

---

## Technical Notes

- File: `home3.html`
- Standalone HTML (not React component for A/B testing)
- CSS embedded or linked
- Uses existing design tokens as CSS variables
- Lazy load images below fold

---

## Success Criteria

1. Cleaner, more editorial feel vs current landing
2. Maintains brand recognition
3. Passes all accessibility tests
4. Responsive at all breakpoints
5. Metrics tracked (conversion, engagement)