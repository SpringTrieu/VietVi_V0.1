# Responsive.md

> Agent-facing responsive design standard for the FreelanceFlow marketplace.
>
> Purpose: Every AI coding agent, UI agent, and refactor agent must follow this file when editing layout, homepage, header, footer, marketplace grids, cards, navigation, profile pages, or any screen that can be affected by viewport width, browser zoom, or device size.

---

## 0. How agents must use this file

Before changing any UI or CSS, the agent must:

1. Read this file completely.
2. Identify which layout layer is affected.
3. Audit current computed width, max-width, grid columns, flex behavior, overflow, and breakpoint rules.
4. Fix the root cause, not only the visible symptom.
5. Verify the change at mobile, tablet, desktop, large desktop, ultra-wide, and browser zoom levels.
6. Report root cause, files modified, before/after behavior, and acceptance criteria status.

Do not treat Fiverr as a visual clone target. Use Fiverr only as a marketplace benchmark for layout quality, search-first UX, responsive grid behavior, and professional marketplace density.

---

## 1. Role

You are a senior frontend architect working on a Fiverr-style marketplace called FreelanceFlow.

Your responsibility is to maintain a responsive, scalable, production-grade marketplace UI that works across:

- Mobile
- Tablet
- Laptop
- Desktop
- 2K screens
- 4K screens
- Ultra-wide screens
- Browser zoom from 25% to 200%

---

## 2. Core objective

The UI must not break, shrink into a tiny centered island, overflow horizontally, overlap, or become unreadable when:

- Viewport width changes
- Browser zoom changes
- Content length changes
- Cards increase in number
- Navigation items increase
- Images fail to load
- Text becomes longer than expected

Expected behavior:

- Page sections use full available width.
- Content is centered with a deliberate max-width.
- Marketplace grids expand naturally on large screens.
- Cards remain readable.
- Footer does not float awkwardly in the middle of the page.
- Header remains aligned and usable.
- No layout depends on browser zoom hacks.

---

## 3. Responsive design principles

### 3.1 Use fluid constrained layout

Correct architecture:

```txt
html
body
#root
app
page
section full width
container centered with max width
content grid or flex layout
component
```

Recommended CSS:

```css
html,
body,
#root {
  width: 100%;
  min-height: 100%;
}

body {
  margin: 0;
  overflow-x: hidden;
}

.page-section {
  width: 100%;
}

.container {
  width: min(100% - 48px, 1680px);
  margin-inline: auto;
}
```

Alternative if the project does not support `min()`:

```css
.container {
  width: 100%;
  max-width: 1680px;
  margin-inline: auto;
  padding-inline: 24px;
  box-sizing: border-box;
}
```

### 3.2 Do not use fixed page widths

Do not use:

```css
.page {
  width: 1200px;
}
```

Do not use fixed-width wrappers for entire screens.

Allowed only for small components:

```css
.avatar {
  width: 40px;
  height: 40px;
}
```

### 3.3 Do not use transform or zoom for layout

Never fix responsive layout using:

```css
transform: scale(0.8);
zoom: 0.75;
```

Allowed exceptions:

- Small hover animation on icons or cards
- Spinner rotation
- Dropdown chevron rotation

These exceptions must not affect page-level wrappers.

### 3.4 Use mobile-first CSS

Base styles should support mobile first.

Then expand with `min-width` breakpoints.

```css
.marketplace-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .marketplace-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .marketplace-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}
```

---

## 4. Marketplace layout standard

### 4.1 Header

Header should be full width.

Inner content should be centered.

```css
.header {
  width: 100%;
  border-bottom: 1px solid var(--border-color);
}

.header-inner {
  width: min(100% - 48px, 1680px);
  margin-inline: auto;
  display: flex;
  align-items: center;
  gap: 24px;
}
```

Header must not be globally scaled.

Header must not use fixed total width.

Header must handle:

- Logo
- Search bar
- Navigation
- Icon actions
- User menu
- Long category names
- Overflow at small widths

### 4.2 Category navigation

Large screens:

- Show horizontal category navigation.
- Allow items to use available width.
- Avoid wrapping into messy multi-line navigation unless designed.

