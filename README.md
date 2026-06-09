# Real Estate CRM - Control Room Edition

A high-density, desktop-first CRM designed for real estate agents to manage clients, track property matches, log purchases, and issue invoices seamlessly across a strict two-page architecture.

## Architecture & Layout Philosophy
- **Zero-Breeze UX:** No heavy margins or floating cards. Layouts are strictly locked grids.
- **Persistent Shell:** Left-hand sidebar fixed at `240px`. Main canvas fluidly scales horizontally.
- **Contextual Modals:** Multi-step creation and editing flow over existing data layers via right-aligned drawers or focused overlays.

## Core Pages
1. `/` -> **The Pipeline & Ledger:** Comprehensive Client Directory + Quick-Add Drawer + Universal Invoice Ledger.
2. `/client/:id` -> **Client Control Center:** High-density split screen containing Client Metadata, Property Match Engine (Interests), and a combined Ledger/Activity timeline tracking purchases and invoices.

## Tech Stack
- **Framework:** Next.js with TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Backend:** Convex

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
