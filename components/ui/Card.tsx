"use client";

import { cn } from "@/lib/utils";

type AccentColor = "aqua" | "coral" | "sea" | "warning" | "success" | "danger";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: AccentColor;
  hover?: boolean;
  onClick?: () => void;
  as?: React.ElementType;
}

const accentMap: Record<AccentColor, string> = {
  aqua:    "bg-aqua-500",
  coral:   "bg-coral-500",
  sea:     "bg-sea-600",
  warning: "bg-warning",
  success: "bg-success",
  danger:  "bg-danger",
};

export function Card({
  children,
  className,
  accent,
  hover = false,
  onClick,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "surface-raised relative rounded-lg overflow-hidden",
        hover && "surface-raised-hover",
        onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2",
        className
      )}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={onClick ? (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {accent && (
        <div className={cn("absolute inset-x-0 top-0 h-0.5 z-10", accentMap[accent])} />
      )}
      {children}
    </Tag>
  );
}