Small screens:

- Use horizontal overflow or a menu/drawer.
- Do not cram all categories into tiny text.

Recommended:

```css
.category-nav-list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}
```

### 4.3 Homepage hero and welcome section

Homepage content should not be locked into a narrow nested container.

Use one primary container per section.

Avoid this:

```txt
section max-width 1400
  wrapper max-width 1200
    content max-width 960
```

Prefer this:

```txt
section width 100%
  container max-width 1680
    content grid/flex
```

### 4.4 Recommendation cards

Cards must use the available row width.

```css
.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}
```

### 4.5 Marketplace gig grid

Do not use hardcoded card columns such as:

```css
.grid {
  grid-template-columns: repeat(5, 180px);
}
```

Preferred pattern:

```css
.gig-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  align-items: start;
}
```

If cards become too wide on ultra-wide screens, use `auto-fill` with max card size:

```css
.gig-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 320px));
  justify-content: start;
  gap: 24px;
}
```

Choose based on product requirement:

- Use `auto-fit` when cards should stretch to fill available space.
- Use `auto-fill` with max card width when cards should keep marketplace card proportions.

### 4.6 Gig cards

Gig cards should be responsive inside the grid.

```css
.gig-card {
  width: 100%;
  min-width: 0;
}

.gig-card-media {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.gig-card-title {
  overflow-wrap: anywhere;
}
```

Do not set fixed card width unless the grid explicitly manages overflow.

### 4.7 Footer

Footer should be full width and anchored naturally after main content.

```css
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

main {
  /* Do NOT use flex: 1; let content determine height */
  width: 100%;
}

.footer {
  width: 100%;
  border-top: 1px solid var(--border-color);
}

.footer-inner {
  width: min(100% - 48px, 1680px);
  margin-inline: auto;
}
```

Footer grid:

```css
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 32px;
}
```

---

## 5. Container tokens

Use design tokens instead of random max-width values.

```css
:root {
  --container-sm: 768px;
  --container-md: 1200px;
  --container-lg: 1440px;
  --container-xl: 1680px;
  --container-xxl: 1800px;

  --page-gutter-sm: 16px;
  --page-gutter-md: 24px;
  --page-gutter-lg: 32px;

  --section-gap-sm: 32px;
  --section-gap-md: 48px;
  --section-gap-lg: 64px;
}
```

Recommended container classes:

```css
.container-md {
  width: min(100% - 48px, var(--container-md));
  margin-inline: auto;
}

.container-lg {
  width: min(100% - 48px, var(--container-lg));
  margin-inline: auto;
}

.container-xl {
  width: min(100% - 48px, var(--container-xl));
  margin-inline: auto;
}

.container-marketplace {
  width: min(100% - 48px, var(--container-xl));
  margin-inline: auto;
}
```

Use `.container-marketplace` for:

- Homepage marketplace sections
- Gig listing pages
- Search result pages
- Category pages
- Seller discovery pages

---

## 6. Breakpoint standard

Use content-based breakpoints first. Do not add breakpoints only because a device exists.

Baseline project breakpoints:

```css
/* Mobile first: default styles */

@media (min-width: 480px) {
  /* Large mobile */
}

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1440px) {
  /* Large desktop */
}

@media (min-width: 1920px) {
  /* Ultra-wide */
}
```

Do not add unnecessary micro-breakpoints.

If a specific component breaks at 1180px, add the breakpoint near the component, not globally.

---

## 7. Browser zoom behavior

Browser zoom changes the effective CSS viewport.

The layout must still behave correctly at:

- 25%
- 33%
- 50%
- 67%
- 75%
- 90%
- 100%
- 125%
- 150%
- 200%

Required behavior:

- No tiny centered island at low zoom.
- No horizontal scroll at normal desktop sizes.
- Text remains readable at high zoom where possible.
- Cards reflow instead of overlapping.
- Footer remains connected to the page flow.

Agents must not solve browser zoom issues using `zoom`, `scale`, or JavaScript resize hacks.

---
## 7.5 Desktop Density & Zoom-Stable Layout

