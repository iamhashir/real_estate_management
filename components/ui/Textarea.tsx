"use client";

import { cn } from "@/lib/utils";
import React, { useId, useState } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label:  string;
  error?: string;
  hint?:  string;
  containerClassName?: string;
}

export function Textarea({
  label,
  error,
  hint,
  containerClassName,
  className,
  id: externalId,
  value,
  defaultValue,
  onFocus,
  onBlur,
  rows = 3,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const [focused, setFocused] = useState(false);

  const hasValue =
    value !== undefined
      ? String(value).length > 0
      : defaultValue !== undefined
        ? String(defaultValue).length > 0
        : false;

  const floated = focused || hasValue;

  return (
    <div className={cn("relative", containerClassName)}>
      <div
        className={cn(
          "relative rounded-md border transition-all duration-150 bg-surface-card",
          error
            ? "border-danger/60 shadow-[0_0_0_2px_rgba(229,72,77,0.15)]"
            : focused
              ? "border-aqua-400 shadow-glow"
              : "border-hairline hover:border-ink-200"
        )}
      >
        <textarea
          id={id}
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
          placeholder=" "
          className={cn(
            "peer w-full bg-transparent pt-6 pb-2 px-3 text-base text-ink-900",
            "outline-none placeholder:text-transparent resize-none",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 pointer-events-none transition-all duration-150 select-none",
            floated
              ? "top-1.5 text-[10px] font-medium tracking-wide uppercase"
              : "top-3.5 text-sm",
            error ? "text-danger" : focused ? "text-aqua-500" : "text-ink-400"
          )}
        >
          {label}
        </label>
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
