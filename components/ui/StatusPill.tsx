import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  PROPERTY_STATUSES,
  CLIENT_STATUSES,
  DEAL_STAGES,
  type PropertyStatus,
  type ClientStatus,
  type DealStage,
} from "@/lib/constants";

type BadgeColor = "aqua" | "coral" | "sea" | "warning" | "success" | "danger" | "info" | "muted";

const colorClasses: Record<BadgeColor, string> = {
  aqua:    "bg-aqua-100 text-aqua-500",
  coral:   "bg-coral-100 text-coral-500",
  sea:     "bg-sea-800/10 text-sea-700",
  warning: "bg-warning/15 text-warning",
  success: "bg-success/15 text-success",
  danger:  "bg-danger/15 text-danger",
  info:    "bg-info/15 text-info",
  muted:   "bg-ink-200/40 text-ink-600",
};

const pulseDot: Record<BadgeColor, string> = {
  aqua:    "bg-aqua-400",
  coral:   "bg-coral-400",
  sea:     "bg-sea-600",
  warning: "bg-warning",
  success: "bg-success",
  danger:  "bg-danger",
  info:    "bg-info",
  muted:   "bg-ink-400",
};

type StatusPillVariant = "property" | "client" | "deal";

interface StatusPillProps {
  value: PropertyStatus | ClientStatus | DealStage;
  variant: StatusPillVariant;
  pulse?: boolean;
  className?: string;
}

function getPropertyMeta(value: PropertyStatus) {
  return PROPERTY_STATUSES.find((s) => s.value === value);
}
function getClientMeta(value: ClientStatus) {
  return CLIENT_STATUSES.find((s) => s.value === value);
}
function getDealMeta(value: DealStage) {
  return DEAL_STAGES.find((s) => s.value === value);
}

export function StatusPill({ value, variant, pulse, className }: StatusPillProps) {
  let label: string = value;
  let color: BadgeColor = "muted";

  if (variant === "property") {
    const m = getPropertyMeta(value as PropertyStatus);
    if (m) { label = m.label; color = m.color as BadgeColor; }
  } else if (variant === "client") {
    const m = getClientMeta(value as ClientStatus);
    if (m) { label = m.label; color = m.color as BadgeColor; }
  } else if (variant === "deal") {
    const m = getDealMeta(value as DealStage);
    if (m) { label = m.label; color = m.color as BadgeColor; }
  }

  const showPulse = pulse ?? (value === "available" || value === "active");

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        colorClasses[color],
        className
      )}
    >
      {showPulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              pulseDot[color]
            )}
          />
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", pulseDot[color])} />
        </span>
      )}
      {label}
    </motion.span>
  );
}