Responsive design is not only about mobile behavior.

Marketplace applications must also remain visually dense, readable, and proportional on:

- 1920px displays
- 2560px displays
- 3440px ultra-wide displays
- Browser zoom levels below 100%

A page that technically "works" but collapses into a tiny centered island is considered a responsive failure.

### Symptoms

Common anti-pattern (Horizontal):
```txt
Header
   small content island
Large empty area
Footer
```

Common anti-pattern (Vertical Detachment / "Ốc đảo"):
```txt
Header
[ MASSIVE EMPTY GAP at 33% zoom ]
   small content island
[ MASSIVE EMPTY GAP at 33% zoom ]
```

### 🛑 STRICT RULE: Vertical Zoom-Out Detachment
NEVER use `align-items: center` combined with `min-height: 100vh` (or `100dvh`) for page wrappers or main layout containers (like Auth pages, Modals, etc.).
At low zoom levels (e.g., 33%), the effective viewport height becomes massive (e.g., 2500px). `align-items: center` will force the content block to the exact middle, creating a huge, broken gap separating it from the Header.

**Correct approach:**
Always use `align-items: flex-start` (so content flows naturally from top to bottom) and use a `clamp()` function for `padding-top` or `margin-top` to control the space safely.

```css
/* WRONG */
.container {
  display: flex;
  align-items: center; /* ❌ Breaks at 33% zoom */
  min-height: 100dvh;
}

/* CORRECT */
.container {
  display: flex;
  align-items: flex-start; /* ✅ Safe at all zoom levels */
  padding-top: clamp(32px, 8vh, 120px); /* ✅ Limits max gap */
  min-height: 100dvh;
}
```

## 8. Layout audit procedure

When fixing responsive issues, perform this audit before modifying code.

### 8.1 Trace layout hierarchy

Trace from root to target component:

```txt
html
body
#root
App
Layout
MainLayout
Page
Section
Container
Grid or Flex wrapper
Component
```

For each layer, report:

- File path
- Selector or component name
- width
- max-width
- min-width
- display
- flex rules
- grid-template-columns
- overflow
- padding
- margin
- transform
- zoom
- computed runtime width at target viewport

### 8.2 Detect nested constraints

Look for patterns like:

```txt
1400px container
  1200px wrapper
    960px content
      780px grid
```

Nested max-width constraints are a common cause of tiny centered layout on large screens.

Fix by keeping only the necessary constraint at the correct layer.

### 8.3 Detect fixed card/grid layout

Search for:

```txt
repeat(4,
repeat(5,
repeat(6,
180px
200px
220px
width: fit-content
max-content
min-content
```

These often cause marketplace content to stop expanding on large screens.

### 8.4 Detect dangerous viewport units

Search for:

```txt
100vw
100vh
font-size: vw
width: vw
left: vw
```

Allowed:

- `100dvh` or `100vh` for app shell minimum height if tested.
- `100vw` for overlays only if no horizontal scrollbar is introduced.

Do not use viewport units for root font-size unless deliberately using a controlled `clamp()` token.

### 8.5 Detect layout hacks

Search for:

```txt
zoom:
transform: scale
scale(
position: absolute
left:
top:
translate
```

These are suspicious when used on page wrappers, sections, grids, and layout containers.

---

## 9. Standard fixes by problem type

### 9.1 Problem: Page becomes tiny at 33% zoom

Likely causes:

- Nested max-width constraints
- Fixed grid columns
- Fixed card widths
- Too small max-width for marketplace sections
- Global scale or zoom hack

Fix order:

1. Remove page-level `scale` or `zoom` hacks.
2. Flatten nested width constraints.
3. Use `.container-marketplace` with `max-width: 1680px` or `1800px`.
4. Convert fixed card grid to `auto-fit` or `auto-fill`.
5. Verify at 1920, 2560, 3440, and 3840 viewport widths.

### 9.2 Problem: Horizontal scrolling appears

Likely causes:

- `width: 100vw` on page wrapper
- Fixed-width child wider than parent
- Grid columns with fixed pixels and no wrapping
- Long text without wrapping
- Negative margins

