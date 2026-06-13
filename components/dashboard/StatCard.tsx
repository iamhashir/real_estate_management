"use client";

import { AnimatedNumber } from "@/components/ui";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Accent = "aqua" | "sea" | "success" | "coral";

interface StatCardProps {
  label: string;
  value: number;
  currency?: boolean;
  subtitle?: string;
  accent?: Accent;
  icon?: React.ReactNode;
  trend?: number;
  ratio?: number;
  ratioLabel?: string;
  /** @deprecated no-op */
  large?: boolean;
}

// Accent colours resolve to the central --stat-* tokens in globals.css; tweak
// a hue there and every stat card follows. Nothing here is a raw colour value.
const T = {
  aqua: {
    ring:  "var(--stat-aqua-ring)",
    tint:  "var(--stat-aqua-tint)",
    track: "var(--stat-aqua-track)",
    icon:  "var(--stat-aqua-ink)",
    val:   "var(--stat-aqua-ink)",
    glow:  "var(--stat-aqua-glow)",
  },
  sea: {
    ring:  "var(--stat-sea-ring)",
    tint:  "var(--stat-sea-tint)",
    track: "var(--stat-sea-track)",
    icon:  "var(--stat-sea-ink)",
    val:   "var(--stat-sea-ink)",
    glow:  "var(--stat-sea-glow)",
  },
  success: {
    ring:  "var(--stat-success-ring)",
    tint:  "var(--stat-success-tint)",
    track: "var(--stat-success-track)",
    icon:  "var(--stat-success-ink)",
    val:   "var(--stat-success-ink)",
    glow:  "var(--stat-success-glow)",
  },
  coral: {
    ring:  "var(--stat-coral-ring)",
    tint:  "var(--stat-coral-tint)",
    track: "var(--stat-coral-track)",
    icon:  "var(--stat-coral-ink)",
    val:   "var(--stat-coral-ink)",
    glow:  "var(--stat-coral-glow)",
  },
} satisfies Record<Accent, Record<string, string>>;

const TREND_STYLE = {
  up:   { bg: "var(--trend-up-bg)",   text: "var(--trend-up-text)" },
  down: { bg: "var(--trend-down-bg)", text: "var(--trend-down-text)" },
  flat: { bg: "var(--trend-flat-bg)", text: "var(--trend-flat-text)" },
};

// Framer Motion variants — hover state propagates from the card root
// to both the shimmer sweep and the ambient glow child elements.
const cardVariants = {
  rest:  { y: 0,  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  hover: { y: -2, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const shimmerVariants = {
  rest:  { x: "-110%", transition: { duration: 0 } },
  hover: { x: "220%",  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const glowVariants = {
  rest:  { opacity: 0, transition: { duration: 0.2 } },
  hover: { opacity: 1, transition: { duration: 0.25 } },
};

export function StatCard({
  label,
  value,
  currency,
  subtitle,
  accent = "aqua",
  icon,
  trend,
  ratio,
  ratioLabel,
}: StatCardProps) {
  const t   = T[accent];
  const dir = trend === undefined ? "flat" : trend > 0 ? "up" : trend < 0 ? "down" : "flat";
  const pct = ratio !== undefined ? Math.min(1, Math.max(0, ratio)) : null;
  const ts  = TREND_STYLE[dir];

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg cursor-default select-none"
      style={{
        background:           "var(--surface-stat)",
        backdropFilter:       "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        border:               "1px solid var(--glass-edge)",
        boxShadow:            "var(--stat-shadow)",
      }}
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      {/* Accent top-edge line */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${t.ring} 40%, ${t.ring} 60%, transparent 100%)`,
          opacity: 0.65,
        }}
      />

      {/* Hover shimmer sweep — diagonal light streak across the frosted plane */}
      <motion.div
        className="absolute inset-y-0 w-1/2 pointer-events-none z-20 skew-x-[-18deg]"
        variants={shimmerVariants}
        style={{
          background: "var(--stat-shimmer)",
        }}
      />

      {/* Ambient hover glow — accent colour bleeds outward from edges */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        variants={glowVariants}
        style={{ boxShadow: `0 0 28px ${t.glow}` }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col gap-2 p-3.5">

        {/* Row 1: icon + label + trend badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {icon && (
              <span
                className="flex-shrink-0 [&>svg]:w-3 [&>svg]:h-3"
                style={{ color: t.icon }}
              >
                {icon}
              </span>
            )}
            <p
              className="text-[10px] font-bold uppercase leading-none truncate tracking-[0.14em]"
              style={{ color: "var(--color-ink-400)" }}
            >
              {label}
            </p>
          </div>

          {trend !== undefined && (
            <motion.div
              className="flex-shrink-0 flex items-center gap-0.5 text-[9px] font-bold leading-none px-1.5 py-0.5 rounded-full"
              style={{ background: ts.bg, color: ts.text }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {dir === "up"   && <TrendingUp  size={8} />}
              {dir === "down" && <TrendingDown size={8} />}
              {dir === "flat" && <Minus        size={8} />}
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>

        {/* Row 2: main value */}
        <motion.p
          className={cn(
            "font-display font-bold leading-none tracking-tight",
            currency ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl",
          )}
          style={{ color: "var(--color-ink-900)" }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedNumber value={value} currency={currency} />
        </motion.p>

        {/* Row 3: progress bar + sub-label (conditional) */}
        {pct !== null && (
          <div className="flex flex-col gap-1">
            <div
              className="relative h-px rounded-full overflow-hidden"
              style={{ background: t.track }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: t.ring }}
                initial={{ width: "0%" }}
                animate={{ width: `${pct * 100}%` }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
            </div>
            {(ratioLabel || subtitle) && (
              <p
                className="text-[10px] leading-none"
                style={{ color: "var(--color-ink-500)" }}
              >
                {ratioLabel ?? subtitle}
              </p>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
