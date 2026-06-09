# Implementation Plan — Real Estate Management App

## Agent Instructions
> **CRITICAL — READ BEFORE DOING ANYTHING:**
> This file is the single source of truth for build progress.
> Every time you complete a task — no matter how small — you MUST:
> 1. Open this file
> 2. Find the exact line for that task
> 3. Replace the ❌ with ✅
> 4. Commit the updated file alongside your code commit
>
> Do NOT mark something ✅ until it is fully built, responsive on all breakpoints, and uses the correct tokens from `globals.css`. Partial work stays ❌.
> Do NOT skip steps. Build in the order written — later phases depend on earlier ones.

---

## Phase 0 — Pre-Code Setup
- ✅ Install dependencies (convex, lucide-react, clsx, tailwind-merge)
- ✅ `globals.css` — full `@theme` token block (colors, fonts, radius, shadows, gradients)
- ✅ `app/layout.tsx` — Space Grotesk + Inter fonts, metadata, Providers wrapper
- ✅ `components/providers.tsx` — ConvexProvider with graceful fallback
- ✅ `convex/schema.ts` — all 5 tables with validators and indexes
- ✅ `convex/helpers.ts` — logActivity, calculateCommission, pagination
- ✅ `convex/properties.ts` — full CRUD + countByStatus
- ✅ `convex/clients.ts` — full CRUD + getProfile
- ✅ `convex/deals.ts` — full CRUD + pipeline + advanceStage
- ✅ `convex/agents.ts` — full CRUD
- ✅ `convex/activity.ts` — listForEntity + addNote
- ✅ `convex/dashboard.ts` — single aggregation query, no N+1
- ✅ `lib/constants.ts` — all enums, breakpoints, layout dimensions
- ✅ `lib/types.ts` — all domain types and form payloads
- ✅ `lib/utils.ts` — cn, formatCurrency, formatDate, avatarColor, status helpers
- ✅ `hooks/useBreakpoint.ts` — SSR-safe breakpoint hook
- ✅ `hooks/useProperties.ts` — all queries and mutations wrapped
- ✅ `hooks/useClients.ts` — all queries and mutations wrapped
- ✅ `hooks/useDeals.ts` — all queries and mutations wrapped
- ✅ `hooks/useDashboard.ts` — dashboard stats hook
- ✅ Route structure — `/` → `/dashboard`, `(shell)` route group
- ✅ `app/(shell)/layout.tsx` — structural shell skeleton
- ✅ `app/(shell)/dashboard/page.tsx` — skeleton stub
- ✅ `app/(shell)/properties/page.tsx` — skeleton stub
- ✅ `app/(shell)/clients/page.tsx` — skeleton stub
- ❌ `npx convex dev` — **HUMAN STEP** (requires Convex account login, generates `_generated/` and `.env.local`)

---

## Phase 1 — UI Primitives (`components/ui/`)
> Build these first. Every other component is composed from these.
> Rules: pure components, no Convex calls, no domain logic.

- ❌ `Button.tsx` — variants: primary (gradient-tide), secondary, ghost, danger. All min-h-[44px]. Loading spinner state. Disabled state.
- ❌ `Input.tsx` — floating label, aqua focus ring (shadow-glow), error state with coral hint, always text-base on mobile (prevents iOS zoom)
- ❌ `Textarea.tsx` — floating label, same focus/error behaviour as Input
- ❌ `Select.tsx` — styled native select with floating label and aqua chevron
- ❌ `StatusPill.tsx` — pill badge mapping status/stage value → color via constants. Pulsing dot for "active" states. Never inline badge styling anywhere else.
- ❌ `Badge.tsx` — small label badge, separate from StatusPill (used for property type, listing type chips)
- ❌ `Card.tsx` — frosted white surface, rounded-md, shadow-card. Hover: translateY(-2px) + shadow-float. Accepts `accent` prop for top color bar.
- ❌ `Avatar.tsx` — deterministic initial avatar using avatarColor() from lib/utils. Sizes: sm / md / lg.
- ❌ `Spinner.tsx` — aqua ring spinner, sizes: sm / md / lg
- ❌ `Drawer.tsx` — RIGHT SIDE on tablet/desktop (480px), BOTTOM SHEET on mobile (90vh, swipe-down dismiss). Framer Motion animation. Backdrop dimming. Portal rendered.
- ❌ `Modal.tsx` — centered on tablet/desktop, bottom sheet on mobile. For single-question confirmations only. Backdrop blur.
- ❌ `Toast.tsx` — slide-up + fade notification. Success (aqua), error (coral), info (sea). Auto-dismiss 3s. Stack multiple toasts.
- ❌ `SegmentedToggle.tsx` — pill-shaped tabs (e.g. Buy / Rent, Villa / Apartment). Aqua active fill with spring animation. Min touch target 44px.
- ❌ `Combobox.tsx` — searchable dropdown. Recent items pinned at top. Inline "+ Create new" option. Keyboard navigable. Used for client, agent, location pickers.
- ❌ `RangeSlider.tsx` — dual-handle price/size slider. Live value above thumb. Aqua track. Spring animation on drag. Accepts min/max/step.
- ❌ `DataTable.tsx` — sticky uppercase headers, tabular-nums, aqua-100 row hover. Left status-color rail per row. Density toggle (comfortable/compact). **Renders `renderCard` prop below md breakpoint** — no raw `<table>` on mobile.
- ❌ `EmptyState.tsx` — friendly empty state with icon, title, message, optional CTA button. Used when lists have no data.
- ❌ `DatePicker.tsx` — calendar popover with quick chips: Today, +30 days, End of month.
- ❌ `Skeleton.tsx` — reusable animated pulse block. Replace hardcoded `animate-pulse` divs in page stubs.

