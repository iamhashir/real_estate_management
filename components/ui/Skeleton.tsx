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
      className={cn("bg-hairline", !prefersReducedMotion && "animate-pulse", roundMap[rounded], className)}
      style={style}
      aria-hidden="true"
    />
  );
}