Fix patterns:

```css
* {
  box-sizing: border-box;
}

img,
video {
  max-width: 100%;
  height: auto;
}

.long-text {
  overflow-wrap: anywhere;
}
```

### 9.3 Problem: Cards overlap

Likely causes:

- Fixed height
- Absolute positioning
- Missing `min-width: 0`
- Long text
- Grid/flex item shrink problems

Fix patterns:

```css
.card {
  min-width: 0;
  height: auto;
}

.card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 9.4 Problem: Footer floats too high or large blank space appears

Required app shell:

```css
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.main-content {
  /* Do NOT use flex: 1; let content determine height */
  width: 100%;
}
```

Do not position footer with absolute positioning unless this is a special full-screen layout.

---

## 10. Typography and spacing

Use `rem` for text and scalable spacing tokens.

Recommended:

```css
:root {
  --font-body: clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem);
  --font-title: clamp(1.5rem, 1.2rem + 1vw, 2.25rem);
  --space-section: clamp(32px, 4vw, 72px);
  --space-card-gap: clamp(16px, 2vw, 28px);
}
```

Avoid:

```css
html {
  font-size: 0.5vw;
}
```

Root font-size based only on viewport width can make the entire UI unreadable at extreme widths or zoom levels.

---

## 11. Image and media rules

All images and videos inside responsive components must follow:

```css
img,
video {
  max-width: 100%;
  height: auto;
}

.media-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.media-frame img,
.media-frame video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Do not let images define the layout width.

The layout defines the media width.

---

## 12. Accessibility and usability requirements

Responsive fixes must not reduce accessibility.

Agents must check:

- Text remains readable.
- Interactive targets remain usable.
- Keyboard focus is visible.
- Navigation can be reached by keyboard.
- Content order remains logical.
- Mobile navigation does not hide critical actions without a clear control.
- High zoom does not make core actions inaccessible.

---

## 13. Do not change

Unless the task explicitly asks for it, do not change:

- Business logic
- API contracts
- Authentication flow
- Authorization logic
- Database schema
- Payment logic
- Order lifecycle
- Review logic
- User roles
- Routing structure
- Data fetching behavior
- Component names used by tests

Responsive work should be CSS and layout-component focused unless the root cause requires a structural UI refactor.

---

## 14. Acceptance criteria

A responsive layout task is complete only if all criteria below pass.

### 14.1 Viewport tests

Test these viewport widths:

- 375px
- 480px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px
- 2560px
- 3440px
- 3840px

### 14.2 Browser zoom tests

Test at:

- 33%
- 50%
- 67%
- 75%
- 100%
- 125%
- 150%
- 200%

### 14.3 Visual acceptance

Must pass:

- No global shrink effect.
- No tiny centered island on large viewport or low zoom.
- No unintended horizontal scrollbar.
- Header, main, and footer align to same container strategy.
- Marketplace cards reflow or expand naturally.
- Footer remains in normal document flow.
- No overlap between text, cards, buttons, icons, or navigation.
- Long text does not break card layout.
- Empty/loading states do not collapse containers.

### 14.4 Code acceptance

Must pass:

- No `zoom` property for layout.
- No page-level `transform: scale`.
- No fixed full-page width.
- No unnecessary nested max-width wrappers.
- Grid uses responsive columns where marketplace content is dynamic.
- CSS tokens are reused instead of random one-off values.

---

## 15. Required agent output format

After completing a responsive task, the agent must report:

```md
# Responsive Fix Report

## Root Cause
Explain the exact cause. Do not give generic responsive theory.

## Files Modified
- path/to/file
- path/to/file

## Before
Describe the previous layout behavior with concrete selectors and values.

## After
Describe the fixed layout behavior with concrete selectors and values.

## Validation
- 375px: pass/fail
- 768px: pass/fail
- 1440px: pass/fail
- 1920px: pass/fail
- 2560px: pass/fail
- 3440px: pass/fail
- 33% zoom: pass/fail
- 50% zoom: pass/fail
- 100% zoom: pass/fail
- 150% zoom: pass/fail
- 200% zoom: pass/fail

## Remaining Risks
List any unresolved layout risks or assumptions.
```