---

## Phase 2 — Layout Shell (`components/layout/`)
> Depends on: Phase 1 (Button, Avatar, Badge)

- ❌ `Sidebar.tsx` — desktop: 240px full with labels + icons. Tablet: 64px icons-only (collapsed prop). Active nav item: gradient-foam left bar + aqua glow. sea-950 background. Logo at top, agent avatar at bottom.
- ❌ `TopBar.tsx` — 56px height, translucent bg-surface-card/80 backdrop-blur. Global search input (left). "+ New" quick-add button (right). Agent avatar + name (right). Responsive: full-width on mobile.
- ❌ `BottomTabBar.tsx` — mobile only (hidden md:hidden). Fixed bottom. 64px. safe-bottom padding. Icons + labels for Dashboard, Properties, Clients. Active tab: aqua icon + label. bg-surface-card, border-t hairline.
- ❌ `PageShell.tsx` — wrapper that offsets content for sidebar. lg: ml-60, md: ml-16, mobile: no offset + pb-16 for bottom bar. Never hardcode sidebar width in page files.
- ❌ `SplitPane.tsx` — desktop (≥lg): left 380px fixed + right fluid. Tablet: single list, right panel slides in as overlay. Mobile: single list, right panel is full-screen. Manages selectedId state internally or via props.

---

## Phase 3 — Wire Shell Into App
> Depends on: Phase 2

- ❌ `app/(shell)/layout.tsx` — replace `<aside>` and `<nav>` placeholders with real `<Sidebar>`, `<TopBar>`, `<BottomTabBar>`, `<PageShell>`
- ❌ Verify shell renders correctly on mobile, tablet, desktop

---

## Phase 4 — Dashboard (`components/dashboard/` + page)
> Depends on: Phase 1 (Card, StatusPill, Skeleton), Phase 2 (layout wired)
> Data: useDashboard() hook

- ❌ `StatCard.tsx` — single stat card: label (text-label), value (text-display-xl tabular-nums), subtitle, aqua top-accent bar. Animated count-up on mount (Framer Motion, 500ms).
- ❌ `StatBand.tsx` — 4-column grid of StatCards. 2-col on mobile, 4-col on desktop. Receives overview object from useDashboard().
- ❌ `PipelinePanel.tsx` — active deals list grouped by stage. Each row: property name, buyer name, stage pill, agreed price. Click → opens deal detail drawer.
- ❌ `RecentActivity.tsx` — latest 10 activity entries. Relative timestamps (formatRelativeDate). Entity type icon. Scrollable.
- ❌ `app/(shell)/dashboard/page.tsx` — replace skeleton with StatBand + 2-col grid (PipelinePanel + RecentActivity)

---

## Phase 5 — Properties (`components/properties/` + page)
> Depends on: Phase 1 (DataTable, StatusPill, Badge, EmptyState, Drawer), Phase 2

- ❌ `PropertyFilters.tsx` — filter chip bar: status, type, listing type, city. Horizontal scroll on mobile. Clears individually or all at once.
- ❌ `PropertyRow.tsx` — single table row: name, type badge, city, price (formatCurrency), size, status pill, actions menu (edit, change status, delete)
- ❌ `PropertyCard.tsx` — mobile card view for DataTable renderCard prop: name + address, price large, type badge, status pill, action button
- ❌ `PropertyTable.tsx` — DataTable with PropertyRow + PropertyCard. Passes all required props. Handles empty state.
- ❌ `app/(shell)/properties/page.tsx` — replace skeleton: PropertyFilters + PropertyTable + "+ New Property" button wired to PropertyFormDrawer

---

## Phase 6 — Clients (`components/clients/` + page)
> Depends on: Phase 1 (Avatar, StatusPill, DataTable, Drawer, EmptyState), Phase 2 (SplitPane)

- ❌ `ClientListItem.tsx` — single row in client list: Avatar + name + phone + type badge + status pill. Tap to select.
- ❌ `ClientList.tsx` — searchable, filterable list of ClientListItems. Uses useClients(). Handles empty state.
- ❌ `ClientDealRow.tsx` — compact deal row used inside client profile: property name, stage, price, date
- ❌ `ClientProfile.tsx` — right-panel detail view. Sections: Contact info, Budget & Preferences, Linked Deals (ClientDealRow list), Activity feed (RecentActivity), Notes. Uses useClientProfile().
- ❌ `app/(shell)/clients/page.tsx` — replace skeleton with SplitPane wrapping ClientList (left) + ClientProfile (right). "+ New Client" button wired to ClientFormDrawer.

