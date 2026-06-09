# Real Estate Management — Control Room Edition

A desktop-first real estate management application built to replace spreadsheet-based workflows for real estate agents and companies. Track properties, clients, deals, commissions, and pipelines — all in one place.

---

## The Problem

Real estate agents and companies today manage their entire business in Excel or Google Sheets. This means:

- No real-time deal status tracking across the team
- Manual commission calculations prone to error
- No client history — every search is a scroll through hundreds of rows
- Duplicate entries, missing data, no validation
- Zero visibility into pipeline health or monthly performance

This app replaces all of that with a purpose-built tool designed around how agents actually work.

---

## What This App Does

### Core Data You Track
- **Properties** — name, address, type (villa / apartment / commercial / land), size, listing price, status (available / under negotiation / sold / rented)
- **Clients** — buyers and sellers as separate profiles, contact info, nationality, budget range, notes
- **Transactions / Deals** — property + buyer + seller linked together, sale or rent price, contract date, handover date, commission earned
- **Agents** — who handled the deal, their commission split

### Features That Replace Excel
- **Deal Pipeline** — track every deal from Lead → Viewing → Offer → Contract → Closed
- **Commission Calculator** — auto-calculate agent commission per deal based on configurable percentage rules
- **Client History** — see every property ever linked to a buyer or seller in one click
- **Dashboard** — total revenue, closed deals, active listings, and pipeline health at a glance
- **Search & Filter** — find "all 3-bedroom available apartments under $500k" in seconds
- **Notes & Activity Log** — log calls, viewings, and follow-ups per property or client
- **Duplicate Detection** — warns before creating a property or client that already exists
- **Reports** — monthly sales summary, revenue by agent, properties by status

### Later Phase
- PDF export (contract summaries, client reports)
- Reminders and follow-up alerts for contract renewals
- Role-based access (agent vs. manager vs. admin)
- Multi-branch / multi-office support

---

## Ideal Customer Profile (ICP)

**Primary:** Independent real estate agents managing 10–100 active deals per year who currently track everything in Excel or Google Sheets and are spending more time on admin than on selling.

**Secondary:** Small to mid-size real estate companies (2–20 agents) that need a shared system so the whole team can see deal status, client ownership, and performance without syncing spreadsheets.

**Geography:** Any market — the app is property-type and currency agnostic.

**What they care about:**
- Speed — adding a deal or client should take under 30 seconds
- Clarity — they want to see pipeline status without digging through rows
- Trust — data must never be lost or duplicated
- Simplicity — they are not technical; the UI must be obvious

**What they don't want:**
- A bloated CRM like Salesforce with 200 features they'll never use
- A tool that requires training or onboarding
- Monthly subscriptions with per-seat pricing that punishes growth

---

## Architecture & Layout

- **Zero-Breeze UX:** No heavy margins or floating cards. Layouts are strict locked grids.
- **Persistent Shell:** Left-hand sidebar fixed at `240px`. Main canvas scales fluidly.
- **Contextual Modals:** Multi-step creation and editing via right-aligned drawers or focused overlays.

### Pages
| Route | Purpose |
|---|---|
| `/` | Dashboard — pipeline overview, stats, recent activity |
| `/properties` | Full property listing with filters and status management |
| `/clients` | Client directory — buyers and sellers |
| `/deals` | Transaction ledger — all closed and active deals |
| `/client/:id` | Client control center — metadata, linked properties, deal history |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js + TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Backend | Convex |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.