---

## 16. Recommended search commands for agents

Use these searches before fixing suspicious layout issues.

```txt
max-width:
width:
min-width:
grid-template-columns
repeat(
auto-fit
auto-fill
fit-content
max-content
min-content
100vw
100vh
transform: scale
zoom:
overflow-x
position: absolute
```

If using ripgrep:

```bash
rg "max-width|width:|min-width|grid-template-columns|repeat\(|auto-fit|auto-fill|fit-content|max-content|min-content|100vw|100vh|transform:\s*scale|zoom:|overflow-x|position:\s*absolute" src
```

---

## 17. Preferred implementation patterns

### 17.1 Marketplace page shell

```tsx
export function MarketplacePageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="marketplace-page">
      <div className="container-marketplace">
        {children}
      </div>
    </main>
  );
}
```

```css
.marketplace-page {
  width: 100%;
}

.container-marketplace {
  width: min(100% - 48px, 1680px);
  margin-inline: auto;
}

@media (max-width: 767px) {
  .container-marketplace {
    width: min(100% - 32px, 100%);
  }
}
```

### 17.2 Responsive gig grid

```css
.gig-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  align-items: start;
}

@media (min-width: 1920px) {
  .gig-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}
```

### 17.3 Controlled max card width option

Use this if cards become visually too wide.

```css
.gig-grid-controlled {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 320px));
  justify-content: start;
  gap: 24px;
}
```

---

## 18. Product-specific guidance for FreelanceFlow

FreelanceFlow is a freelance marketplace. Marketplace screens should prioritize:

1. Search and discovery
2. Category navigation
3. Service cards
4. Trust signals
5. Clear CTAs
6. Seller/client workflows
7. Consistent responsive behavior

Do not simply copy Fiverr visuals.

Keep the principle:

- Search-first layout
- Clear category discovery
- Responsive card grid
- Stable header and footer
- Professional spacing and density

Adapt to FreelanceFlow's product logic and branding.

---

## 19. Source references for responsive principles

These are reference materials for human review and agent context.

- MDN: Responsive web design: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
- MDN: CSS grid layout: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout
- MDN: Common CSS grid layouts: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Common_grid_layouts
- web.dev: Learn Responsive Design: https://web.dev/learn/design/
- web.dev: CSS Grid: https://web.dev/learn/css/grid/
- web.dev: User interface patterns: https://web.dev/learn/design/ui-patterns/
- AGENTS.md format: https://agents.md/

---

## 20. Final rule

When in doubt, do not guess.

Audit computed layout values first, then change the smallest number of layout rules required to make the page fluid, centered, readable, and stable across viewport and browser zoom conditions.
## Marketplace Density Principle FreelanceFlow should behave like a modern marketplace, not a traditional corporate website. Corporate websites may intentionally center a narrow content column. Marketplace applications should prioritize: - discovery density - browseability - card visibility - search efficiency - viewport utilization On larger screens the user should see: - more services - more sellers - more recommendations - more filters
- more useful content and not simply larger empty margins.

If a responsive implementation preserves layout correctness but wastes significant viewport space, the implementation should be considered incomplete.

---

## 21. Page Content Flow Architecture

Every screen must inherit AppShell. Every whitespace must have a DOM owner. Empty space without an owner is a defect.

A page must never reserve vertical space for missing content.

The height of the main content area must be determined by rendered content.

Bad:

```css
.main-content {
    height: 100vh;
}
```

## 22. Empty Space Audit

For every page: 
Measure: 
```txt 
Header Bottom to First Content Block 
Last Content Block to Footer
```

---

## 23. Height-Aware Responsive Design

### 23.1 The problem

Most responsive guidelines focus on **viewport width** only. But many real-world layouts break on **short viewports** — especially:

- Laptop screens at 100% zoom (typical effective viewport: 1536×730 or 1366×625)
- Tablets in landscape mode
- Split-screen / half-screen browser windows
- High-DPI displays with 125%–150% system scaling

