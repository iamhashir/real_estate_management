"use client";

import { cn } from "@/lib/utils";
import React, { useId, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label:      string;
  error?:     string;
  hint?:      string;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  id: externalId,
  value,
  defaultValue,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const [focused, setFocused] = useState(false);

  const hasValue =
    value !== undefined
      ? String(value).length > 0
      : defaultValue !== undefined
        ? String(defaultValue).length > 0
        : false;

  const floated = focused || hasValue || !!props.placeholder;

  return (
    <div className={cn("relative", containerClassName)}>
      <div
        className={cn(
          "relative flex items-center rounded-md border transition-all duration-150",
          "bg-surface-card",
          "peer-focus-visible:outline-none",
          error
            ? "border-danger/60 shadow-[0_0_0_2px_rgba(229,72,77,0.15)]"
            : focused
              ? "border-aqua-400 shadow-glow ring-1 ring-aqua-400/30"
              : "border-hairline hover:border-ink-200"
        )}
      >
        {leftIcon && (
          <span className="absolute left-3 text-ink-400 pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          value={value}
          defaultValue={defaultValue}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
          placeholder=" "
          className={cn(
            "peer w-full bg-transparent pt-5 pb-1.5 px-3 text-base text-ink-900",
            "outline-none placeholder:text-transparent",
            "min-h-[52px]",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />

        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 pointer-events-none transition-all duration-150 select-none",
            leftIcon && "left-9",
            floated
              ? "top-1.5 text-[10px] font-medium tracking-wide uppercase"
              : "top-1/2 -translate-y-1/2 text-sm",
            error   ? "text-danger"   :
            focused ? "text-aqua-500" :
                      "text-ink-400"
          )}
        >
          {label}
        </label>

        {rightIcon && (
          <span className="absolute right-3 text-ink-400 pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-400">
          {hint}
        </p>
      )}
    </div>
  );
}
