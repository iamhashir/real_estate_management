"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  FileSignature,
  LayoutDashboard,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { usePropertySearch, useClientSearch, useDealSearch } from "@/hooks/useSearch";
import { shellNav } from "@/lib/shellNav";
import { DEAL_STAGES, CLIENT_TYPES } from "@/lib/constants";
import type { QuickAddTarget } from "./TopBar";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onQuickAdd: (target: QuickAddTarget) => void;
}

const QUICK_CREATE: { target: QuickAddTarget; label: string }[] = [
  { target: "property", label: "New Property" },
  { target: "client",   label: "New Client" },
  { target: "deal",     label: "New Deal" },
];

const NAVIGATE: { href: string; label: string; icon: typeof Building2 }[] = [
  { href: "/dashboard",  label: "Go to Dashboard",  icon: LayoutDashboard },
  { href: "/properties", label: "Go to Properties", icon: Building2 },
  { href: "/clients",    label: "Go to Clients",    icon: Users },
  { href: "/deals",      label: "Go to Deals",      icon: FileSignature },
];

const ITEM_CLASS = cn(
  "min-h-[44px] px-3 rounded-lg flex items-center gap-3 text-sm",
  "text-ink-700 cursor-pointer select-none touch-manipulation transition-colors",
  "data-[selected=true]:bg-aqua-100 data-[selected=true]:text-sea-800",
);

/**
 * Global Cmd+K / Ctrl+K command palette. Quick-add actions, page navigation,
 * and live search across properties / clients / deals (same Convex search
 * hooks as GlobalSearchPanel). Rendered once from ShellChrome.
 */
