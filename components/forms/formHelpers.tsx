"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Compact currency for slider thumbs / tight spaces ──────────────────────────

export function compactAED(n: number): string {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M`;
  if (n >= 1_000)     return `AED ${Math.round(n / 1_000)}k`;
  return `AED ${n}`;
}

// ─── Multi-select chip group (property types, features, etc.) ───────────────────

interface ChipToggleGroupProps {
  label: string;
  options: readonly { value: string; label: string }[] | readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function ChipToggleGroup({ label, options, selected, onToggle }: ChipToggleGroupProps) {
  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <div className="space-y-2">
      <p className="text-label text-ink-600">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {normalized.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[44px] cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2",
                active
                  ? "bg-aqua-100 text-sea-800 border border-aqua-300 hover:bg-aqua-200"
                  : "bg-surface-base text-ink-600 border border-hairline hover:border-aqua-300 hover:bg-aqua-50"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Integer stepper — replaces type="number" for bounded whole-number fields ───
// One tap per increment; can't produce invalid input; 44px touch targets.

interface FormStepperProps {
  label:     string;
  value:     number | undefined;
  min?:      number;
  max?:      number;
  suffix?:   string;
  onChange:  (v: number) => void;
}

export function FormStepper({ label, value, min = 0, max = 20, suffix, onChange }: FormStepperProps) {
  const atMin = value === undefined || value <= min;
  const atMax = value !== undefined && value >= max;

  return (
    <div className="space-y-1.5">
      <p className="text-label text-ink-600">{label}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { if (!atMin) onChange((value ?? min + 1) - 1); }}
          disabled={atMin}
          aria-label={`Decrease ${label}`}
          className={cn(
            "min-h-[44px] min-w-[44px] rounded-md border border-hairline",
            "flex items-center justify-center text-ink-700",
            "transition-colors touch-manipulation",
            "hover:bg-surface-base hover:border-ink-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <Minus size={16} />
        </button>

        <span className="flex-1 text-center font-display font-semibold text-2xl text-ink-900 tabular-nums select-none">
          {value !== undefined ? `${value}${suffix ?? ""}` : "—"}
        </span>

        <button
          type="button"
          onClick={() => { if (!atMax) onChange(value === undefined ? min : value + 1); }}
          disabled={atMax}
          aria-label={`Increase ${label}`}
          className={cn(
            "min-h-[44px] min-w-[44px] rounded-md border border-hairline",
            "flex items-center justify-center text-ink-700",
            "transition-colors touch-manipulation",
            "hover:bg-surface-base hover:border-ink-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Section heading inside a form ──────────────────────────────────────────────

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-label text-ink-600 border-b border-hairline pb-2">{title}</h3>
      {children}
    </section>
  );
}

// ─── Draft autosave to localStorage ─────────────────────────────────────────────

export function useDraft<T extends object>(key: string, initial: T, enabled: boolean) {
  const [state, setState]     = useState<T>(initial);
  const [hasDraft, setHasDraft] = useState(false);
  const loaded = useRef(false);

  // Restore once when the form opens
  useEffect(() => {
    if (!enabled || loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...initial, ...parsed };
        setState(merged);
        // Only flag as a real draft if something meaningful was filled in
        setHasDraft(JSON.stringify(merged) !== JSON.stringify(initial));
      }
    } catch {
      /* ignore corrupt drafts */
    }
  }, [enabled, key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist on change
  useEffect(() => {
    if (!enabled || !loaded.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage full / unavailable */
    }
  }, [state, key, enabled]);

  const clearDraft = () => {
    try { localStorage.removeItem(key); } catch { /* noop */ }
    loaded.current = false;
    setHasDraft(false);
  };

  return [state, setState, clearDraft, hasDraft] as const;
}
