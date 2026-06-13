"use client";

import { cn } from "@/lib/utils";
import React, { useId, useRef, useEffect, useState } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label:     string;
  error?:    string;
  hint?:     string;
  maxChars?: number;   // shows live character count when set
  autoGrow?: boolean;  // expands with content instead of scrolling
  containerClassName?: string;
}

export function Textarea({
  label,
  error,
  hint,
  maxChars,
  autoGrow   = false,
  containerClassName,
  className,
  id: externalId,
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChange,
  rows = 3,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const id     = externalId ?? autoId;
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasValue =
    value !== undefined
      ? String(value).length > 0
      : defaultValue !== undefined
        ? String(defaultValue).length > 0
        : false;

  const floated   = focused || hasValue;
  const charCount = value !== undefined ? String(value).length : 0;
  const nearLimit = maxChars !== undefined && charCount >= maxChars * 0.85;
  const overLimit = maxChars !== undefined && charCount > maxChars;

  // Auto-grow: recalculate height whenever value changes
  useEffect(() => {
    if (!autoGrow || !textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, autoGrow]);

  return (
    <div className={cn("relative", containerClassName)}>
      <div
        className={cn(
          "relative rounded-md border transition-all duration-150 bg-surface-card",
          overLimit
            ? "border-danger/60 shadow-[0_0_0_2px_var(--ring-danger)]"
            : error
              ? "border-danger/60 shadow-[0_0_0_2px_var(--ring-danger)]"
              : focused
                ? "border-aqua-400 shadow-glow"
                : "border-hairline hover:border-ink-200"
        )}
      >
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
          onChange={onChange}
          placeholder=" "
          className={cn(
            "peer w-full bg-transparent pt-6 pb-2 px-3 text-base text-ink-900",
            "outline-none placeholder:text-transparent",
            autoGrow ? "resize-none overflow-hidden" : "resize-none",
            className
          )}
          aria-invalid={!!error || overLimit}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 pointer-events-none transition-all duration-150 select-none",
            floated
              ? "top-1.5 text-[10px] font-medium tracking-wide uppercase"
              : "top-3.5 text-sm",
            error || overLimit ? "text-danger" : focused ? "text-aqua-500" : "text-ink-500"
          )}
        >
          {label}
        </label>
      </div>

      <div className="flex items-start justify-between mt-1 gap-2">
        <div className="flex-1">
          {(error || overLimit) && (
            <p className="text-xs text-danger" role="alert" aria-live="polite">
              {overLimit ? `${charCount - maxChars!} characters over limit` : error}
            </p>
          )}
          {!error && !overLimit && hint && (
            <p className="text-xs text-ink-500">{hint}</p>
          )}
        </div>
        {maxChars !== undefined && (
          <p className={cn(
            "text-xs tabular-nums shrink-0",
            overLimit  ? "text-danger font-medium" :
            nearLimit  ? "text-warning-700" :
                         "text-ink-300"
          )}>
            {charCount}/{maxChars}
          </p>
        )}
      </div>
    </div>
  );
}
