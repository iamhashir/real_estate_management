"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, FileSignature, Plus } from "lucide-react";
import type { QuickAddTarget } from "./TopBar";

const TABS = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/clients",    label: "Clients",    icon: Users },
  { href: "/deals",      label: "Deals",      icon: FileSignature },
] as const;

interface BottomTabBarProps {
  onQuickAdd: (target: QuickAddTarget) => void;
}

/**
 * Mobile-only bottom navigation. Hidden at md+. Respects iOS safe area.
 * The "+" tab opens the quick-add (defaults to New Client — the most common
 * mobile entry); long flows still route through the page CTAs.
 */
export function BottomTabBar({ onQuickAdd }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 inset-x-0 z-30",
        "h-16 bg-surface-card border-t border-hairline",
        "flex items-stretch justify-around px-1",
        "pb-[env(safe-area-inset-bottom)]"
      )}
      aria-label="Primary"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px]",
              "text-[11px] font-medium transition-colors",
              active ? "text-aqua-500" : "text-ink-400"
            )}
          >
            <Icon size={20} className={active ? "text-aqua-500" : "text-ink-400"} />
            {label}
          </Link>
        );
      })}

      <button
        onClick={() => onQuickAdd("client")}
        className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] text-[11px] font-medium text-ink-400"
      >
        <span className="grid place-items-center w-8 h-8 -mb-0.5 rounded-full bg-gradient-tide text-white shadow-card">
          <Plus size={18} />
        </span>
        Add
      </button>
    </nav>
  );
}
