"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Building2, Users, FileSignature, Anchor, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useCurrentAgent } from "@/hooks/useAgents";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/shadcn/tooltip";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/clients",    label: "Clients",    icon: Users },
  { href: "/deals",      label: "Deals",      icon: FileSignature },
] as const;

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Persistent left rail. Desktop (lg): 240px full / 64px collapsed.
 * Tablet (md): always 64px icons-only. Mobile: hidden (BottomTabBar).
 * Bright architectural panel — warm off-white with brass active accent.
 */
export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { agent } = useCurrentAgent();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0",
        "transition-all duration-300",
        "fixed inset-y-0 left-0 z-30",
        // Tablet: always icon-only (w-16). Desktop: w-60 or w-16 based on state.
        collapsed ? "md:w-16 lg:w-16" : "md:w-16 lg:w-60",
      )}
      style={{
        background:           "var(--surface-rail)",
        backdropFilter:       "blur(22px) saturate(1.5)",
        WebkitBackdropFilter: "blur(22px) saturate(1.5)",
        borderRight:          "1px solid var(--glass-edge)",
        boxShadow:            "var(--rail-shadow)",
      }}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div
        className={cn(
          "h-14 flex items-center shrink-0",
          collapsed ? "justify-center px-3" : "gap-2.5 px-3 lg:px-5",
        )}
        style={{ borderBottom: "1px solid var(--hairline-warm)" }}
      >
        <span
          className="grid place-items-center w-9 h-9 rounded-md shrink-0"
          style={{
            background: "var(--gradient-brass)",
            color:      "var(--color-brass-900)",
            boxShadow:  "var(--brand-mark-shadow)",
          }}
        >
          <Anchor size={18} strokeWidth={2.4} />
        </span>
        <span
          className={cn(
            "font-display font-600 text-base tracking-tight whitespace-nowrap",
            collapsed ? "hidden" : "hidden lg:block",
          )}
          style={{ color: "var(--color-ink-900)" }}
        >
          Harbour
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const link = (
            <Link
              href={href}
              title={collapsed ? undefined : label}
              className={cn(
                "group relative flex items-center gap-3 rounded-md h-11 px-3 lg:px-3.5",
                "text-sm font-medium transition-colors",
                // Center icons when sidebar is icon-only
                collapsed ? "justify-center" : "justify-center lg:justify-start",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/60",
              )}
              style={{
                background: active ? "var(--nav-active-wash)" : "transparent",
                color:      active ? "var(--color-brass-700)" : "var(--color-ink-600)",
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--nav-hover-wash)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-ink-900)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-ink-600)";
                }
              }}
            >
              {/* Brass active indicator — shared element slides between items */}
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute left-0 inset-y-2 w-0.5 rounded-r-full"
                  style={{
                    background: "var(--nav-active-bar)",
                    boxShadow:  "var(--nav-active-glow)",
                  }}
                />
              )}
              <Icon
                size={19}
                className="shrink-0 transition-colors"
                style={{ color: active ? "var(--color-brass-600)" : "inherit" }}
              />
              <span
                className={cn(
                  "whitespace-nowrap",
                  collapsed ? "hidden" : "hidden lg:block",
                )}
              >
                {label}
              </span>
            </Link>
          );

          // Collapsed (icons-only): show the label as a tooltip to the right.
          if (collapsed) {
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          }

          return <Fragment key={href}>{link}</Fragment>;
        })}
      </nav>

      {/* Agent identity */}
      <div
        className="p-2 lg:p-3 shrink-0"
        style={{ borderTop: "1px solid var(--hairline-warm)" }}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-md px-1.5 lg:px-2 py-2",
            collapsed ? "justify-center" : "justify-center lg:justify-start",
          )}
        >
          {agent ? (
            <Avatar
              firstName={agent.name.split(" ")[0] ?? agent.name}
              lastName={agent.name.split(" ")[1] ?? ""}
              size="md"
            />
          ) : (
            <span
              className="w-9 h-9 rounded-full grid place-items-center text-xs font-display font-600 shrink-0"
              style={{
                background: "var(--avatar-wash)",
                color:      "var(--color-brass-700)",
              }}
            >
              —
            </span>
          )}
          <div
            className={cn(
              "min-w-0",
              collapsed ? "hidden" : "hidden lg:block",
            )}
          >
            <p className="text-sm font-medium truncate" style={{ color: "var(--color-ink-900)" }}>
              {agent?.name ?? "No agent"}
            </p>
            <p className="text-xs truncate capitalize" style={{ color: "var(--text-muted)" }}>
              {agent?.role ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Collapse handle — floating circular button at right edge, lg only */}
      {onToggle && (
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "hidden lg:flex absolute -right-3.5 top-[3.25rem] z-50",
            "w-7 h-7 rounded-full items-center justify-center",
            "transition-colors duration-200",
          )}
          style={{
            background: "var(--toggle-surface)",
            border:     "1px solid var(--glass-edge)",
            boxShadow:  "var(--toggle-shadow)",
            color:      "var(--color-ink-600)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-base)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-ink-900)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--toggle-surface)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-ink-600)";
          }}
        >
          {collapsed
            ? <ChevronRight size={13} strokeWidth={2.2} />
            : <ChevronLeft  size={13} strokeWidth={2.2} />
          }
        </button>
      )}
    </aside>
  );
}
