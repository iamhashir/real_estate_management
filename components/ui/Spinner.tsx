"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-3.5 h-3.5 border-[1.5px]",
  md: "w-5 h-5 border-2",
  lg: "w-7 h-7 border-2",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <span
      className={cn(
        "inline-block rounded-full border-current border-t-transparent",
        !prefersReducedMotion && "animate-spin",
        sizeMap[size],
        className
      )}
      aria-label="Loading"
      role="status"
    />
  );
}
