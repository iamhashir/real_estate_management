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
  aqua: "bg-aqua-200/20 text-aqua-300 border border-aqua-200/30",
  sea: "bg-sea-200/15 text-sea-300 border border-sea-200/25",
  success: "bg-success/20 text-success border border-success/30",
  coral: "bg-coral-200/20 text-coral-300 border border-coral-200/30",
};

const accentColors: Record<Accent, string> = {
  aqua: "text-aqua-100",
  sea: "text-sea-100",
  success: "text-success",
  coral: "text-coral-100",
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
        "p-6 lg:p-8 h-full flex flex-col justify-between transition-all duration-300",
        large && "lg:p-10"
      )}
    >
      <motion.div
        className="flex items-start justify-between gap-4 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon with more distinctive treatment */}
        {icon && (
          <motion.span
            className={cn(
              "grid place-items-center shrink-0 rounded-xl p-3 lg:p-4",
              iconTint[accent],
              large && "w-16 h-16 lg:w-20 lg:h-20"
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {icon}
          </motion.span>
        )}

        {/* Spacer for layout balance */}
        <div className="flex-1" />
      </motion.div>

      {/* Content */}
      <div className="min-w-0">
        <p className={cn("text-xs lg:text-sm font-bold uppercase tracking-widest text-ink-400 mb-2", large && "lg:text-sm")}>
          {label}
        </p>
        <motion.p
          className={cn(
            "font-display font-700 text-ink-900 leading-none tracking-tight",
            large ? "text-4xl lg:text-5xl" : "text-2xl lg:text-3xl"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <span className={accentColors[accent]}>
            <AnimatedNumber value={value} currency={currency} />
          </span>
        </motion.p>

        {subtitle && (
          <motion.p
            className={cn("text-ink-600 mt-3 leading-relaxed", large ? "text-sm lg:text-base" : "text-xs lg:text-sm")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </Card>
  );
}
