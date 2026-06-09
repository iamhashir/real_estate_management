"use client";

import { cn } from "@/lib/utils";
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
      <p className="text-label text-ink-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {normalized.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px]",
                active
                  ? "bg-aqua-100 text-sea-800 border border-aqua-300"
                  : "bg-surface-base text-ink-600 border border-hairline hover:border-aqua-300"
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

// ─── Section heading inside a form ──────────────────────────────────────────────

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-label text-ink-400 border-b border-hairline pb-2">{title}</h3>
      {children}
    </section>
  );
}

// ─── Draft autosave to localStorage ─────────────────────────────────────────────

export function useDraft<T extends object>(key: string, initial: T, enabled: boolean) {
  const [state, setState] = useState<T>(initial);
  const loaded = useRef(false);

  // Restore once when the form opens
  useEffect(() => {
    if (!enabled || loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
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
  };

  return [state, setState, clearDraft] as const;
}
