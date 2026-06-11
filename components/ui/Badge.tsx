import { cn } from "@/lib/utils";

type BadgeColor =
  | "aqua" | "coral" | "sea" | "warning"
  | "success" | "danger" | "info" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: "sm" | "md";
  className?: string;
}

const colorMap: Record<BadgeColor, string> = {
  aqua:    "bg-aqua-100 text-sea-800",
  coral:   "bg-coral-100 text-coral-500",
  sea:     "bg-sea-800/10 text-sea-700",
  warning: "bg-warning/15 text-[#7A4F00]",
  success: "bg-success/15 text-success",
  danger:  "bg-danger/15 text-danger",
  info:    "bg-info/15 text-info",
  muted:   "bg-ink-200/40 text-ink-600",
};

const sizeMap = {
  sm: "px-1.5 py-0.5 text-[12px]",
  md: "px-2.5 py-0.5 text-xs",
};

export function Badge({ children, color = "muted", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap",
        colorMap[color],
        sizeMap[size],
        className
      )}
    >
      {children}
    </span>
  );
}
