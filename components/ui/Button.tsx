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
    "bg-gradient-tide text-white font-medium shadow-card " +
    "hover:opacity-90 active:scale-[0.98] " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-surface-card text-sea-700 border border-hairline font-medium " +
    "hover:bg-aqua-100 hover:border-aqua-300 active:scale-[0.98] " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-aqua-500 font-medium " +
    "hover:bg-aqua-100 active:scale-[0.98] " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-surface-card text-danger border border-danger/40 font-medium " +
    "hover:bg-danger/10 active:scale-[0.98] " +
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
