"use client";

import { DataTable, type TableColumn, Badge, StatusPill, Button, EmptyState } from "@/components/ui";
import { PropertyCard } from "./PropertyCard";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PROPERTY_TYPES } from "@/lib/constants";
import { Building2 } from "lucide-react";
import type { Property } from "@/lib/types";

const RAIL: Record<string, string> = {
  available: "#17BFBA",
  under_negotiation: "#D9A647",
  sold: "#FF6B5E",
  rented: "#1C97B5",
};

function typeLabel(value: string) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}

interface PropertyTableProps {
  properties: Property[];
  isLoading: boolean;
  onRowClick?: (p: Property) => void;
  onCreate?: () => void;
}

export function PropertyTable({ properties, isLoading, onRowClick, onCreate }: PropertyTableProps) {
  const columns: TableColumn<Property>[] = [
    {
      key: "name",
      header: "Property",
      render: (p) => (
        <div className="min-w-0">
          <p className="font-medium text-ink-900 truncate">{p.name}</p>
          <p className="text-xs text-ink-400 truncate">{p.area ? `${p.area}, ` : ""}{p.city}</p>
        </div>
      ),
    },
    { key: "type", header: "Type", render: (p) => <Badge color="sea">{typeLabel(p.type)}</Badge> },
    {
      key: "size", header: "Size", align: "right", hideOnTablet: true,
      render: (p) => <span className="text-money">{formatNumber(p.size)} m²</span>,
    },
    {
      key: "price", header: "Price", align: "right",
      render: (p) => (
        <span className="text-money font-medium">
          {formatCurrency(p.price)}{p.listingType === "rent" && <span className="text-ink-400">/yr</span>}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (p) => <StatusPill value={p.status} variant="property" /> },
  ];

  return (
    <DataTable
      columns={columns}
      rows={properties}
      getRowId={(p) => p._id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      railColor={(p) => RAIL[p.status] ?? "#DCEAEE"}
      renderCard={(p) => <PropertyCard property={p} />}
      emptyState={
        <EmptyState
          variant="properties"
          icon={<Building2 size={22} />}
          title="No properties yet"
          description="Add your first listing to start building your portfolio."
          action={onCreate ? <Button onClick={onCreate}>Add Property</Button> : undefined}
        />
      }
    />
  );
}