export function CommandPalette({ open, onOpenChange, onQuickAdd }: CommandPaletteProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");

  const searchQuery = query.trim().length >= 2 ? query.trim() : "";
  const properties = usePropertySearch(searchQuery);
  const clients = useClientSearch(searchQuery);
  const deals = useDealSearch(searchQuery);

  // Global Cmd+K / Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  // Reset query each time the palette opens.
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const close = () => onOpenChange(false);

  const go = (path: string) => {
    router.push(path);
    close();
  };

  const searching = searchQuery.length >= 2;
  const loading =
    searching && (properties === undefined || clients === undefined || deals === undefined);
  const totalResults =
    (properties?.length ?? 0) + (clients?.length ?? 0) + (deals?.length ?? 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="palette-backdrop"
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            onClick={close}
            aria-hidden="true"
          />

          {/* Positioning frame — mobile: sheet under top bar; desktop: centered dialog */}
          <div className="fixed inset-x-0 top-14 md:top-[20vh] z-50 flex justify-center pointer-events-none md:px-4">
            <motion.div
              key="palette-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className={cn(
                "pointer-events-auto w-full md:max-w-xl overflow-hidden",
                "rounded-b-2xl md:rounded-2xl",
              )}
              style={{
                background:
                  "var(--glass-palette)",
                backdropFilter: "blur(20px) saturate(1.5)",
                WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                border: "1px solid var(--glass-edge)",
                boxShadow:
                  "var(--shadow-palette)",
              }}
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
              transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
            >
              <Command
                shouldFilter={false}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    close();
                  }
                }}
                className={cn(
                  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3",
                  "[&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs",
                  "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide",
                  "[&_[cmdk-group-heading]]:text-ink-600 [&_[cmdk-group-heading]]:font-semibold",
                )}
              >
                {/* Input row */}
                <div
                  className="flex items-center gap-2.5 px-4"
                  style={{ borderBottom: "1px solid var(--hairline-strong)" }}
                >
                  <Search size={16} className="text-ink-400 shrink-0" />
                  <Command.Input
                    value={query}
                    onValueChange={setQuery}
                    autoFocus
                    placeholder="Search or jump to…"
                    className={cn(
                      "w-full h-12 bg-transparent outline-none",
                      "text-base md:text-sm text-ink-900 placeholder:text-ink-400",
                    )}
                  />
                </div>

                <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-1.5">
                  {/* Quick actions — always visible */}
                  <Command.Group heading="Quick actions">
                    {QUICK_CREATE.map(({ target, label }) => (
                      <Command.Item
                        key={`create-${target}`}
                        value={`create-${target}`}
                        onSelect={() => {
                          close();
                          onQuickAdd(target);
                        }}
                        className={ITEM_CLASS}
                      >
                        <Plus size={16} className="text-aqua-500 shrink-0" />
                        {label}
                      </Command.Item>
                    ))}
                    {NAVIGATE.map(({ href, label, icon: Icon }) => (
                      <Command.Item
                        key={`nav-${href}`}
                        value={`nav-${href}`}
                        onSelect={() => go(href)}
                        className={ITEM_CLASS}
                      >
                        <Icon size={16} className="text-ink-400 shrink-0" />
                        {label}
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {/* Search results — query ≥ 2 chars */}
                  {searching && properties && properties.length > 0 && (
                    <Command.Group heading="Properties">
                      {properties.map((p) => (
                        <Command.Item
                          key={p._id}
                          value={`property-${p._id}`}
                          onSelect={() => go("/properties")}
                          className={ITEM_CLASS}
                        >
                          <Building2 size={16} className="text-aqua-500 shrink-0" />
                          <span className="min-w-0 flex-1 truncate">
                            {p.name}
                            <span className="ml-2 text-xs text-ink-500">
                              {[p.area, p.city].filter(Boolean).join(", ")}
                            </span>
                          </span>
                          <span className="text-xs text-ink-600 shrink-0">
                            {formatCurrency(p.price)}
                          </span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  {searching && clients && clients.length > 0 && (
                    <Command.Group heading="Clients">
                      {clients.map((c) => {
                        const typeLabel =
                          CLIENT_TYPES.find((t) => t.value === c.clientType)?.label ??
                          c.clientType;
                        return (
                          <Command.Item
                            key={c._id}
                            value={`client-${c._id}`}
                            onSelect={() => {
                              shellNav.client.fire(c._id);
                              go("/clients");
                            }}
                            className={ITEM_CLASS}
                          >
                            <Users size={16} className="text-sea-700 shrink-0" />
                            <span className="min-w-0 flex-1 truncate">
                              {c.firstName} {c.lastName}
                              <span className="ml-2 text-xs text-ink-500">
                                {typeLabel} · {c.phone}
                              </span>
                            </span>
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  )}

                  {searching && deals && deals.length > 0 && (
                    <Command.Group heading="Deals">
                      {deals.map((d) => {
                        const stageLabel =
                          DEAL_STAGES.find((s) => s.value === d.stage)?.label ?? d.stage;
                        return (
                          <Command.Item
                            key={d._id}
                            value={`deal-${d._id}`}
                            onSelect={() => {
                              shellNav.deal.fire(d._id);
                              go("/dashboard");
                            }}
                            className={ITEM_CLASS}
                          >
                            <FileSignature size={16} className="text-coral-500 shrink-0" />
                            <span className="min-w-0 flex-1 truncate">
                              {d.propertyName}
                              <span className="ml-2 text-xs text-ink-500">
                                {stageLabel} · {d.dealType === "rent" ? "Rent" : "Sale"}
                              </span>
                            </span>
                            <span className="text-xs text-ink-600 shrink-0">
                              {formatCurrency(d.agreedPrice ?? d.listPrice)}
                            </span>
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  )}

                  {loading && (
                    <p className="px-3 py-3 text-sm text-ink-500">Searching…</p>
                  )}

                  {searching && !loading && totalResults === 0 && (
                    <p className="px-3 py-3 text-sm text-ink-500">
                      No results for{" "}
                      <span className="font-medium text-ink-700">“{searchQuery}”</span>
                    </p>
                  )}
                </Command.List>

                {/* Footer hint */}
                <div
                  className="px-4 py-2 text-xs text-ink-600"
                  style={{ borderTop: "1px solid var(--hairline-strong)" }}
                >
                  ↑↓ navigate · ↵ select · esc close
                </div>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
