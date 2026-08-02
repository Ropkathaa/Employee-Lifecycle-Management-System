# UI Design System - Enterprise HR Automation Platform

This design system establishes a uniform design language for the Enterprise HR Automation Platform. It is inspired by premium SaaS dashboards (like Vercel, Linear, and Notion) and is built to ensure a high-contrast, modern, accessible, and responsive user experience.

---

## 1. Design Style & Philosophy

* **Style Identity:** Modern Minimalist with Glassmorphism highlights. Focuses on strong typography, ample whitespace, high-contrast states, and subtle micro-interactions (e.g., scale transitions, opacity shifts).
* **Dark Mode Native:** Designed from the start to support dual themes.
* **Component-First Structure:** Every component utilizes semantic Tailwind class utilities to maintain identical styling across different features.

---

## 2. Color Palette (HSL-Based)

To support theme transitions, we map base palettes to CSS variables.

| Token | Light Mode Value | Dark Mode Value | Tailwind Class Equivalent |
| :--- | :--- | :--- | :--- |
| **Primary (Slate-Violet)** | HSL 262, 80%, 50% | HSL 262, 90%, 65% | `bg-primary` / `text-primary` |
| **Primary Hover** | HSL 262, 80%, 40% | HSL 262, 90%, 55% | `bg-primary-hover` |
| **Secondary (Steel)** | HSL 215, 20%, 65% | HSL 215, 20%, 35% | `bg-secondary` / `text-secondary` |
| **Success (Emerald)** | HSL 142, 70%, 40% | HSL 142, 60%, 45% | `text-success` / `bg-success` |
| **Warning (Amber)** | HSL 38, 92%, 50% | HSL 38, 90%, 55% | `text-warning` / `bg-warning` |
| **Danger (Rose)** | HSL 350, 89%, 60% | HSL 350, 85%, 65% | `text-danger` / `bg-danger` |
| **Background Base** | HSL 210, 20%, 98% | HSL 224, 71%, 4% | `bg-background` |
| **Background Surface** | HSL 0, 0%, 100% | HSL 224, 71%, 8% | `bg-surface` |
| **Border Color** | HSL 214, 32%, 91% | HSL 224, 71%, 15% | `border-border` |

---

## 3. Typography & Spacing

### Typography
* **Font Family:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, system-ui.
* **Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700).

| Usage | Size Value | Tailwind Class | Style Details |
| :--- | :--- | :--- | :--- |
| **H1 (Page Header)** | 30px (1.875rem) | `text-3xl font-bold` | Tracking tight, Dark/Light contrast |
| **H2 (Section Header)** | 24px (1.5rem) | `text-2xl font-semibold`| Tracking tight |
| **H3 (Module / Card Header)**| 20px (1.25rem) | `text-xl font-medium` | Tracking tight |
| **H4 (Subheadings)** | 16px (1rem) | `text-base font-semibold` | — |
| **Body (Main Paragraphs)** | 14px (0.875rem) | `text-sm font-normal` | Line height 1.5 (leading-relaxed) |
| **Caption (Metadata, Info)** | 12px (0.75rem) | `text-xs font-normal` | text-slate-500 |

### Spacing System (4px Grid)
* `1` (4px), `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px), `12` (48px), `16` (64px).
* **Standard Page Padding:** `px-6 py-8` (Horizontal: 24px, Vertical: 32px).
* **Standard Card Padding:** `p-5` (20px).

### Maximum Content Width
The application follows a centered responsive content layout to maintain design boundaries on ultra-wide screens.
* **Desktop XL (2xl):** 1600px max width (`max-w-[1600px] mx-auto`)
* **Desktop (xl):** 1440px max width (`max-w-[1440px] mx-auto`)
* **Laptop (lg):** 1280px max width (`max-w-[1280px] mx-auto`)
* **Tablet (md):** 100% width (`w-full`)
* **Mobile (sm):** 100% width (`w-full`)

---

## 4. Borders, Shadows & Corners

* **Border Radius:**
  * Interactive inputs & standard buttons: `rounded-lg` (8px).
  * Cards, dropdown dialogs, modals: `rounded-xl` (12px).
  * Sidebar panels: `rounded-2xl` (16px).
* **Shadows:**
  * Cards/Surface containers: `shadow-sm` (Light: custom soft gray, Dark: none).
  * Modals/Drawers: `shadow-xl` (Deep expansion shadow).

---

## 5. UI Components Guidelines

### Buttons
Buttons must have a loading state, support focus states, and support the following variants:
* **Primary:** `bg-primary hover:bg-primary-hover text-white transition-all duration-200 active:scale-[0.98] rounded-lg text-sm px-4 py-2 font-medium focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center`
* **Secondary:** `bg-secondary/10 hover:bg-secondary/20 text-slate-700 dark:text-slate-200 transition-all rounded-lg text-sm px-4 py-2 font-medium min-h-[44px] flex items-center justify-center`
* **Outline:** `border border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all rounded-lg text-sm px-4 py-2 font-medium min-h-[44px] flex items-center justify-center`
* **Danger:** `bg-danger hover:bg-danger/90 text-white transition-all rounded-lg text-sm px-4 py-2 font-medium min-h-[44px] flex items-center justify-center`

### Form Inputs
Standardize inputs with clear focus states and validation indicators:
```html
<!-- Input wrapper -->
<div class="space-y-1.5">
  <label class="text-xs font-medium text-slate-600 dark:text-slate-400">Label Text</label>
  <input 
    type="text" 
    class="w-full min-h-[44px] px-3 py-2 border border-border bg-surface text-sm rounded-lg outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder-slate-400 text-slate-900 dark:text-white" 
    placeholder="Enter text..." 
  />
  <span class="text-xs text-danger hidden">Error message</span>
