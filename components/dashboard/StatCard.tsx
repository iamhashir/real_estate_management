"use client";

import { Card, AnimatedNumber } from "@/components/ui";
import { cn } from "@/lib/utils";

type Accent = "aqua" | "sea" | "success" | "coral";

interface StatCardProps {
  label: string;
  value: number;
  currency?: boolean;
  subtitle?: string;
  accent?: Accent;
  icon?: React.ReactNode;
}

const iconTint: Record<Accent, string> = {
  aqua: "bg-aqua-100 text-aqua-500",
  sea: "bg-sea-800/10 text-sea-700",
  success: "bg-success/15 text-success",
  coral: "bg-coral-100 text-coral-500",
};

export function StatCard({ label, value, currency, subtitle, accent = "aqua", icon }: StatCardProps) {
  return (
    <Card accent={accent} hover className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label text-ink-400">{label}</p>
          <p className="text-display-xl font-display font-600 text-ink-900 mt-1.5 text-money leading-none tracking-tight">
            <AnimatedNumber value={value} currency={currency} />
          </p>
          {subtitle && <p className="text-sm text-ink-600 mt-2">{subtitle}</p>}
        </div>
        {icon && (
          <span className={cn("grid place-items-center w-9 h-9 rounded-full shrink-0", iconTint[accent])}>
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}
