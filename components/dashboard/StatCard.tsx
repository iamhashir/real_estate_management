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

const T = {
  aqua: {
    ring:  "#1390AE",
    tint:  "rgba(19,144,174,0.06)",
    track: "rgba(19,144,174,0.10)",
    icon:  "#0E6B86",
    val:   "#0E6B86",
    glow:  "rgba(19,144,174,0.14)",
  },
  sea: {
    ring:  "#0E6B86",
    tint:  "rgba(14,107,134,0.06)",
    track: "rgba(14,107,134,0.10)",
    icon:  "#0A4D63",
    val:   "#0A4D63",
    glow:  "rgba(14,107,134,0.14)",
  },
  success: {
    ring:  "#2A6B54",
    tint:  "rgba(42,107,84,0.06)",
    track: "rgba(42,107,84,0.10)",
    icon:  "#1B4D3E",
    val:   "#1B4D3E",
    glow:  "rgba(42,107,84,0.14)",
  },
  coral: {
    ring:  "#FF6B5E",
    tint:  "rgba(255,107,94,0.06)",
    track: "rgba(255,107,94,0.10)",
    icon:  "#A75049",
    val:   "#A75049",
    glow:  "rgba(255,107,94,0.14)",
  },
} satisfies Record<Accent, Record<string, string>>;

const TREND_STYLE = {
  up:   { bg: "rgba(42,107,84,0.10)",  text: "#1B4D3E" },
  down: { bg: "rgba(167,80,73,0.10)",  text: "#7A2E28" },
  flat: { bg: "rgba(79,74,68,0.10)",   text: "#4F4A44" },
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
        background:           "linear-gradient(135deg, rgba(255,255,255,0.70) 0%, rgba(245,241,232,0.50) 100%)",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border:               "1px solid rgba(255,255,255,0.80)",
        boxShadow:            "0 4px 24px rgba(26,24,20,0.08), inset 0 1px 0 rgba(255,255,255,0.90)",
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
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.40), transparent)",
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
              style={{ color: "#78716c" }}
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
          style={{ color: "#111625" }}
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
                style={{ color: "#6B6560" }}
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
