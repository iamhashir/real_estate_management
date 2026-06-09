import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

// Dashboard page — will be populated with StatBand + Pipeline + RecentActivity
// once components/dashboard/ is built.

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-ink-900">Dashboard</h1>
        <p className="text-ink-600 mt-1">
          Pipeline overview, key metrics, and recent activity.
        </p>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-card rounded-md shadow-card h-28 animate-pulse"
          />
        ))}
      </div>

      {/* Pipeline + activity skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-card rounded-md shadow-card h-72 animate-pulse" />
        <div className="bg-surface-card rounded-md shadow-card h-72 animate-pulse" />
      </div>
    </div>
  );
}
