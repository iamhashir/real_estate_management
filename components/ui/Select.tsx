"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { useId, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label:    string;
  options:  SelectOption[];
  error?:   string;
  hint?:    string;
  placeholder?: string;
  containerClassName?: string;
}

export function Select({
  label,
  options,
  error,
  hint,
  placeholder = "Select…",
  containerClassName,
  className,
  id: externalId,
  value,
  onFocus,
  onBlur,
  ...props
}: SelectProps) {
  const autoId  = useId();
  const id      = externalId ?? autoId;
  const [focused, setFocused] = useState(false);
  const hasValue = !!value;

  return (
    <div className={cn("relative", containerClassName)}>
      <div
        className={cn(
          "relative flex items-center rounded-md border transition-all duration-150 bg-surface-card",
          "peer-focus-visible:outline-none",
          error
            ? "border-danger/60 shadow-[0_0_0_2px_rgba(229,72,77,0.15)]"
            : focused
              ? "border-aqua-400 shadow-glow ring-1 ring-aqua-400/30"
              : "border-hairline hover:border-ink-200"
        )}
      >
        <select
          id={id}
          value={value}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
          className={cn(
            "peer w-full bg-transparent pt-5 pb-1.5 px-3 pr-8 text-base text-ink-900",
            "outline-none appearance-none min-h-[52px] cursor-pointer",
            !hasValue && "text-transparent",
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 pointer-events-none transition-all duration-150 select-none",
            hasValue || focused
              ? "top-1.5 text-[10px] font-medium tracking-wide uppercase"
              : "top-1/2 -translate-y-1/2 text-sm",
            error ? "text-danger" : focused ? "text-aqua-500" : "text-ink-400"
          )}
        >
          {label}
        </label>

        <ChevronDown
          size={14}
          className="absolute right-3 text-ink-400 pointer-events-none"
        />
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
