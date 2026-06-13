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

export function BottomTabBar({ onQuickAdd }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 inset-x-0 z-30",
        "h-16 backdrop-blur-md border-t",
        "flex items-stretch justify-around px-1",
        "pb-[env(safe-area-inset-bottom)]"
      )}
      style={{
        background:    "var(--glass-bar-bottom)",
        borderTopColor:"var(--glass-edge-soft)",
        boxShadow:     "var(--shadow-bar-top)",
      }}
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
              "text-[12px] font-medium transition-colors rounded-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400",
              active
                ? "hover:bg-black/[0.03]"
                : "hover:bg-black/[0.03]"
            )}
            style={{ color: active ? "var(--color-sea-600)" : "var(--color-ink-500)" }}
          >
            <Icon size={20} style={{ color: active ? "var(--color-sea-600)" : "var(--color-ink-500)" }} />
            {label}
          </Link>
        );
      })}

      <button
        onClick={() => onQuickAdd("client")}
        className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] text-[12px] font-medium transition-colors hover:bg-black/[0.03] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400"
        style={{ color: "var(--color-ink-500)" }}
      >
        <span
          className="grid place-items-center w-8 h-8 -mb-0.5 rounded-full text-white shadow-card"
          style={{ background: "var(--gradient-brass)" }}
        >
          <Plus size={18} />
        </span>
        Add
      </button>
    </nav>
  );
}
