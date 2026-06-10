"use client";

import Link from "next/link";
import { Card, StatusPill, Badge, Skeleton, EmptyState } from "@/components/ui";
import { formatCurrency, formatNumber, formatRelativeDate } from "@/lib/utils";
import { propertyImage } from "@/lib/propertyImage";
import { PROPERTY_TYPES } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { Building2, BedDouble, Maximize, ArrowRight, MapPin } from "lucide-react";

function typeLabel(value: string) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}

interface RecentListingsProps {
  properties: Property[];
  isLoading?: boolean;
}

export function RecentListings({ properties, isLoading }: RecentListingsProps) {
  const recent = [...properties]
    .sort((a, b) => b._creationTime - a._creationTime)
    .slice(0, 6);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-ink-900">Recent Listings</h2>
        <Link
          href="/properties"
          className="inline-flex items-center gap-1 text-sm font-medium text-aqua-500 hover:text-sea-700 transition-colors"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-md" />)}
        </div>
      ) : recent.length === 0 ? (
        <EmptyState icon={<Building2 size={22} />} title="No listings yet" description="Add a property to see it here." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {recent.map((p) => (
            <div
              key={p._id}
              className="flex items-center gap-3 rounded-md bg-surface-base/70 border border-hairline px-3 py-2.5 transition-colors hover:border-aqua-300 hover:bg-surface-card cursor-pointer"
            >
              <span className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 bg-gradient-foam">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={propertyImage(p, 200)}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink-900 truncate">{p.name}</p>
                  <StatusPill value={p.status} variant="property" />
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-ink-400">
                  <span className="flex items-center gap-0.5 min-w-0 truncate">
                    <MapPin size={11} className="shrink-0" />{p.area ?? p.city}
                  </span>
                  <Badge color="sea" size="sm">{typeLabel(p.type)}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-ink-600">
                  <span className="font-medium text-sea-700 text-money">{formatCurrency(p.price)}</span>
                  {p.bedrooms != null && <span className="flex items-center gap-0.5"><BedDouble size={12} />{p.bedrooms}</span>}
                  <span className="flex items-center gap-0.5"><Maximize size={12} />{formatNumber(p.size)}m²</span>
                  <span className="ml-auto text-ink-400 whitespace-nowrap">{formatRelativeDate(p._creationTime)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