Pages with many form fields (Auth, Profile, Settings, Checkout) are most affected because they stack vertically and easily overflow.

### 23.2 Strict rules

#### Rule 1: Never assume viewport height ≥ 900px

The most common laptop viewport height at 100% zoom is **625–730px** (after OS taskbar + browser chrome). Always test with `max-height: 800px` as the compact threshold.

#### Rule 2: Use `@media (max-height)` for form-heavy pages

Add height-based breakpoints alongside width-based ones. These are **not optional** for any page containing more than 4 stacked input fields.

```css
/* Width breakpoints (existing) */
@media (max-width: 900px) { /* tablet */ }
@media (max-width: 480px) { /* mobile */ }

/* Height breakpoints (required for form pages) */
@media (max-height: 800px) { /* laptop compact mode */ }
@media (max-height: 600px) { /* ultra-compact / split-screen */ }
```

#### Rule 3: Never use fixed min-height on content cards

Do not use `min-height` on cards, modals, or content containers that hold variable-length forms.

```css
/* WRONG */
.auth-card {
  min-height: 560px; /* ❌ Forces card taller than viewport on laptops */
}

/* CORRECT */
.auth-card {
  max-height: calc(100dvh - var(--header-top-bar-h) - 2rem); /* ✅ Constrained to viewport */
}
```

#### Rule 4: Add overflow-y: auto on scrollable panels

When a form panel is constrained by max-height, it must have `overflow-y: auto` so content can scroll internally rather than overflowing the card boundary.

```css
.form-panel {
  overflow-y: auto; /* ✅ Graceful scroll if content exceeds max-height */
  flex: 1;
}
```

### 23.3 Compact mode pattern

When `@media (max-height: 800px)` activates, reduce these values:

| Element | Normal | Compact |
|---------|--------|---------|
| Container padding-top | `clamp(16px, 5vh, 64px)` | `12px` fixed |
| Section header margin-bottom | `var(--space-6)` (24px) | `var(--space-3)` (12px) |
| Form field margin-bottom | `var(--space-3)` (12px) | `var(--space-1)` (4px) |
| Input padding (vertical) | `0.75rem` (12px) | `0.5rem` (8px) |
| Input label margin-bottom | `var(--space-2)` (8px) | `var(--space-1)` (4px) |
| Input label font-size | `0.875rem` | `0.8125rem` |
| Input font-size | `1rem` | `0.9375rem` |
| Footer margin/padding | `var(--space-6)` (24px) | `var(--space-3)` (12px) |

### 23.4 Reference implementation

Auth page compact mode (applied in `AuthLayout.module.css`, `RegisterPage.module.css`, `Input.module.css`):

```css
/* AuthLayout — height compact */
@media (max-height: 800px) {
  .authContainer {
    padding-top: var(--space-3);
    padding-bottom: var(--space-3);
  }

  .formPanel {
    padding-top: var(--space-4);
    padding-bottom: var(--space-4);
  }

  .header {
    margin-bottom: var(--space-3);
  }
}

/* RegisterPage — height compact */
@media (max-height: 800px) {
  .form > div {
    margin-bottom: var(--space-1);
  }

  .footer {
    margin-top: var(--space-3);
    padding-top: var(--space-3);
  }
}

/* Input component — height compact */
@media (max-height: 800px) {
  .label {
    font-size: 0.8125rem;
    margin-bottom: var(--space-1);
  }

  .input {
    padding: 0.5rem var(--space-3);
    font-size: 0.9375rem;
  }
}
```

---

## 24. Form-Dense Page Optimization

### 24.1 When to apply

Apply these rules to any page containing **5 or more stacked form fields**, including:

- Registration / Sign Up pages
- Profile edit pages
- Settings pages
- Checkout / payment forms
- Seller onboarding flows
- Multi-step wizards (per step)

### 24.2 Layout architecture for form pages

Use a **two-column card layout** on desktop: marketing/visual panel (left) + form panel (right).

