# Features — Real Estate CRM ("Aqua Control Room")

A desktop-first, mobile-aware real-estate CRM for UAE/Dubai agents. Built on
Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (`@theme`
tokens), Framer Motion, and Convex (live reactive backend).

Live deployment: `cool-sandpiper-418` · Seed with `npm run seed`.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 — CSS `@theme` tokens in `globals.css` (no `tailwind.config.js`) |
| Animation | Framer Motion + `@number-flow/react` (rolling-digit numbers) |
| Icons | Lucide (no emoji as icons) |
| Backend | Convex — typed queries/mutations, reactive, activity logging |
| Utilities | `clsx` + `tailwind-merge` (`cn()`) |

---

## Architecture

- **Route group `app/(shell)/`** wraps every page in the persistent app chrome.
- **`/` → redirects to `/dashboard`.**
- Three top-level pages: **Dashboard**, **Properties**, **Clients**.
- Deals have no standalone page — they surface in the Dashboard pipeline and in
  client profiles, and are created via a quick-add drawer.
- Data flows through typed hooks (`hooks/*`) that wrap Convex queries/mutations;
  components never call `useQuery` directly.

```
app/(shell)/        layout (ShellChrome) + dashboard / properties / clients pages
components/
  layout/           Sidebar, TopBar, BottomTabBar, PageShell, SplitPane, ShellChrome, BackgroundDecor
  ui/               19 primitives + Motion + AnimatedNumber
  dashboard/        HeroBand, StatBand, StatCard, PipelinePanel, BreakdownPanel, RecentListings
  properties/       PropertyFilters, PropertyCard, PropertyTable
  clients/          ClientList, ClientListItem, ClientDealRow, ClientProfile
  forms/            ClientFormDrawer, PropertyFormDrawer, DealFormDrawer, formHelpers
convex/             schema + properties/clients/deals/agents/activity/dashboard
hooks/              useProperties/useClients/useDeals/useDashboard/useAgents/useBreakpoint
lib/                constants, types, utils
scripts/seed.mjs    seeds the live deployment with realistic Dubai data
```

---

## Domain model (Convex)

- **Agents** — name, email, role (agent/manager/admin), active.
- **Properties** — name, address, city/area, type (villa/apartment/office/land/
  commercial), listing type (sale/rent), status (available/under_negotiation/
  sold/rented), price, size, beds, baths, floor, features, description, agent.
- **Clients** — buyer/seller/both, name, phone, email, nationality, budget range,
  preferred property types & locations, notes, status.
- **Deals** — links property + buyer + seller + agent; deal type, stage
  (lead→viewing→offer→contract→closed / cancelled), list & agreed price,
  commission rate + computed amount, contract/handover dates.
- **Activity** — append-only log; auto-written on create/update/status-change.

All enums live in `lib/constants.ts`; indexed queries (no full scans); parallel
lookups via `Promise.all` (no N+1).

---

## Pages & features

### Persistent shell (all pages)
- **Sidebar** — sea-950 rail; 240px (desktop) / 64px icons (tablet); active item
  is a **shared-element indicator** that springs between nav items; agent
  identity at the bottom.
- **TopBar** — translucent, global search field, **"New" quick-add menu**
  (Property / Client / Deal).
- **BottomTabBar** — mobile-only nav with safe-area inset + an "Add" action.
- **BackgroundDecor** — fixed atmospheric canvas (aqua aurora pools, topographic
  contour rings, dot grid) so empty space reads as intentional depth.
- Quick-add drawers are owned by the shell, reachable from anywhere.

### Dashboard (`/dashboard`)
- **Hero band** — gradient welcome strip: time-of-day greeting, today's date,
  three headline metrics (Portfolio value, In Pipeline, Commission MTD) with
  animated numbers.
- **Stat band** — Active Listings, Active Clients, Closed This Month,
  Commission (Month); animated count-up, icons, staggered entrance.
- **Active Pipeline** — live deals grouped by stage (property, buyer, deal type,
  price); friendly empty state.
- **Inventory breakdown** — conic-gradient **donut** + legend for properties by
  status, plus deals-by-stage bars.
- **Recent Listings** — 2-column grid of newest properties with "View all".
- All powered by a single aggregation query (`useDashboard`) + `useProperties`.

### Properties (`/properties`)
- Search by name/address/area; **filter chip bar** (listing type, status, type).
- **Responsive DataTable** — full table on desktop (status colour rail, density
  toggle, tabular figures), **card list on mobile**.
