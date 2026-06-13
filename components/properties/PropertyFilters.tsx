"use client";

import { cn } from "@/lib/utils";
import { PROPERTY_STATUSES, PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants";
import type { PropertyStatus, PropertyType, ListingType } from "@/lib/constants";

export interface PropertyFilterState {
  status?: PropertyStatus;
  type?: PropertyType;
  listingType?: ListingType;
}

interface PropertyFiltersProps {
  value: PropertyFilterState;
  onChange: (next: PropertyFilterState) => void;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] shrink-0 border",
        active
          ? "bg-aqua-100 text-sea-800 border-aqua-300"
          : "bg-surface-card text-ink-600 border-hairline hover:border-aqua-300"
      )}
    >
      {children}
    </button>
  );
}

export function PropertyFilters({ value, onChange }: PropertyFiltersProps) {
  const hasAny = !!(value.status || value.type || value.listingType);

  const toggle = <K extends keyof PropertyFilterState>(key: K, v: PropertyFilterState[K]) =>
    onChange({ ...value, [key]: value[key] === v ? undefined : v });

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {LISTING_TYPES.map((t) => (
        <Chip key={t.value} active={value.listingType === t.value} onClick={() => toggle("listingType", t.value)}>
          {t.label}
        </Chip>
      ))}
      <span className="w-px h-6 bg-hairline shrink-0 mx-1" />
      {PROPERTY_STATUSES.map((s) => (
        <Chip key={s.value} active={value.status === s.value} onClick={() => toggle("status", s.value)}>
          {s.label}
        </Chip>
      ))}
      <span className="w-px h-6 bg-hairline shrink-0 mx-1" />
      {PROPERTY_TYPES.map((t) => (
        <Chip key={t.value} active={value.type === t.value} onClick={() => toggle("type", t.value)}>
          {t.label}
        </Chip>
      ))}
      {hasAny && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="text-sm text-ink-500 hover:text-ink-700 whitespace-nowrap shrink-0 px-2 min-h-[36px]"
        >
          Clear
        </button>
      )}
    </div>
  );
}
