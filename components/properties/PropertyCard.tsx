"use client";

import { Card, Badge, StatusPill } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PROPERTY_TYPES } from "@/lib/constants";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { Property } from "@/lib/types";

function typeLabel(value: string) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="text-h3 text-ink-900 truncate">{property.name}</h3>
          <p className="text-xs text-ink-400 flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{property.area ? `${property.area}, ` : ""}{property.city}</span>
          </p>
        </div>
        <StatusPill value={property.status} variant="property" />
      </div>

      <p className="text-display-xl font-display font-600 text-sea-700 text-money leading-none my-3">
        {formatCurrency(property.price)}
        {property.listingType === "rent" && <span className="text-sm text-ink-400 font-sans">/yr</span>}
      </p>

      <div className="flex items-center gap-3 text-sm text-ink-600">
        <Badge color="sea">{typeLabel(property.type)}</Badge>
        {property.bedrooms != null && (
          <span className="flex items-center gap-1"><BedDouble size={14} />{property.bedrooms}</span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1"><Bath size={14} />{property.bathrooms}</span>
        )}
        <span className="flex items-center gap-1"><Maximize size={14} />{formatNumber(property.size)}m²</span>
      </div>
    </Card>
  );
}