```txt
┌──────────────────────────────────────┐
│  Marketing Panel (55%)  │  Form (45%)│
│  ┌────────────────────┐ │ Logo       │
│  │ Background Image   │ │ Title      │
│  │ + Stats Overlay     │ │ Fields...  │
│  │ + Marketing Title   │ │ CTA Button │
│  └────────────────────┘ │ Footer Link│
└──────────────────────────────────────┘
```

Collapse to single column at `max-width: 900px`. Hide marketing panel at `max-width: 480px`.

### 24.3 Vertical space budget

On a 730px viewport (typical laptop at 100% zoom with header), the available form area is approximately:

```txt
Viewport height:           730px
- Header:                  -65px
- Container padding (top): -12px (compact) to -36px (normal)
- Container padding (bot): -12px (compact) to -16px (normal)
- Card border/radius:      -2px
- Form panel padding:      -32px (16px top + 16px bottom, compact)
─────────────────────────────
Available for form content: ~600-605px (compact mode)
```

Each standard input field consumes approximately:

```txt
Label (13px font + 4px margin):    ~17px
Input (8px pad + 15px text + 8px): ~33px (compact)
Margin between fields:             ~4px (compact)
─────────────────────────────────
Total per field:                   ~54px (compact)
```

Budget for 6 fields: `6 × 54px = 324px`, leaving ~280px for title, button, terms text, and footer. This is a tight but workable budget.

### 24.4 Visual quality rules for compact forms

Compact does not mean ugly. Follow these rules to maintain visual quality while saving space:

#### Rule 1: Maintain clear visual hierarchy

Even in compact mode, ensure:
- **Title** is visually distinct (bold, 1.2-1.35rem)
- **Labels** are clearly associated with inputs (smaller but bold: 600 weight, 0.8125rem)
- **CTA button** remains full-width and prominent (do NOT reduce button padding)
- **Error messages** remain visible (0.75rem, color: error, no truncation)

#### Rule 2: Use consistent spacing ratios

All spacing reductions must maintain **relative proportions**. Do not reduce one element's spacing without reducing its neighbors proportionally.

```css
/* BAD — inconsistent reduction */
.header { margin-bottom: 4px; }   /* was 24px → 83% reduction */
.form > div { margin-bottom: 8px; } /* was 12px → 33% reduction */

/* GOOD — proportional reduction */
.header { margin-bottom: 12px; }   /* was 24px → 50% reduction */
.form > div { margin-bottom: 4px; } /* was 12px → 67% reduction (form has more items, ok to reduce more) */
```

#### Rule 3: Group related fields visually

Use `flexbox row` for naturally paired fields (e.g., First Name + Last Name) to reduce vertical stack height:

```css
.name-row {
  display: flex;
  gap: var(--space-4);
}

.name-row > * {
  flex: 1;
}
```

This saves one full field height (~54px) — a significant gain on tight viewports.

#### Rule 4: Subtle border and shadow on card

Use `border: 1px solid var(--color-border)` and `box-shadow: var(--shadow-lg)` to create depth separation between the form card and the page background. This makes the compact form feel like a contained, polished component rather than a cramped list of fields.

#### Rule 5: Graceful degradation via overflow-y

If, after all compact optimizations, content still exceeds viewport height (e.g., when validation errors are shown), the form panel must scroll internally. The CTA button and footer should still be reachable by scrolling **inside the card**, not by scrolling the entire page.

```css
.form-panel {
  overflow-y: auto;
  /* Custom scrollbar for visual quality */
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}
```

### 24.5 Acceptance criteria for form-dense pages

A form page is considered responsive-complete when:

- [ ] All fields, CTA button, and footer link are visible at **1536×730** viewport without page scroll
- [ ] Form scrolls **internally** (inside the card) if validation errors push content below fold
- [ ] At `max-height: 800px`, compact mode activates automatically
- [ ] At `max-width: 900px`, layout collapses to single column
- [ ] At `max-width: 480px`, marketing panel is hidden
- [ ] At **33% zoom** (tall viewport), no vertical detachment / ốc đảo occurs
- [ ] Input fields remain touch-friendly (min 32px visible height in compact mode)
- [ ] Labels remain readable (min 13px / 0.8125rem)
- [ ] Visual hierarchy is preserved (title > label > input > helper text)

---