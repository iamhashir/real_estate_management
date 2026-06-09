@AGENTS.md

# Project Conventions for AI Agents

## Stack
- Next.js 16 (App Router) + TypeScript — read `node_modules/next/dist/docs/` before writing any Next.js code
- Tailwind CSS v4 (CSS-based `@theme` in `globals.css`, NOT `tailwind.config.js`)
- Framer Motion for all animations
- Convex for backend (queries, mutations, realtime)
- Lucide React for icons (never use emoji as icons)

## Folder Map
```
convex/          Backend functions (one file per domain) + schema.ts
lib/             constants.ts · types.ts · utils.ts  ← import from here, never inline
hooks/           useProperties · useClients · useDeals · useDashboard
components/
  ui/            Reusable primitives (Button, Badge, Drawer, etc.)
  layout/        Shell (Sidebar, TopBar, PageShell)
  properties/    Property-specific components
  clients/       Client-specific components
  deals/         Deal-specific components
  dashboard/     Dashboard-specific components
  forms/         Multi-step form components
app/
  (shell)/       Route group with sidebar shell layout
    page.tsx     Dashboard
    properties/
    clients/
```

## Constants & Types
- ALL enum values (statuses, types, stages, roles) live in `lib/constants.ts`. Never hard-code strings twice.
- All TypeScript types live in `lib/types.ts`.
- The `cn()` helper lives in `lib/utils.ts`. Always use it for conditional classes.

## Convex Rules
- One file per domain: `properties.ts`, `clients.ts`, `deals.ts`, `agents.ts`, `activity.ts`, `dashboard.ts`
- Always use `.withIndex()` — never do full table scans without an index
- Batch parallel lookups with `Promise.all()` — never sequential `await` in a loop
- Activity logging is automatic via `logActivity()` in `helpers.ts` — call it in every create/update/status-change mutation
- The dashboard query in `dashboard.ts` is the single source for all stat aggregation — do not duplicate aggregation logic client-side
- Custom React hooks in `hooks/` wrap every Convex query — never call `useQuery(api.x.y)` directly in a component

## Component Rules
- UI primitives go in `components/ui/` and are pure (no Convex calls inside)
- Domain components (properties/, clients/, etc.) may use hooks
- Forms live in `components/forms/` and are multi-step drawers — never full-page navigation for data entry
- Every form uses the glass drawer pattern from DESIGN.md

## Styling Rules
- Colors from the `--sea-*`, `--aqua-*`, `--coral-*` token palette defined in `globals.css`
- Never use arbitrary Tailwind colors (`text-[#abc]`) — use tokens
- Fonts: Space Grotesk for headings (`font-display`), Inter for body (`font-sans`)
- All money values use `formatCurrency()` from `lib/utils.ts` — never raw `toLocaleString()`
- Status pills always use the `StatusPill` component — never inline badge styling

## Git
- Branch for this work: `claude/ui-ux-pro-max-plugin-wqv2rz`
- Commit scope prefixes: `feat:` `fix:` `refactor:` `style:` `docs:` `chore:`

## Convex Setup (one-time, human step)
Run once to initialize the Convex project and generate `_generated/`:
```bash
npx convex dev
```
This requires a Convex account and will create `.env.local` with `NEXT_PUBLIC_CONVEX_URL`.
The `convex/_generated/` directory is gitignored — never commit it.
