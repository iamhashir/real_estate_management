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
}

const QUICK_ADD: { target: QuickAddTarget; label: string; icon: typeof Building2 }[] = [
  { target: "property", label: "New Property", icon: Building2 },
  { target: "client",   label: "New Client",   icon: Users },
  { target: "deal",     label: "New Deal",     icon: FileSignature },
];

export function TopBar({ onQuickAdd, search, onSearchChange }: TopBarProps) {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close quick-add menu on outside click
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

  // Close search panel on outside click
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
        "bg-surface-card/80 backdrop-blur-md border-b border-hairline",
        "flex items-center gap-3 px-4 md:px-6"
      )}
    >
      {/* Search + floating panel */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none z-10"
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
            "w-full h-9 pl-9 pr-3 rounded-md text-base md:text-sm",
            "bg-surface-base border border-hairline text-ink-900 placeholder:text-ink-400",
            "outline-none transition-all focus:border-aqua-400 focus:shadow-glow"
          )}
        />

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
        <Button
          size="md"
          leftIcon={<Plus size={16} />}
          rightIcon={<ChevronDown size={14} className={cn("transition-transform", menuOpen && "rotate-180")} />}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="hidden sm:inline">New</span>
        </Button>

        {menuOpen && (
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-52 z-50",
              "bg-surface-card border border-hairline rounded-md shadow-float overflow-hidden py-1"
            )}
            role="menu"
          >
            {QUICK_ADD.map(({ target, label, icon: Icon }) => (
              <button
                key={target}
                role="menuitem"
                onClick={() => { setMenuOpen(false); onQuickAdd(target); }}
                className={cn(
                  "flex items-center gap-3 w-full px-3.5 py-2.5 text-sm text-ink-900",
                  "hover:bg-aqua-100 transition-colors text-left min-h-[44px]"
                )}
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
