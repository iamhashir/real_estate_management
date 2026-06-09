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
- ✅ `npx convex dev` — `_generated/` present, live deployment `cool-sandpiper-418`. Seed data via `npm run seed` (calls deployed mutations over ConvexHttpClient).

---

## Phase 1 — UI Primitives (`components/ui/`)
> Build these first. Every other component is composed from these.
> Rules: pure components, no Convex calls, no domain logic.

- ✅ `Button.tsx` — variants: primary (gradient-tide), secondary, ghost, danger. All min-h-[44px]. Loading spinner state. Disabled state.
- ✅ `Input.tsx` — floating label, aqua focus ring (shadow-glow), error state with coral hint, always text-base on mobile (prevents iOS zoom)
- ✅ `Textarea.tsx` — floating label, same focus/error behaviour as Input
- ✅ `Select.tsx` — styled native select with floating label and aqua chevron
- ✅ `StatusPill.tsx` — pill badge mapping status/stage value → color via constants. Pulsing dot for "active" states. Never inline badge styling anywhere else.
- ✅ `Badge.tsx` — small label badge, separate from StatusPill (used for property type, listing type chips)
- ✅ `Card.tsx` — frosted white surface, rounded-md, shadow-card. Hover: translateY(-2px) + shadow-float. Accepts `accent` prop for top color bar.
- ✅ `Avatar.tsx` — deterministic initial avatar using avatarColor() from lib/utils. Sizes: sm / md / lg.
- ✅ `Spinner.tsx` — aqua ring spinner, sizes: sm / md / lg
- ✅ `Drawer.tsx` — RIGHT SIDE on tablet/desktop (480px), BOTTOM SHEET on mobile (90vh, swipe-down dismiss). Framer Motion animation. Backdrop dimming. Portal rendered.
- ✅ `Modal.tsx` — centered on tablet/desktop, bottom sheet on mobile. For single-question confirmations only. Backdrop blur.
- ✅ `Toast.tsx` — slide-up + fade notification. Success (aqua), error (coral), info (sea). Auto-dismiss 3s. Stack multiple toasts.
- ✅ `SegmentedToggle.tsx` — pill-shaped tabs (e.g. Buy / Rent, Villa / Apartment). Aqua active fill with spring animation. Min touch target 44px.
- ✅ `Combobox.tsx` — searchable dropdown. Recent items pinned at top. Inline "+ Create new" option. Keyboard navigable. Used for client, agent, location pickers.
- ✅ `RangeSlider.tsx` — dual-handle price/size slider. Live value above thumb. Aqua track. Spring animation on drag. Accepts min/max/step.
- ✅ `DataTable.tsx` — sticky uppercase headers, tabular-nums, aqua-100 row hover. Left status-color rail per row. Density toggle (comfortable/compact). **Renders `renderCard` prop below md breakpoint** — no raw `<table>` on mobile.
- ✅ `EmptyState.tsx` — friendly empty state with icon, title, message, optional CTA button. Used when lists have no data.
- ✅ `DatePicker.tsx` — calendar popover with quick chips: Today, +30 days, End of month.
- ✅ `Skeleton.tsx` — reusable animated pulse block. Replace hardcoded `animate-pulse` divs in page stubs.

---

## Phase 2 — Layout Shell (`components/layout/`)
> Depends on: Phase 1 (Button, Avatar, Badge)

- ✅ `Sidebar.tsx` — desktop: 240px full with labels + icons. Tablet: 64px icons-only. Active nav item: gradient-foam left bar + aqua glow. sea-950 background. Logo at top, agent avatar at bottom.
- ✅ `TopBar.tsx` — 56px height, translucent bg-surface-card/80 backdrop-blur. Global search input (left). "+ New" quick-add menu (right, Property/Client/Deal). Responsive: full-width on mobile.
- ✅ `BottomTabBar.tsx` — mobile only (md:hidden). Fixed bottom. 64px. safe-bottom padding. Icons + labels for Dashboard, Properties, Clients + Add. Active tab: aqua icon + label.
- ✅ `PageShell.tsx` — page padding wrapper with `bleed` option. Sidebar offset + bottom-bar spacing owned by `ShellChrome` so pages never hardcode sidebar width.
- ✅ `SplitPane.tsx` — desktop (≥lg): left 380px fixed + right fluid. Tablet/mobile: single list, detail slides in as overlay with back button. Selection via props.
- ✅ `ShellChrome.tsx` — client wrapper composing Sidebar + TopBar + BottomTabBar, owns quick-add drawer state.

