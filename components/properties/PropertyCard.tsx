"use client";

import { Card, Badge, StatusPill } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { propertyImage } from "@/lib/propertyImage";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { Property } from "@/lib/types";

function typeLabel(value: string) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}
function listingLabel(value: string) {
  return LISTING_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function PropertyCard({ property, onClick }: { property: Property; onClick?: () => void }) {
  return (
    <Card hover onClick={onClick} className="overflow-hidden">
      {/* Image header */}
      <div className="relative aspect-[16/10] bg-gradient-tide overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={propertyImage(property, 800)}
          alt={property.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
        {/* legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-sea-950/70 via-sea-950/10 to-transparent" />

        {/* top row: listing type + status */}
        <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between">
          <span className="rounded-full bg-white/90 backdrop-blur px-2.5 py-0.5 text-xs font-medium text-sea-800 shadow-card">
            {listingLabel(property.listingType)}
          </span>
          <StatusPill value={property.status} variant="property" className="bg-white/90 backdrop-blur shadow-card" />
        </div>

        {/* price */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between gap-2">
          <p className="text-white font-display font-600 text-xl text-money drop-shadow">
            {formatCurrency(property.price)}
            {property.listingType === "rent" && <span className="text-sm font-sans text-white/80">/yr</span>}
          </p>
          <Badge color="aqua" className="bg-white/90">{typeLabel(property.type)}</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-h3 text-ink-900 truncate">{property.name}</h3>
        <p className="text-xs text-ink-400 flex items-center gap-1 mt-1">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{property.area ? `${property.area}, ` : ""}{property.city}</span>
        </p>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-hairline text-sm text-ink-600">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5"><BedDouble size={15} className="text-ink-400" />{property.bedrooms} bd</span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5"><Bath size={15} className="text-ink-400" />{property.bathrooms} ba</span>
          )}
          <span className="flex items-center gap-1.5"><Maximize size={15} className="text-ink-400" />{formatNumber(property.size)} m²</span>
        </div>
      </div>
    </Card>
  );
}