</div>
```

### Dropdowns
* **Design:** Floating popover container absolute to trigger point.
* **Style:** `bg-surface border border-border shadow-xl rounded-xl py-1 z-50 min-w-[200px] animate-in fade-in slide-in-from-top-1 duration-150`
* **Items:** `w-full min-h-[44px] px-3 py-1.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center`

### Tables
Used extensively in Employee Search and Document Management:
* **Structure:** Clean borderless rows with bottom borders.
* **Header Style:** `bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider text-left py-3 px-4`
* **Row Style:** `border-b border-border hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors`
* **Cell Style:** `text-sm text-slate-700 dark:text-slate-300 py-3.5 px-4`
* **Desktop Rule:** Scrollable only *inside* the table container. Never overflow outside page boundaries (`overflow-x-auto w-full`).

### Cards & Statistics Cards
* **Base Card:** `bg-surface border border-border rounded-xl p-5 shadow-sm`
* **Statistics Card:**
  * Layout: Flex column.
  * Details:
    * Top row: Header label (muted gray) + icon (violet primary color background).
    * Middle row: Absolute figure value (`text-3xl font-bold tracking-tight text-slate-900 dark:text-white`).
    * Bottom row: Sub-label containing progress indicator (percentage change highlighted in success green or danger red).

### Sidebar & Navbar
* **Sidebar:**
  * **Desktop:** Expanded Sidebar (260px width) or Collapsed Sidebar (80px icon-only layout). Full height (`h-screen`). `border-r border-border bg-surface`. Active item: `bg-primary/10 text-primary border-l-4 border-primary font-medium`.
  * **Tablet:** Collapsed by default (80px width).
  * **Mobile:** Hidden by default. Slide-out Drawer Navigation (260px) triggered via a hamburger menu.
* **Navbar / Header:**
  * Sticky configuration (`sticky top-0 z-40`).
  * **Height: 72px** (`h-[72px] border-b border-border bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between`).
  * Contains: Logo, Breadcrumbs tracking, global search element, notifications popover, and User Profile dropdown.

---

## 6. Interface Interactions & Polish

### Loading Skeletons
To avoid layout shifts during API fetches, replace cards and tables with animated pulse structures:
* **Class:** `animate-pulse bg-slate-200 dark:bg-slate-800 rounded`

### Empty States & Error Pages
* **Design:** Centered layouts featuring clean outline graphics (from React Icons), an H3 header, an explanatory text paragraph, and a direct primary action button.
* **Styles:** `flex flex-col items-center justify-center text-center p-12`

### Toast Notifications
* **Position:** Fixed to top-right corner.
* **Layout:** Flex row with distinct check/error icons, short text description, and close button.
* **Duration:** Auto-dismisses after 4000ms.

---

## 7. Responsive Breakpoints & Layout System

### Responsive Breakpoints
Utilize Tailwind's mobile-first breakpoints:
* **`sm`:** 640px (Mobile viewports)
* **`md`:** 768px (Tablet viewports)
* **`lg`:** 1024px (Laptop viewports)
* **`xl`:** 1280px (Desktop viewports)
* **`2xl`:** 1536px (Large desktop viewports)

### Dashboard Layout Hierarchy
Every dashboard page must stack elements in the following layout flow:
1. **Header / Navbar** (72px sticky top bar)
2. **Sidebar + Main Content Area** (Horizontal flex layout)
3. **Page Header** (Inside main content: contains page title, breadcrumbs, and primary action buttons)
4. **Statistics Cards Row** (Aggregated indicators grid)
5. **Filters & Search Bar** (Dynamic inputs layout)
6. **Main Content Container** (Tables, Forms, or Charts)
7. **Footer** (Copyright and version tracking)

### Grid System Rules
* **Statistics Cards Grid:**
  * **Desktop (xl / 2xl):** 4 cards per row (`grid-cols-4`)
  * **Laptop (lg):** 3 cards per row (`grid-cols-3`)
  * **Tablet (md):** 2 cards per row (`grid-cols-2`)
  * **Mobile (sm):** 1 card per row (`grid-cols-1`)
* **Forms Layout:**
  * **Desktop & Tablet (md and above):** 2-column side-by-side grids (`grid-cols-2`)
  * **Mobile (sm):** Single-column stack (`grid-cols-1`)
* **Tables Scrolling:**
  * Tables must never overflow outside the main page container.
  * Scrolling is restricted *horizontally inside* the table's container (`overflow-x-auto w-full`).

### Page Structure Requirement
Every view page must consistently render the following layout blocks:
* **Header:** Consistent sticky shell.
* **Page Title:** Set as a semantic H1.
* **Breadcrumb:** Route indicator.
* **Primary Actions:** Action triggers.
* **Statistics:** Quick cards (if applicable to the module).
* **Filters:** Search/filter forms.
* **Content:** Primary table/wizard block.
* **Footer:** Page base.

### Device Specific Rules

#### Mobile Rules (Width < 768px)
* Cards must stack vertically.
* Tables must enable horizontal scroll support inside their boundaries.
* Action buttons must expand to full width (`w-full`).
* Input fields and forms must fold into a single column.
* Sidebar transitions to a sliding overlay Drawer.
* Header actions must collapse into option menus or sub-header rows.

#### Tablet Rules (Width >= 768px and < 1024px)
* Maintain 2-column layouts wherever possible to preserve space.
* Reduce default padding slightly (`p-4` instead of `p-6` or `p-8`).
* Sidebar must collapse to the icon-only version (80px width) by default.

#### Desktop Rules (Width >= 1024px)
* Show full sidebar navigation (260px width).
* Render statistics cards in a single, balanced horizontal row.
* Maintain generous margins and padding to create breathing room.
* Avoid massive, unconstrained components that stretch and create awkward whitespace.

#### Responsive Coding Rules
* **Never use fixed widths** (`width: 600px`).
* Always prefer flexible Tailwind classes: `w-full`, `max-w-*`, `min-w-*`, `flex`, `grid`, and `gap-*`.
* Avoid pixel-perfect constraints; build fluid UI components that adapt dynamically.
* **Strict Constraint:** No screen size should ever experience horizontal scrollbars.

---

## 8. Dark Mode Guidelines

* **Default state:** Configured by checks in `localStorage` mapping to document class (`document.documentElement.classList.add('dark')`).
* **Hover and Borders:** Adjust borders dynamically to maintain clean separation (e.g. `border-slate-200` to `border-slate-800`). Avoid using black backgrounds; use deep grey/slate (`bg-[#0B0F19]`) to reduce visual strain.

---

## 9. Accessibility Guidelines (a11y)

* **Contrast Ratio:** Ensure text ratios against background meet WCAG AA requirements (minimum contrast ratio of 4.5:1).
* **Touch Target Size:** Interactive items (buttons, inputs, links, list items) must maintain a minimum touch target size of **44px** (using min-height and min-width or padding) to facilitate touch inputs.
* **Keyboard Navigation:** Users must be able to focus and trigger all interaction points using standard tab keys.
* **Focus Indicator:** Focus states must always remain visible and distinct (`focus:ring-2 focus:ring-primary focus:outline-none`).
* **ARIA labels:** Attach screen-reader markers (`aria-label`, `aria-hidden`) on icon-only buttons.

---

## 10. UI DO's and DON'Ts

### DO's
* **DO** use absolute HSL custom tokens inside `tailwind.config.js` to enable smooth theme changes.
* **DO** use loading skeletons instead of spinner overlays to avoid layout jumps.
* **DO** use clear tracking-tight attributes on header blocks.

### DON'Ts
* **DON'T** use default browser scrollbars. Apply custom CSS styles matching scrollbars to background elements.
* **DON'T** use highly saturated colors for background elements.
* **DON'T** use different design standards for new modals. Always use the system layouts defined above.