---

## Phase 3 — Wire Shell Into App
> Depends on: Phase 2

- ✅ `app/(shell)/layout.tsx` — renders `<ShellChrome>` (Sidebar + TopBar + BottomTabBar + quick-add drawers)
- ✅ Verify shell renders correctly — build passes, all routes 200, responsive classes per breakpoint

---

## Phase 4 — Dashboard (`components/dashboard/` + page)
> Depends on: Phase 1 (Card, StatusPill, Skeleton), Phase 2 (layout wired)
> Data: useDashboard() hook

- ✅ `StatCard.tsx` — label, value (display-xl tabular-nums), subtitle, aqua top-accent. Animated count-up on mount (500ms, respects prefers-reduced-motion).
- ✅ `StatBand.tsx` — 4-col grid (2-col mobile). Listings / clients / closed-this-month / commission-this-month from overview. Skeleton while loading.
- ✅ `PipelinePanel.tsx` — active deals grouped by stage from `stats.pipeline`. Rows: property name, buyer, deal type, price. "Calm waters" empty state.
- ✅ `BreakdownPanel.tsx` — inventory (properties by status) + deals by stage as labeled bars. (Replaces RecentActivity, which needs a global activity query not yet in the API — deferred.)
- ✅ `app/(shell)/dashboard/page.tsx` — StatBand + 2-col grid (PipelinePanel + BreakdownPanel), live `useDashboard()`.

---

## Phase 5 — Properties (`components/properties/` + page)
> Depends on: Phase 1 (DataTable, StatusPill, Badge, EmptyState, Drawer), Phase 2

- ✅ `PropertyFilters.tsx` — filter chip bar: listing type, status, type. Horizontal scroll on mobile. Single-select per category, clear all.
- ✅ `PropertyTable.tsx` — DataTable with typed columns (name, type badge, size, price, status pill) + status rail color. Handles empty state with CTA. (Row markup lives in the column renderers.)
- ✅ `PropertyCard.tsx` — mobile card view for DataTable renderCard: name + location, large price, type badge, status pill, specs.
- ✅ `app/(shell)/properties/page.tsx` — search + PropertyFilters + PropertyTable + "+ New Property" wired to PropertyFormDrawer. Live `useProperties()`.

---

## Phase 6 — Clients (`components/clients/` + page)
> Depends on: Phase 1 (Avatar, StatusPill, DataTable, Drawer, EmptyState), Phase 2 (SplitPane)

- ✅ `ClientListItem.tsx` — Avatar + name + phone + type badge + status pill. Tap to select, active highlight.
- ✅ `ClientList.tsx` — searchable + client-type filter list. Uses `useClients()`. Loading skeletons + empty state with CTA.
- ✅ `ClientDealRow.tsx` — compact deal row: property name, deal type, date, price, stage pill.
- ✅ `ClientProfile.tsx` — Contact, Budget & Preferences, Linked Deals, Notes, Activity feed. Uses `useClientProfile()`.
- ✅ `app/(shell)/clients/page.tsx` — SplitPane wrapping ClientList + ClientProfile. "+ New Client" wired to ClientFormDrawer (auto-selects created client).

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

- ✅ `PropertyFormDrawer.tsx` — 2-step drawer with progress rail. Step 1: listing/type toggles, name, address, city/area (Combobox). Step 2: price, size, beds/baths/floor, features (chips), description. Inline validation on blur. Draft autosave.
- ✅ `ClientFormDrawer.tsx` — 1-step drawer: type toggle, names, phone, email, nationality (Combobox), budget (RangeSlider), preferred types (chips), preferred locations (Combobox → removable chips), notes. Inline validation. Draft autosave.
- ✅ `DealFormDrawer.tsx` — 3-step drawer. Step 1: property (Combobox, available first) + deal type. Step 2: buyer/seller/agent (Comboboxes). Step 3: list/agreed price, commission rate, live commission preview, contract/handover dates, notes.
- ✅ Live commission preview — animated count-up (Framer Motion) recalculates as price/rate change.
- ✅ Draft autosave — `useDraft` persists form state to localStorage, restores on re-open.
- ❌ Success behaviour — drawer closes + success toast fires (✅); new-row aqua flash still TODO.
- ❌ Duplicate detection — warn before creating a near-duplicate property/client.

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
