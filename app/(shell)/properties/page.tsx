import type { Metadata } from "next";

export const metadata: Metadata = { title: "Properties" };

// Properties page — will render <PropertyTable> (desktop/tablet) and
// <PropertyCardList> (mobile) once components/properties/ is built.

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-ink-900">Properties</h1>
          <p className="text-ink-600 mt-1">All listings — filter, search, manage status.</p>
        </div>
        {/* + New Property button goes here */}
        <div className="h-10 w-36 bg-surface-card rounded-md shadow-card animate-pulse" />
      </div>

      {/* Filter bar skeleton */}
      <div className="h-12 bg-surface-card rounded-md shadow-card animate-pulse" />

      {/* Table skeleton */}
      <div className="bg-surface-card rounded-md shadow-card overflow-hidden">
        <div className="h-12 border-b border-hairline animate-pulse bg-aqua-100/40" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-hairline last:border-0 animate-pulse"
            style={{ opacity: 1 - i * 0.08 }}
          />
        ))}
      </div>
    </div>
  );
}
