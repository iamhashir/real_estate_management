"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Building2, Users, FileSignature, Anchor, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useCurrentAgent } from "@/hooks/useAgents";

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
        background:  "#FAF9F6",
        borderRight: "1px solid rgba(120,113,108,0.18)",
      }}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div
        className={cn(
          "h-14 flex items-center shrink-0",
          collapsed ? "justify-center px-3" : "gap-2.5 px-3 lg:px-5",
        )}
        style={{ borderBottom: "1px solid rgba(120,113,108,0.12)" }}
      >
        <span
          className="grid place-items-center w-9 h-9 rounded-md shrink-0"
          style={{
            background: "linear-gradient(135deg, #C9A961 0%, #D4B876 100%)",
            color:      "#5A3D00",
            boxShadow:  "0 2px 8px rgba(201,169,97,0.28)",
          }}
        >
          <Anchor size={18} strokeWidth={2.4} />
        </span>
        <span
          className={cn(
            "font-display font-600 text-base tracking-tight whitespace-nowrap",
            collapsed ? "hidden" : "hidden lg:block",
          )}
          style={{ color: "#111625" }}
        >
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
                // Center icons when sidebar is icon-only
                collapsed ? "justify-center" : "justify-center lg:justify-start",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A961]/60",
              )}
              style={{
                background: active ? "rgba(201,169,97,0.10)" : "transparent",
                color:      active ? "#7A5C00"               : "#4F4A44",
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(26,24,20,0.04)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#111625";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#4F4A44";
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
                    background: "linear-gradient(to bottom, #C9A961, #D4B876)",
                    boxShadow:  "0 0 8px rgba(201,169,97,0.50)",
                  }}
                />
              )}
              <Icon
                size={19}
                className="shrink-0 transition-colors"
                style={{ color: active ? "#9A7120" : "inherit" }}
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
        })}
      </nav>

      {/* Agent identity */}
      <div
        className="p-2 lg:p-3 shrink-0"
        style={{ borderTop: "1px solid rgba(120,113,108,0.12)" }}
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
                background: "rgba(201,169,97,0.14)",
                color:      "#7A5C00",
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
            <p className="text-sm font-medium truncate" style={{ color: "#111625" }}>
              {agent?.name ?? "No agent"}
            </p>
            <p className="text-xs truncate capitalize" style={{ color: "#78716c" }}>
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
            background: "#FAF9F6",
            border:     "1px solid rgba(120,113,108,0.22)",
            boxShadow:  "0 2px 8px rgba(26,24,20,0.10)",
            color:      "#4F4A44",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
            (e.currentTarget as HTMLButtonElement).style.color = "#111625";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FAF9F6";
            (e.currentTarget as HTMLButtonElement).style.color = "#4F4A44";
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
