"use client";

export const dynamic = 'force-dynamic';

import { useMemo, useState } from "react";
import { Plus, Search, Building2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button, Reveal, Stagger, StaggerItem, Skeleton, EmptyState, Modal, useToast } from "@/components/ui";
import { PropertyFilters, type PropertyFilterState } from "@/components/properties/PropertyFilters";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFormDrawer } from "@/components/forms/PropertyFormDrawer";
import { useProperties, useDeleteProperty } from "@/hooks/useProperties";
import type { Property } from "@/lib/types";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilterState>({});
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { properties, isLoading } = useProperties(filters);
  const deleteProperty = useDeleteProperty();
  const toast = useToast();

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await deleteProperty({ id: deleting._id as never });
      toast.success(`"${deleting.name}" removed`);
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete property");
    } finally {
      setDeleteLoading(false);
    }
  };

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
        <Reveal>
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
        </Reveal>

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-md" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            variant={search || Object.keys(filters).length ? "search" : "properties"}
            icon={<Building2 size={22} />}
            title={search || Object.keys(filters).length ? "No matches" : "No properties yet"}
            description={
              search || Object.keys(filters).length
                ? "Try a different search or clear the filters."
                : "Add your first listing to start building your portfolio."
            }
            action={<Button onClick={() => setAdding(true)}>Add Property</Button>}
          />
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <StaggerItem key={p._id}>
                <PropertyCard
                  property={p}
                  onEdit={() => setEditing(p)}
                  onDelete={() => setDeleting(p)}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>

      <PropertyFormDrawer isOpen={adding} onClose={() => setAdding(false)} />
      <PropertyFormDrawer
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        initialData={editing ?? undefined}
      />
      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title={`Delete "${deleting?.name}"?`}
        description="This will permanently remove the listing. This cannot be undone."
        confirmLabel="Delete Listing"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </PageShell>
  );
}
