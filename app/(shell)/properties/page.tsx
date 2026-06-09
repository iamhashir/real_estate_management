"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui";
import { PropertyFilters, type PropertyFilterState } from "@/components/properties/PropertyFilters";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { PropertyFormDrawer } from "@/components/forms/PropertyFormDrawer";
import { useProperties } from "@/hooks/useProperties";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilterState>({});
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const { properties, isLoading } = useProperties(filters);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter((p) =>
      [p.name, p.address, p.area, p.city].some((f) => f?.toLowerCase().includes(q))
    );
  }, [properties, search]);

  return (
    <PageShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-h1 text-ink-900">Properties</h1>
            <p className="text-ink-600 mt-1">
              {isLoading ? "Loading…" : `${properties.length} ${properties.length === 1 ? "listing" : "listings"}`}
            </p>
          </div>
          <Button leftIcon={<Plus size={16} />} onClick={() => setAdding(true)}>
            <span className="hidden sm:inline">New Property</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, address, or area…"
            className="w-full h-10 pl-9 pr-3 rounded-md text-base md:text-sm bg-surface-card border border-hairline text-ink-900 placeholder:text-ink-400 outline-none focus:border-aqua-400 focus:shadow-glow transition-all"
          />
        </div>

        <PropertyFilters value={filters} onChange={setFilters} />

        <PropertyTable
          properties={filtered}
          isLoading={isLoading}
          onCreate={() => setAdding(true)}
        />
      </div>

      <PropertyFormDrawer isOpen={adding} onClose={() => setAdding(false)} />
    </PageShell>
  );
}