---

## Phase 7 — Deals (`components/deals/`)
> Depends on: Phase 1 (Card, StatusPill, Badge), Phase 5 (Properties), Phase 6 (Clients)
> Deals surface in Dashboard and ClientProfile — no standalone page

- ❌ `DealStageChip.tsx` — compact stage indicator with color from DEAL_STAGES constants
- ❌ `DealCard.tsx` — deal summary card: property name, buyer/seller names, stage chip, agreed price, commission amount. Used in PipelinePanel and ClientProfile.
- ❌ `DealDetail.tsx` — full deal detail view rendered inside a Drawer. All fields + activity log + stage advancement buttons.

---

## Phase 8 — Forms (`components/forms/`)
> Depends on: Phase 1 (all primitives), Phase 7

- ❌ `PropertyFormDrawer.tsx` — 2-step drawer. Step 1: name, address, city/area (Combobox), type (SegmentedToggle), listing type (SegmentedToggle). Step 2: price (RangeSlider + input), size, bedrooms, bathrooms, features (multi-select chips), description. Floating labels throughout. Inline validation on blur. Autosave draft.
- ❌ `ClientFormDrawer.tsx` — 1-step drawer. Fields: type (SegmentedToggle), first/last name, phone, email, nationality (Combobox), budget range (RangeSlider), preferred types (chip select), preferred locations (Combobox), notes. Inline validation. Autosave draft.
- ❌ `DealFormDrawer.tsx` — 3-step drawer. Step 1: select property (Combobox, shows available only). Step 2: buyer (Combobox from clients), seller (Combobox), agent (Combobox). Step 3: list price, agreed price (RangeSlider), commission rate input, commission amount (live animated preview using calcCommission()), contract date (DatePicker), handover date (DatePicker), notes. Inline validation. Autosave draft.
- ❌ Live commission preview — animated count-up (Framer Motion) in DealFormDrawer Step 3 as price/rate changes
- ❌ Draft autosave — persist incomplete form state to localStorage, restore on re-open, show "Draft saved" toast
- ❌ Success behaviour — drawer closes, new row flashes aqua highlight for 1s, success toast fires
- ❌ Duplicate detection — warn before creating a property/client that closely matches an existing one

---

## Phase 9 — Polish & Animation
> Depends on: All phases above

- ❌ Framer Motion drawer open/close — slide from right 280ms ease `[0.22, 1, 0.36, 1]`
- ❌ Framer Motion bottom sheet — slide up on mobile, spring dismiss on swipe-down
- ❌ Page/route transitions — crossfade + 8px upward settle
- ❌ Card hover animation — translateY(-2px), shadow deepen, 150ms
- ❌ Status pill change — cross-fade color + brief scale pulse
- ❌ Number count-up — all stat values animate on mount and on data change (500ms)
- ❌ Toast slide-up animation — enter/exit with Framer Motion
- ❌ `prefers-reduced-motion` — collapse all animations to simple fade when user prefers reduced motion
- ❌ Empty states — illustrated with wave/anchor motif SVG, friendly text, single CTA
- ❌ Row flash on save — new/updated row briefly highlights aqua then settles

---

## Phase 10 — Error Handling & Edge Cases

- ❌ Error boundaries — wrap shell and each major page section
- ❌ Mutation error handling — expose `error` state from all mutation hooks, show toast on failure
- ❌ Optimistic updates — add to create/update mutations for instant UI response
- ❌ Network offline state — gentle banner indicating Convex is reconnecting
- ❌ 404 page — styled with app branding, link back to dashboard
- ❌ Loading states — Skeleton component replaces all hardcoded `animate-pulse` divs

---

## Phase 11 — Responsive QA (every component, every breakpoint)

- ❌ Mobile (<768px) — full app walkthrough: navigation, all pages, all forms, drawers as bottom sheets
- ❌ Tablet (768–1023px) — sidebar icon-only, split-screen slide-over, drawers full-width
- ❌ Desktop (≥1024px) — full sidebar, split-screen two-panel, 480px drawers
- ❌ Touch targets — audit all interactive elements ≥ 44×44px
- ❌ iOS safe area — bottom bar and bottom sheets respect env(safe-area-inset-bottom)
- ❌ iOS input zoom — all inputs are text-base (16px) on mobile
- ❌ Keyboard navigation — focus rings visible, tab order logical throughout

---

## Phase 12 — Final Wiring & Cleanup

- ❌ Remove all `animate-pulse` placeholder skeletons from page stubs — replaced by Skeleton component
- ❌ Update `CLAUDE.md` with any conventions discovered during build
- ❌ Verify all money values use `formatCurrency()` — no raw `.toLocaleString()`
- ❌ Verify all status badges use `StatusPill` — no inline badge styling
- ❌ Verify no arbitrary Tailwind colors (`text-[#abc]`) anywhere in codebase
- ❌ Verify `useBreakpoint()` used for all JS-driven responsive logic — no `window.innerWidth` direct calls
- ❌ Final `npm run build` — zero TypeScript errors, zero build warnings
