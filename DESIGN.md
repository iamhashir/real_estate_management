# Design System — Aqua Control Room

The visual and interaction language for the Real Estate Management app. The goal: a tool that feels like a calm, modern ocean dashboard — vibrant aqua and sea-blue, never boring, never a beige Excel clone. Fast to read, delightful to enter data into.

---

## 1. Design Principles

1. **Vibrant, not loud.** Aqua and sea-blue carry the identity. Color guides the eye to what matters (status, actions, money) — it never shouts everywhere at once.
2. **Glass over flat.** Surfaces use subtle translucency and depth (frosted cards, soft shadows) so the UI feels layered and alive without heavy borders.
3. **Data entry is a feature, not a chore.** Every form is fast, forgiving, and tactile — sliders, smart dropdowns, segmented toggles, inline validation. No wall of empty text boxes.
4. **Motion with meaning.** Framer Motion transitions confirm actions and guide attention. Nothing moves without a reason.
5. **Density with breathing room.** Information-dense like a control room, but rhythm and spacing keep it scannable.

---

## 2. Color Palette

A cohesive ocean gradient — from deep sea navy to bright aqua, with a warm coral accent for action and warnings.

### Brand / Sea Blues
| Token | Hex | Use |
|---|---|---|
| `--sea-950` | `#04212B` | Darkest — sidebar, deep backgrounds |
| `--sea-900` | `#063646` | Headers, nav surfaces |
| `--sea-800` | `#0A4D63` | Primary text on light, deep buttons |
| `--sea-700` | `#0E6B86` | Links, secondary actions |
| `--sea-600` | `#1390AE` | Default brand blue |

### Aqua / Accent
| Token | Hex | Use |
|---|---|---|
| `--aqua-500` | `#19C7C2` | Primary accent — CTAs, active states |
| `--aqua-400` | `#3FDCD3` | Hover glow, highlights |
| `--aqua-300` | `#7CEDE4` | Soft fills, selected chips |
| `--aqua-100` | `#D6FAF5` | Tints, table row hover |

### Surface & Neutral
| Token | Hex | Use |
|---|---|---|
| `--surface-base` | `#F4FBFC` | App background (faint aqua wash) |
| `--surface-card` | `#FFFFFF` | Cards, panels |
| `--surface-glass` | `rgba(255,255,255,0.65)` | Frosted overlays, drawers |
| `--ink-900` | `#0B1F26` | Primary text |
| `--ink-600` | `#42606B` | Secondary text |
| `--ink-400` | `#7C97A0` | Muted / placeholder |
| `--hairline` | `#DCEAEE` | Borders, dividers |

### Semantic / Status
| Token | Hex | Meaning |
|---|---|---|
| `--coral-500` | `#FF6B5E` | Action highlight, urgent, "Sold" pop |
| `--success` | `#1FB888` | Closed deal, available, paid |
| `--warning` | `#F5B53D` | Under negotiation, pending |
| `--danger` | `#E5484D` | Errors, overdue, lost deal |
| `--info` | `#1390AE` | Neutral info badges |

### Signature Gradient
Used for the hero stat band, primary buttons, and active nav.
```css
--gradient-tide: linear-gradient(135deg, #0E6B86 0%, #1390AE 45%, #19C7C2 100%);
--gradient-foam: linear-gradient(135deg, #19C7C2 0%, #3FDCD3 100%);
```

### Dark Mode
Invert surfaces toward `--sea-950`/`--sea-900`, keep aqua accents at full saturation (they glow beautifully on dark), lift text to `#EAF7F8`.

---

## 3. Typography

Pair a characterful display face with a clean, legible workhorse for data.

| Role | Font | Notes |
|---|---|---|
| Display / Headings | **Space Grotesk** | Geometric, slightly quirky — adds personality without losing professionalism |
| Body / UI | **Inter** | Highly legible at small sizes, great for dense tables and forms |
| Numerals / Money | **Inter** with `font-variant-numeric: tabular-nums` | Tabular figures so prices and stats align in columns |

> Swap the current Geist setup in `layout.tsx` for Space Grotesk (display) + Inter (body) via `next/font/google`.

### Type Scale
| Token | Size / Line | Use |
|---|---|---|
| `display-xl` | 40 / 44, Space Grotesk 600 | Dashboard hero numbers |
| `h1` | 28 / 34, Space Grotesk 600 | Page titles |
| `h2` | 20 / 28, Space Grotesk 500 | Section headers |
| `h3` | 16 / 24, Inter 600 | Card titles |
| `body` | 14 / 22, Inter 400 | Default text |
| `small` | 12 / 18, Inter 500 | Labels, captions, table headers (uppercase, `0.04em` tracking) |
| `mono` | 13 / 20, tabular | IDs, reference codes |

**Rules:** Headings use `-0.01em` tracking. Money and stats always tabular-nums. Labels are uppercase, muted, letter-spaced — they whisper so the data can speak.

---

## 4. Spacing, Radius & Elevation

- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 (Tailwind default `0.25rem` base).
- **Radius:** `--r-sm: 8px` (inputs, chips) · `--r-md: 14px` (cards) · `--r-lg: 22px` (drawers, modals) · `--r-full` (pills, avatars).
- **Elevation (soft, tinted shadows — never harsh gray):**
  ```css
  --shadow-card: 0 4px 20px -8px rgba(14,107,134,0.18);
  --shadow-float: 0 12px 40px -12px rgba(14,107,134,0.30);
  --shadow-glow: 0 0 0 3px rgba(25,199,194,0.25); /* focus ring */
  ```

---

## 5. Layout

