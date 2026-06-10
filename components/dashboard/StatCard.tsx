"use client";

import { Card, AnimatedNumber } from "@/components/ui";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Accent = "aqua" | "sea" | "success" | "coral";

interface StatCardProps {
  label: string;
  value: number;
  currency?: boolean;
  subtitle?: string;
  accent?: Accent;
  icon?: React.ReactNode;
  large?: boolean;
}

const iconTint: Record<Accent, string> = {
  aqua: "bg-emerald-500/20 text-emerald-600 border border-emerald-500/40",
  sea: "bg-emerald-400/15 text-emerald-500 border border-emerald-400/30",
  success: "bg-emerald-500/20 text-emerald-600 border border-emerald-500/40",
  coral: "bg-brass-500/20 text-brass-500 border border-brass-500/40",
};

const accentColors: Record<Accent, string> = {
  aqua: "text-emerald-600",
  sea: "text-emerald-500",
  success: "text-emerald-600",
  coral: "text-brass-500",
};

export function StatCard({
  label,
  value,
  currency,
  subtitle,
  accent = "aqua",
  icon,
  large = false,
}: StatCardProps) {
  return (
    <Card
      accent={accent}
      hover
      className={cn(
        "p-6 lg:p-8 h-full flex flex-col transition-all duration-300",
        large ? "justify-start gap-6 lg:gap-8 lg:p-10" : "justify-between"
      )}
    >
      <motion.div
        className={cn("flex items-start justify-between gap-4", !large && "mb-6")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon with geometric art deco frame */}
        {icon && (
          <motion.span
            className={cn(
              "grid place-items-center shrink-0 rounded-sm p-3 lg:p-4 relative",
              iconTint[accent],
              large && "w-16 h-16 lg:w-20 lg:h-20"
            )}
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.08, rotate: 2 }}
          >
            {icon}
            <motion.div
              className="absolute inset-0 rounded-sm border-2 pointer-events-none"
              style={{
                borderColor: "currentColor",
                opacity: 0,
              }}
              whileHover={{ opacity: 0.3 }}
              transition={{ duration: 0.3 }}
            />
          </motion.span>
        )}

        {/* Spacer for layout balance */}
        <div className="flex-1" />
      </motion.div>

      {/* Content with geometric structure */}
      <div className="min-w-0">
        <motion.p
          className={cn(
            "text-xs lg:text-sm font-bold uppercase tracking-[0.12em] text-ink-600 mb-4 opacity-85",
            large && "lg:text-sm"
          )}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          {label}
        </motion.p>

        {/* Decorative line accent — refined geometric detail */}
        <div className="h-0.5 w-8 bg-gradient-to-r from-brass-400/60 to-transparent mb-5" />

        <motion.p
          className={cn(
            "font-display font-800 text-ink-900 leading-none tracking-tight mb-4",
            large ? "text-5xl lg:text-6xl" : "text-3xl lg:text-4xl"
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <span className={accentColors[accent]}>
            <AnimatedNumber value={value} currency={currency} />
          </span>
        </motion.p>

        {subtitle && (
          <motion.p
            className={cn(
              "text-ink-600 leading-relaxed border-l-3 border-brass-400/50 pl-4",
              large ? "text-sm lg:text-base" : "text-xs lg:text-sm"
            )}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </Card>
  );
}
