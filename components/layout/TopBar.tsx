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
        "backdrop-blur-md border-b",
        "flex items-center gap-3 px-4 md:px-6"
      )}
      style={{
        background:        "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(245,241,232,0.72) 100%)",
        borderBottomColor: "rgba(255,255,255,0.90)",
        boxShadow:         "0 1px 0 rgba(26,24,20,0.06)",
      }}
    >
      {/* Search + floating panel */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ color: "#78716c" }}
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
            "outline-none transition-all focus:shadow-glow focus-visible:ring-1 focus-visible:ring-aqua-400/40"
          )}
          style={{
            background: "rgba(26,24,20,0.05)",
            border:     "1px solid rgba(26,24,20,0.10)",
            color:      "#111625",
          }}
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
            className="absolute right-0 top-full mt-2 w-52 z-50 rounded-md overflow-hidden py-1"
            style={{
              background:    "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(245,241,232,0.92) 100%)",
              border:        "1px solid rgba(255,255,255,0.90)",
              boxShadow:     "0 8px 32px rgba(26,24,20,0.12), 0 2px 8px rgba(26,24,20,0.06)",
              backdropFilter: "blur(16px)",
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
                style={{ color: "#111625" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(26,24,20,0.04)")}
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
