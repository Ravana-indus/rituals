# Heritage Curator Design System

### 1. Overview & Creative North Star
**Creative North Star: The Digital Archivist**
Heritage Curator is a design system that bridges the gap between traditional editorial luxury and modern digital efficiency. It rejects the generic "SaaS-blue" aesthetics in favor of a palette rooted in parchment, deep forest greens, and burnt sienna. The system prioritizes high-contrast typography and a "Physical Gallery" layout—where elements are treated as artifacts on a shelf rather than items in a grid. The overall whitespace is normal, providing a balanced layout.

### 2. Colors
The palette is built on a foundation of warm neutrals (`#fcf9f0`) and deep, authoritative primaries (`#003a3a`).
- **The "No-Line" Rule:** Sectioning is achieved through shifts in surface containers (e.g., transitioning from `surface` to `surface-container-high`) rather than 1px borders. If a boundary is strictly required, use `outline-variant` at 30% opacity.
- **Surface Hierarchy:** Use `surface_container_low` for large product cards to create a subtle "inset" look, while `surface_container_highest` is reserved for interactive filters and navigation ribbons.
- **The "Glass & Gradient" Rule:** Top navigation and floating action elements must utilize a 80% opacity backdrop blur (`backdrop-blur-md`) to maintain context while scrolling.

### 3. Typography
The system employs a sophisticated dual-font strategy.
- **Display & Headlines:** Noto Serif. Used for brand storytelling and large-scale editorial moments. The system encourages the use of *Italic* weights for emphasis (e.g., 3rem/48px headlines) to mimic high-end magazine spreads.
- **Body & Labels:** Manrope. A modern geometric sans-serif that ensures legibility in dense product data. 
- **Real-World Scale:**
  - **Display:** 3rem (48px) - Bold/Italic
  - **Headline:** 1.875rem (30px) - Bold
  - **Body:** 0.875rem (14px) - Medium
  - **Micro-Labels:** 10px / 9px / 8px - Bold/Black with 0.2em tracking for status tags.

### 4. Elevation & Depth
Hierarchy is established through "The Layering Principle." 
- **Stacking:** Surface levels move from `#fcf9f0` (Base) to `#f1eee5` (Footer/Content areas).
- **Ambient Shadows:** 
  - `shadow-sm`: Used for subtle header separation.
  - `shadow-lg`: Reserved for high-priority floating tags like "CLEARANCE" badges.
  - `shadow-xl`: Primary CTAs to suggest "clickability" on a flat editorial plane.
- **Glassmorphism:** The header utilizes a blurred translucent surface (`#fcf9f0/80`) to create a sense of lightness despite the traditional color choices.

### 5. Components
- **Buttons:** Primary CTAs have subtle rounded corners (roundedness: 1) with high-contrast text and wide letter spacing.
- **Product Cards:** Use a 4:5 aspect ratio. Avoid borders. The image should occupy 100% of the container width, with metadata living in the white space below.
- **Badges:** Use "Postage Stamp" styling—small, rectangular, bold uppercase text with high-contrast backgrounds (e.g., Red-600 for Clearance).
- **Inputs:** Search bars should be pill-shaped (`rounded-full`) to contrast against the otherwise rectangular structure of the grid.

### 6. Do's and Don'ts
**Do:**
- Use wide letter spacing (0.2em) for all micro-labels and uppercase text.
- Mix serif italics and bold sans-serifs in close proximity for a curated feel.
- Use `mix-blend-multiply` for hero images on colored backgrounds to deepen tonal quality.

**Don't:**
- Use standard blue for links; use `secondary` (Burnt Sienna) or `primary` (Forest Green).
- Use rounded corners larger than 8px for containers; the system should feel architectural and structured.
- Use pure black (#000) for text; use `on-surface` (#1c1c17) to maintain the "ink on paper" aesthetic.