import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PROPERTY_STATUSES, DEAL_STAGES, CLIENT_STATUSES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Number / Currency ────────────────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency = "AED",
  locale = "en-AE"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-AE").format(n);
}

export function calcCommission(price: number, ratePercent: number): number {
  return Math.round((price * ratePercent) / 100);
}

// ─── Date ─────────────────────────────────────────────────────────────────────

export function formatDate(timestamp: number, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-AE", opts ?? { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(timestamp)
  );
}

export function formatRelativeDate(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function dateToTimestamp(dateStr: string): number {
  return new Date(dateStr).getTime();
}

export function timestampToDateInput(ts: number): string {
  return new Date(ts).toISOString().split("T")[0];
}

// ─── Status helpers ───────────────────────────────────────────────────────────

export function getPropertyStatusMeta(value: string) {
  return PROPERTY_STATUSES.find((s) => s.value === value);
}

export function getDealStageMeta(value: string) {
  return DEAL_STAGES.find((s) => s.value === value);
}

export function getClientStatusMeta(value: string) {
  return CLIENT_STATUSES.find((s) => s.value === value);
}

// ─── String ───────────────────────────────────────────────────────────────────

export function fullName(first: string, last: string): string {
  return `${first} ${last}`.trim();
}

export function initials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ─── Avatar color ─────────────────────────────────────────────────────────────
// Deterministic sea-blue → aqua hue from a name — same name always same color.
const AVATAR_COLORS = [
  "bg-sea-800 text-aqua-300",
  "bg-sea-700 text-aqua-300",
  "bg-sea-600 text-white",
  "bg-aqua-500 text-sea-950",
  "bg-aqua-400 text-sea-900",
];

export function avatarColor(name: string): string {
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
