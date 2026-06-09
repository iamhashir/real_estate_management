// Single source of truth for all enum-like values used across the app and Convex.
// Import from here everywhere — never hard-code strings twice.

// ─── Property ────────────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  { value: "villa",      label: "Villa" },
  { value: "apartment",  label: "Apartment" },
  { value: "office",     label: "Office" },
  { value: "land",       label: "Land" },
  { value: "commercial", label: "Commercial" },
] as const;

export const LISTING_TYPES = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
] as const;

export const PROPERTY_STATUSES = [
  { value: "available",         label: "Available",         color: "aqua" },
  { value: "under_negotiation", label: "Under Negotiation", color: "warning" },
  { value: "sold",              label: "Sold",              color: "coral" },
  { value: "rented",            label: "Rented",            color: "info" },
] as const;

export const PROPERTY_FEATURES = [
  "Parking",
  "Swimming Pool",
  "Gym",
  "Balcony",
  "Garden",
  "Sea View",
  "City View",
  "Security",
  "Furnished",
  "Elevator",
  "Central A/C",
  "Maid's Room",
  "Study Room",
  "Storage",
  "Private Pool",
] as const;

// ─── Client ───────────────────────────────────────────────────────────────────

export const CLIENT_TYPES = [
  { value: "buyer",  label: "Buyer" },
  { value: "seller", label: "Seller" },
  { value: "both",   label: "Buyer & Seller" },
] as const;

export const CLIENT_STATUSES = [
  { value: "active",   label: "Active",   color: "aqua" },
  { value: "inactive", label: "Inactive", color: "muted" },
  { value: "closed",   label: "Closed",   color: "coral" },
] as const;

export const NATIONALITIES = [
  "Emirati", "Saudi", "British", "American", "Indian", "Pakistani",
  "Egyptian", "Jordanian", "Lebanese", "Syrian", "Filipino", "Russian",
  "French", "German", "Chinese", "Canadian", "Australian", "Other",
] as const;

// ─── Deal ─────────────────────────────────────────────────────────────────────

export const DEAL_STAGES = [
  { value: "lead",       label: "Lead",       step: 1, color: "info" },
  { value: "viewing",    label: "Viewing",    step: 2, color: "sea" },
  { value: "offer",      label: "Offer",      step: 3, color: "warning" },
  { value: "contract",   label: "Contract",   step: 4, color: "aqua" },
  { value: "closed",     label: "Closed",     step: 5, color: "success" },
  { value: "cancelled",  label: "Cancelled",  step: 0, color: "danger" },
] as const;

export const DEAL_TYPES = [
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
] as const;

export const DEFAULT_COMMISSION_RATE = 2; // percent

// ─── Agent ────────────────────────────────────────────────────────────────────

export const AGENT_ROLES = [
  { value: "agent",   label: "Agent" },
  { value: "manager", label: "Manager" },
  { value: "admin",   label: "Admin" },
] as const;

// ─── Activity ─────────────────────────────────────────────────────────────────

export const ACTIVITY_TYPES = [
  { value: "created",       label: "Created",        icon: "plus-circle" },
  { value: "updated",       label: "Updated",        icon: "pencil" },
  { value: "note",          label: "Note",           icon: "message-square" },
  { value: "call",          label: "Call Logged",    icon: "phone" },
  { value: "viewing",       label: "Viewing",        icon: "eye" },
  { value: "offer",         label: "Offer Made",     icon: "file-text" },
  { value: "status_change", label: "Status Changed", icon: "refresh-cw" },
] as const;

export const ENTITY_TYPES = [
  { value: "property", label: "Property" },
  { value: "client",   label: "Client" },
  { value: "deal",     label: "Deal" },
] as const;

// ─── Locations ────────────────────────────────────────────────────────────────

export const CITIES = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah",
  "Fujairah", "Umm Al Quwain",
] as const;

export const AREAS_BY_CITY: Record<string, string[]> = {
  Dubai: [
    "Downtown Dubai", "Dubai Marina", "Palm Jumeirah", "Business Bay",
    "Jumeirah", "Dubai Hills Estate", "Arabian Ranches", "JBR",
    "DIFC", "Deira", "Bur Dubai", "Al Quoz", "Silicon Oasis",
    "Sports City", "Motor City", "Jumeirah Village Circle",
  ],
  "Abu Dhabi": [
    "Corniche", "Al Reem Island", "Yas Island", "Saadiyat Island",
    "Al Khalidiyah", "Tourist Club Area", "Khalifa City",
  ],
  Sharjah: ["Al Majaz", "Al Qasba", "Al Khan", "Al Nahda"],
  Ajman: ["Al Nuaimiyah", "Al Rashidiya", "Al Jurf"],
  "Ras Al Khaimah": ["Al Hamra Village", "Mina Al Arab", "Al Nakheel"],
  Fujairah: ["Fujairah City", "Dibba"],
  "Umm Al Quwain": ["UAQ City"],
};

// ─── UI / Pagination ──────────────────────────────────────────────────────────

export const PAGE_SIZE = 20;
export const DRAWER_ANIMATION_MS = 280;

// ─── Responsive breakpoints (px) ─────────────────────────────────────────────
// Mirror of Tailwind defaults — keep in sync with hooks/useBreakpoint.ts

export const BREAKPOINTS = {
  sm:    640,
  md:    768,   // tablet portrait — layout shifts here
  lg:    1024,  // desktop sidebar appears, split-screen activates
  xl:    1280,
  "2xl": 1536,
} as const;

// Layout dimensions — used in CSS vars and JS calculations
export const SIDEBAR_WIDTH_FULL      = 240; // px, desktop
export const SIDEBAR_WIDTH_COLLAPSED = 64;  // px, tablet icon-only
export const BOTTOM_TAB_HEIGHT       = 64;  // px, mobile bottom bar
export const DRAWER_WIDTH_DESKTOP    = 480; // px, right-side drawer
export const CLIENT_LIST_WIDTH       = 380; // px, split-screen left panel
export const TOP_BAR_HEIGHT          = 56;  // px, all breakpoints

// Navigation tabs shown in the mobile bottom bar
export const BOTTOM_NAV_TABS = [
  { href: "/dashboard",  label: "Dashboard",  icon: "layout-dashboard" },
  { href: "/properties", label: "Properties", icon: "building-2" },
  { href: "/clients",    label: "Clients",    icon: "users" },
] as const;

// ─── Derived type helpers ─────────────────────────────────────────────────────

export type PropertyType      = typeof PROPERTY_TYPES[number]["value"];
export type ListingType       = typeof LISTING_TYPES[number]["value"];
export type PropertyStatus    = typeof PROPERTY_STATUSES[number]["value"];
export type ClientType        = typeof CLIENT_TYPES[number]["value"];
export type ClientStatus      = typeof CLIENT_STATUSES[number]["value"];
export type DealStage         = typeof DEAL_STAGES[number]["value"];
export type DealType          = typeof DEAL_TYPES[number]["value"];
export type AgentRole         = typeof AGENT_ROLES[number]["value"];
export type ActivityType      = typeof ACTIVITY_TYPES[number]["value"];
export type EntityType        = typeof ENTITY_TYPES[number]["value"];
export type City              = typeof CITIES[number];
