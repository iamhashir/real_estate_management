"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import React, { useId, useRef, useState, useEffect } from "react";
import { Spinner } from "./Spinner";

export interface ComboboxOption {
  value:    string;
  label:    string;
  sublabel?: string;
}

interface ComboboxProps {
  label:        string;
  value?:       string;
  onChange:     (value: string) => void;
  options:      ComboboxOption[];
  onCreateNew?: (query: string) => void;
  createLabel?: string;
  placeholder?: string;
  error?:       string;
  hint?:        string;
  loading?:     boolean;
  clearable?:   boolean;
  className?:   string;
}

export function Combobox({
  label,
  value,
  onChange,
  options,
  onCreateNew,
  createLabel = "Create",
  placeholder,
  error,
  hint,
  loading     = false,
  clearable   = true,
  className,
}: ComboboxProps) {
  const id          = useId();
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const listRef   = useRef<HTMLUListElement>(null);
  const [highlighted, setHighlighted] = useState<number>(-1);

  const selected    = options.find((o) => o.value === value);
  const displayText = open ? query : (selected?.label ?? "");

  const filtered = query
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()) ||
        o.sublabel?.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  const showCreate = !!onCreateNew && query.length > 0 &&
    !options.some((o) => o.label.toLowerCase() === query.toLowerCase());

  useEffect(() => {
    if (!open) { setQuery(""); setHighlighted(-1); }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = filtered.length + (showCreate ? 1 : 0);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + totalItems) % totalItems);
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      if (highlighted < filtered.length) {
        select(filtered[highlighted].value);
      } else if (showCreate) {
        handleCreate();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const select = (val: string) => {
    onChange(val);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleCreate = () => {
    onCreateNew?.(query);
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const hasValue = !!value;
  const floated  = focused || hasValue || open;

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-md border transition-all duration-150 bg-surface-card cursor-pointer",
          error
            ? "border-danger/60 shadow-[0_0_0_2px_var(--ring-danger)]"
            : open || focused
              ? "border-aqua-400 shadow-glow"
              : "border-hairline hover:border-ink-200"
        )}
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}
      >
        <Search size={14} className="absolute left-3 text-ink-400 pointer-events-none" />

        <input
          ref={inputRef}
          id={id}
          value={displayText}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => {
            setTimeout(() => { setOpen(false); setFocused(false); }, 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder=" "
          readOnly={!open}
          className="w-full bg-transparent pt-5 pb-1.5 pl-9 pr-8 text-base text-ink-900 outline-none min-h-[52px] placeholder:text-transparent"
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          aria-expanded={open}
          role="combobox"
        />

        <label
          htmlFor={id}
          className={cn(
            "absolute left-9 pointer-events-none transition-all duration-150 select-none",
            floated
              ? "top-1.5 text-[10px] font-medium tracking-wide uppercase"
              : "top-1/2 -translate-y-1/2 text-sm",
            error ? "text-danger" : focused || open ? "text-aqua-500" : "text-ink-400"
          )}
        >
          {label}
        </label>

        <div className="absolute right-2.5 flex items-center gap-1">
          {loading && <Spinner size="sm" className="text-ink-400" />}
          {clearable && hasValue && !loading && (
            <button
              type="button"
              onClick={clear}
              className="text-ink-400 hover:text-ink-700 p-0.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400"
              tabIndex={-1}
              aria-label="Clear selection"
            >
              <X size={12} />
            </button>
          )}
          <ChevronDown
            size={13}
            className={cn("text-ink-400 transition-transform duration-150", open && "rotate-180")}
          />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute inset-x-0 top-full mt-1 z-50 bg-surface-card border border-hairline rounded-md shadow-float overflow-hidden"
          >
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              className="max-h-52 overflow-y-auto overscroll-contain py-1"
            >
              {filtered.length === 0 && !showCreate && (
                <li className="px-3 py-2.5 text-sm text-ink-400 text-center">
                  No results
                </li>
              )}
              {filtered.map((opt, i) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  onMouseDown={() => select(opt.value)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 cursor-pointer text-sm transition-colors",
                    i === highlighted || opt.value === value
                      ? "bg-aqua-100 text-sea-800"
                      : "text-ink-900 hover:bg-surface-base"
                  )}
                >
                  <span className="flex-1">
                    <span className="block">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-xs text-ink-400">{opt.sublabel}</span>
                    )}
                  </span>
                  {opt.value === value && <Check size={13} className="text-aqua-500 shrink-0" />}
                </li>
              ))}
              {showCreate && (
                <li
                  role="option"
                  onMouseDown={handleCreate}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 cursor-pointer text-sm font-medium",
                    "border-t border-hairline transition-colors",
                    highlighted === filtered.length
                      ? "bg-aqua-100 text-sea-800"
                      : "text-aqua-500 hover:bg-aqua-100"
                  )}
                >
                  <Plus size={14} />
                  {createLabel} &ldquo;{query}&rdquo;
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-xs text-danger" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {!error && hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
