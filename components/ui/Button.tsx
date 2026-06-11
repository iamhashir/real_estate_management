"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  loading?:  boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-sea-950 via-sea-800 to-sea-700 text-white font-medium " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_4px_-1px_rgba(10,77,99,0.35),0_8px_20px_-6px_rgba(10,77,99,0.45)] " +
    "hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_4px_8px_-2px_rgba(10,77,99,0.40),0_14px_28px_-8px_rgba(10,77,99,0.50)] " +
    "active:translate-y-0 active:scale-[0.98] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea-700 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none",
  secondary:
    "surface-raised text-sea-700 font-medium " +
    "hover:-translate-y-px hover:text-sea-800 hover:bg-aqua-100/60 " +
    "active:translate-y-0 active:scale-[0.98] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-sea-700 font-medium " +
    "hover:bg-sea-800/8 active:scale-[0.98] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea-700 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-surface-card text-danger border border-danger/40 font-medium " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(229,72,77,0.12)] " +
    "hover:bg-danger/10 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-sm",
  md: "h-10 px-4 text-sm gap-2 rounded-md",
  lg: "h-12 px-5 text-base gap-2 rounded-md",
};

export function Button({
  variant  = "primary",
  size     = "md",
  loading  = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150",
        "min-h-[44px] min-w-[44px] touch-manipulation select-none",
        variantMap[variant],
        sizeMap[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <Spinner
          size="sm"
          className={variant === "primary" ? "text-white" : "text-current"}
        />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