- Live count, empty state with CTA, "New Property" → 2-step form drawer.

### Clients (`/clients`)
- **Split-screen** (`SplitPane`): list (380px) + profile; on mobile the profile
  slides in as an overlay with a back button.
- **Client list** — searchable, client-type filter, avatars, status pills.
- **Client profile** — contact, budget & preferences (chips), linked deals,
  notes, and the activity feed; fades in per selection.
- "New Client" → drawer; created client is auto-selected.

### Data entry — glass drawers (quick-add or page CTAs)
- **ClientFormDrawer** (1-step) — type toggle, names, phone, email, nationality
  combobox, **budget range slider**, preferred types (chips), preferred
  locations (combobox → removable chips), notes.
- **PropertyFormDrawer** (2-step, progress rail) — listing/type toggles, name,
  address, city/area comboboxes → price, size, beds/baths/floor, feature chips,
  description.
- **DealFormDrawer** (3-step) — property → parties (buyer/seller/agent) → terms,
  with a **live animated commission preview** that recalculates as price/rate
  change.
- Shared behaviour: inline validation on blur, **draft autosave to
  localStorage**, success toast, bottom-sheet on mobile.

---

## Design system

- **Palette** — sea blues, aqua accents, coral action, semantic status colours;
  all as `@theme` tokens (no ad-hoc hex in components).
- **Type** — Space Grotesk (display) + Inter (body); tabular figures for money.
- **Depth / "crafted" feel** — layered aqua-tinted shadows, `.surface-raised`
  double-edge (outer border + inner highlight ring + depth) on cards & buttons,
  textured background canvas.
- **Motion** — `Reveal` / `Stagger` helpers, spring hover-lift, shared-element
  nav indicator, NumberFlow figures, drawer slide / bottom-sheet, segmented-
  toggle pill.
- **19 reusable UI primitives** — Button, Input, Textarea, Select, Combobox,
  RangeSlider, DatePicker, SegmentedToggle, StatusPill, Badge, Card, Avatar,
  Spinner, Skeleton, Drawer, Modal, Toast, EmptyState, DataTable.

---

## Accessibility & quality (done)

- `cursor-pointer` restored on all interactive elements; `not-allowed` on disabled.
- **`prefers-reduced-motion`** respected — global CSS + `<MotionConfig
  reducedMotion="user">` for all Framer Motion.
- Muted text token (`ink-400`) darkened to meet **WCAG AA 4.5:1** on white.
- Visible focus rings (aqua glow), 44px touch targets on controls, safe-area
  insets, mobile-first responsive at 375 / 768 / 1024 / 1440.
- Loading skeletons and friendly empty states throughout.
- Production build passes type-check with zero errors; all routes render 200.

---

## What's been solved this build

- ✅ Full persistent shell wired in (sidebar / top bar / bottom bar / split pane).
- ✅ Dashboard, Properties, Clients pages built on **live Convex data** (loading +
  empty states), not mock data.
- ✅ Create flows for clients, properties, and deals (drawers + validation +
  autosave + toasts).
- ✅ Design upgraded from "generic/flat" to layered, crafted depth + micro-motion.
- ✅ Background/empty-space and density complaints addressed (canvas + hero +
  donut + recent listings).
- ✅ Accessibility pass (cursor, reduced-motion, contrast, focus, touch targets).
- ✅ Live deployment seeded (8 properties, 6 clients, 6 deals, 2 agents).
- ✅ Two pre-existing primitive bugs fixed (`Skeleton` style prop, `StatusPill`
  label typing).

---

## Not yet done (deferred / next)

- ⬜ Edit & delete flows (mutations exist; UI not wired).
- ⬜ Deal detail drawer with stage-advancement (Phase 7).
- ⬜ New-row "aqua flash" highlight after create; duplicate detection.
- ⬜ Global activity feed on the dashboard (needs a new Convex query).
- ⬜ TopBar global search is currently presentational (per-page search is wired).
- ⬜ DataTable column sorting (`aria-sort`).
- ⬜ Error boundaries; optimistic updates; offline/reconnect banner.
- ⬜ Density pass for Properties/Clients headers; richer empty/placeholder states.
- ⬜ Auth (the "current agent" is the first active agent as a stand-in).
- ⬜ Full responsive QA (landscape, largest Dynamic Type) and dark mode.

See `implementation-plan/PLAN.md` for the phase-by-phase checklist and
`DESIGN.md` for the full visual language.
