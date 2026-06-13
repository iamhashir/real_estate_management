"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Search, Plus, Building2, Users, FileSignature, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { GlobalSearchPanel } from "./GlobalSearchPanel";

export type QuickAddTarget = "property" | "client" | "deal";

interface TopBarProps {
  onQuickAdd: (target: QuickAddTarget) => void;
  search: string;
  onSearchChange: (value: string) => void;
  /** Opens the global Cmd+K command palette. */
  onOpenPalette?: () => void;
}

const QUICK_ADD: { target: QuickAddTarget; label: string; icon: typeof Building2 }[] = [
  { target: "property", label: "New Property", icon: Building2 },
  { target: "client",   label: "New Client",   icon: Users },
  { target: "deal",     label: "New Deal",     icon: FileSignature },
];

export function TopBar({ onQuickAdd, search, onSearchChange, onOpenPalette }: TopBarProps) {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!searchFocused) return;
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchFocused]);

  const showPanel = searchFocused && search.trim().length >= 2;

  return (
    <header
      className={cn(
        "h-14 shrink-0 sticky top-0 z-20",
        "backdrop-blur-2xl border-b",
        "flex items-center gap-3 px-4 md:px-6"
      )}
      style={{
        background:        "var(--glass-bar-top)",
        backdropFilter:    "blur(28px) saturate(1.8)",
        WebkitBackdropFilter: "blur(28px) saturate(1.8)",
        borderBottomColor: "var(--bar-border)",
        boxShadow:         "var(--shadow-bar-bottom), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      {/* Search + floating panel */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="search"
          aria-label="Search"
          aria-expanded={showPanel}
          aria-haspopup="listbox"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setSearchFocused(false); onSearchChange(""); }
          }}
          placeholder="Search…"
          className={cn(
            "w-full h-9 pl-9 pr-3 md:pr-12 rounded-md text-base md:text-sm",
            "outline-none transition-all focus:shadow-glow focus-visible:ring-1 focus-visible:ring-aqua-400/40"
          )}
          style={{
            background: "rgba(255,255,255,0.68)",
            border:     "1px solid var(--bar-border)",
            color:      "var(--color-ink-900)",
          }}
        />

        {/* ⌘K hint — opens the command palette */}
        <button
          type="button"
          onClick={onOpenPalette}
          aria-label="Open command palette"
          tabIndex={-1}
          className={cn(
            "hidden md:flex items-center absolute right-2 top-1/2 -translate-y-1/2",
            "text-xs px-1.5 py-0.5 rounded border bg-white/80 text-ink-700 font-medium",
            "hover:bg-white hover:text-ink-900 transition-colors touch-manipulation"
          )}
          style={{ borderColor: "var(--bar-border)" }}
        >
          ⌘K
        </button>

        <AnimatePresence>
          {showPanel && (
            <GlobalSearchPanel
              query={search.trim()}
              onClose={() => { setSearchFocused(false); onSearchChange(""); }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1" />

      {/* Quick add */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(
            "h-9 w-9 flex items-center justify-center rounded-md transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400/40",
            "touch-manipulation border"
          )}
          style={{
            background: "rgba(255,255,255,0.72)",
            borderColor: "var(--bar-border)",
            color: "var(--color-ink-700)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.95)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.72)"; }}
          aria-label="Quick add menu"
        >
          <Plus size={16} />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-52 z-50 rounded-xl overflow-hidden py-1"
            style={{
              background:           "var(--glass-menu)",
              border:               "1px solid var(--bar-border)",
              boxShadow:            "var(--shadow-menu), inset 0 1px 0 rgba(255,255,255,0.90)",
              backdropFilter:       "blur(28px) saturate(1.8)",
              WebkitBackdropFilter: "blur(28px) saturate(1.8)",
            }}
            role="menu"
          >
            {QUICK_ADD.map(({ target, label, icon: Icon }) => (
              <button
                key={target}
                role="menuitem"
                onClick={() => { setMenuOpen(false); onQuickAdd(target); }}
                className={cn(
                  "flex items-center gap-3 w-full px-3.5 py-2.5 text-sm transition-colors text-left min-h-[44px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-aqua-400"
                )}
                style={{ color: "var(--color-ink-800, var(--color-ink-900))" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.65)")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}
              >
                <Icon size={16} className="text-aqua-500 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
