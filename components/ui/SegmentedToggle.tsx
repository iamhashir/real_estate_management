"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useId } from "react";

interface ToggleOption {
  value:    string;
  label:    string;
  icon?:    React.ReactNode;
}

interface SegmentedToggleProps {
  options:   ToggleOption[];
  value:     string;
  onChange:  (value: string) => void;
  size?:     "sm" | "md";
  fullWidth?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { track: "p-0.5 gap-0.5", item: "px-2.5 py-1 text-xs h-7", min: "min-h-[32px]" },
  md: { track: "p-1 gap-1",     item: "px-3.5 py-1.5 text-sm h-9", min: "min-h-[44px]" },
};

export function SegmentedToggle({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = false,
  className,
}: SegmentedToggleProps) {
  const groupId = useId();
  const s = sizeMap[size];

  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center rounded-md bg-surface-base border border-hairline",
        s.track,
        s.min,
        fullWidth && "flex w-full",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative flex items-center justify-center gap-1.5 rounded font-medium",
              "transition-colors duration-150 touch-manipulation select-none",
              s.item,
              fullWidth && "flex-1",
              active ? "text-sea-800" : "text-ink-400 hover:text-ink-600"
            )}
          >
            {active && (
              <motion.div
                layoutId={`${groupId}-pill`}
                className="absolute inset-0 rounded bg-gradient-foam shadow-card"
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
