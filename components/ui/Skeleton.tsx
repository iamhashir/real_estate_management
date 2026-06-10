"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
  style?: React.CSSProperties;
}

export function Skeleton({ className, rounded = "md", style }: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  const roundMap = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-hairline via-cream-200 to-hairline",
        !prefersReducedMotion && "skeleton-shimmer",
        roundMap[rounded],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}
