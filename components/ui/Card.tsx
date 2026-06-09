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
        "relative bg-surface-card rounded-md shadow-card overflow-hidden",
        hover && "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-float",
        onClick && "cursor-pointer",
        className
      )}
    >
      {accent && (
        <div className={cn("absolute inset-x-0 top-0 h-0.5", accentMap[accent])} />
      )}
      {children}
    </Tag>
  );
}
