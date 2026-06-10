"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Building2, Users, FileSignature, Anchor } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useCurrentAgent } from "@/hooks/useAgents";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/clients",    label: "Clients",    icon: Users },
  { href: "/deals",      label: "Deals",      icon: FileSignature },
] as const;

/**
 * Persistent left rail. Desktop (lg): 240px with labels. Tablet (md): 64px
 * icons-only. Hidden on mobile (BottomTabBar takes over). Active item gets a
 * gradient-foam left bar + aqua glow per DESIGN.md.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { agent } = useCurrentAgent();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 bg-sea-950 text-aqua-100",
        "md:w-16 lg:w-60 transition-all duration-300",
        "fixed inset-y-0 left-0 z-30"
      )}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="h-14 flex items-center gap-2.5 px-3 lg:px-5 border-b border-white/5 shrink-0">
        <span className="grid place-items-center w-9 h-9 rounded-md bg-gradient-foam text-sea-950 shrink-0">
          <Anchor size={18} strokeWidth={2.4} />
        </span>
        <span className="hidden lg:block font-display font-600 text-white text-base tracking-tight whitespace-nowrap">
          Harbour
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "group relative flex items-center gap-3 rounded-md h-11 px-3 lg:px-3.5",
                "text-sm font-medium transition-colors",
                "justify-center lg:justify-start",
                active
                  ? "bg-white/10 text-white"
                  : "text-aqua-100/70 hover:text-white hover:bg-white/5"
              )}
            >
              {/* Active left bar — shared element slides between items */}
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-gradient-foam shadow-[0_0_12px_rgba(25,199,194,0.6)]"
                />
              )}
              <Icon
                size={19}
                className={cn(
                  "shrink-0 transition-colors",
                  active ? "text-aqua-300" : "text-current group-hover:text-aqua-300"
                )}
              />
              <span className="hidden lg:block whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Agent identity */}
      <div className="border-t border-white/5 p-2 lg:p-3 shrink-0">
        <div className="flex items-center gap-3 rounded-md px-1.5 lg:px-2 py-2 justify-center lg:justify-start">
          {agent ? (
            <Avatar
              firstName={agent.name.split(" ")[0] ?? agent.name}
              lastName={agent.name.split(" ")[1] ?? ""}
              size="md"
            />
          ) : (
            <span className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-aqua-300 text-xs font-display font-600 shrink-0">
              —
            </span>
          )}
          <div className="hidden lg:block min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {agent?.name ?? "No agent"}
            </p>
            <p className="text-xs text-aqua-100/50 truncate capitalize">
              {agent?.role ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