- **Persistent shell:** Left sidebar fixed at `240px`, deep `--sea-950` with frosted-glass nav items. Active item gets the `--gradient-foam` left bar + aqua glow.
- **Top bar:** Slim, translucent, sticky — holds global search, quick-add `+` button, and user avatar.
- **Canvas:** `--surface-base` background with a barely-there aqua wash and an optional subtle wave/topographic SVG texture at 4% opacity in empty regions, so blank space never feels dead.
- **Grid:** 12-column fluid grid, `24px` gutters. Cards snap to the grid — no floating chaos.

---

## 6. Components

### Cards & Panels
Frosted white surfaces, `--r-md`, `--shadow-card`. On hover, lift slightly (`translateY(-2px)`) with the shadow deepening to `--shadow-float`. Stat cards carry a thin aqua top-accent line.

### Buttons
| Variant | Look |
|---|---|
| Primary | `--gradient-tide` fill, white text, glow on hover, presses down `scale(0.98)` |
| Secondary | White, `--sea-700` text, `--hairline` border, fills `--aqua-100` on hover |
| Ghost | Transparent, aqua text, used in toolbars |
| Danger | `--danger` outline, fills on hover |

### Badges / Status Pills
Pill-shaped, soft tinted background + saturated text. Available = aqua, Under Negotiation = warning, Sold = coral, Rented = info. A tiny pulsing dot for "live"/active states.

### Tables (the data core)
- Sticky uppercase muted headers, tabular numerals, `--aqua-100` row hover.
- Zebra striping is *off* — instead, a left status-color rail on each row reads faster.
- Inline edit: click a cell, it morphs into an input in place. No modal needed for quick fixes.
- Density toggle (comfortable / compact) in the table header.

---

## 7. Data Entry — The Crown Jewel

The promise: **adding a property, client, or deal feels fast and almost playful — never a tax form.** Entry happens in a right-aligned **glass drawer** that slides over context (you never lose your place), broken into friendly steps.

### Interaction patterns
- **Segmented toggles** instead of dropdowns for short choices: *Buy / Rent*, *Villa / Apartment / Commercial / Land*. One tap, visible options, aqua active fill.
- **Range sliders** for price and size — dual-handle, with the live value shown above the thumb and a faint histogram of existing inventory behind the track so the agent sees where this listing sits in the market.
- **Smart dropdowns / comboboxes** for clients, agents, locations — type to search, recent items pinned to top, "+ Create new" inline when no match. Picking a buyer auto-pulls their saved budget into the price slider.
- **Stepper drawer:** for deals, a 3-step flow — Property → Parties (buyer/seller/agent) → Terms (price, dates, commission) — with a slim progress rail in aqua at the top. Each step animates in from the right.
- **Live commission preview:** as the agent drags the price slider or edits the %, the commission figure recalculates and counts up (animated number) in a pinned summary card. Money feels rewarding.
- **Floating labels:** inputs start with the label centered as placeholder; on focus it floats up and shrinks, the field gets the `--shadow-glow` aqua focus ring. No separate static labels stacking vertically.
- **Date entry:** a clean calendar popover with quick chips (*Today*, *+30 days*, *End of month*) for contract/handover dates.
- **Inline validation:** validate on blur, not on submit. Green check slides in when a field is valid; errors appear as a soft coral hint beneath, never a jarring red wall.
- **Autosave drafts:** the drawer saves a draft as you type, so an interrupted entry is never lost — a quiet "Draft saved" toast confirms.

### Micro-feel
- Every successful save: drawer slides out, the new row in the table flashes a brief aqua highlight then settles — visible proof the data landed.
- Sliders and toggles have a subtle spring (Framer Motion `type: "spring", stiffness: 300, damping: 24`).
- Empty states are illustrated with a friendly wave/anchor motif and a single clear CTA, never a blank "No data" string.

---

## 8. Motion

| Event | Motion |
|---|---|
| Drawer open/close | Slide from right, 280ms, ease `[0.22, 1, 0.36, 1]` |
| Card hover | `translateY(-2px)`, shadow deepen, 150ms |
| Page / route change | Crossfade + 8px upward settle |
| Number changes (stats, commission) | Count-up over 500ms |
| Toast | Slide up + fade, auto-dismiss 3s |
| Status change | Pill cross-fades color, brief scale pulse |

Respect `prefers-reduced-motion` — collapse to simple fades.

---

## 9. Iconography & Imagery

- **Icons:** Lucide (clean, consistent 1.5px stroke). Aqua for active, `--ink-400` for idle.
- **Texture:** subtle topographic/wave line SVGs in headers and empty regions at low opacity — reinforces the ocean theme without distraction.
- **Avatars:** clients/agents get a gradient initial avatar drawn from a deterministic sea-blue → aqua hue based on their name.

---

## 10. Implementation Notes (Tailwind v4)

Register the palette in `globals.css` under `@theme` so tokens become utilities (`bg-aqua-500`, `text-sea-800`, etc.):

```css
@theme {
  --color-sea-950: #04212B;
  --color-sea-600: #1390AE;
  --color-aqua-500: #19C7C2;
  --color-aqua-100: #D6FAF5;
  --color-coral-500: #FF6B5E;
  /* …rest of palette… */
  --font-display: var(--font-space-grotesk);
  --font-sans: var(--font-inter);
  --radius-md: 14px;
  --shadow-card: 0 4px 20px -8px rgba(14,107,134,0.18);
}
```

Build reusable primitives early: `<Button>`, `<Drawer>`, `<StatCard>`, `<StatusPill>`, `<RangeSlider>`, `<Combobox>`, `<SegmentedToggle>`, `<DataTable>`. Compose every screen from these so the aqua language stays consistent everywhere.
