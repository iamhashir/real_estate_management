import type { Metadata } from "next";

export const metadata: Metadata = { title: "Clients" };

// Clients page — will render <SplitPane> with ClientList (left) and
// ClientProfile (right) once components/clients/ and components/layout/ are built.
// Mobile: single-pane list. Tablet: slide-over. Desktop: true split.

export default function ClientsPage() {
  return (
    <div className="flex h-full gap-0 -m-4 md:-m-6">
      {/* Left panel — client list */}
      <div
        className="
          w-full lg:w-[380px] lg:shrink-0
          border-r border-hairline
          bg-surface-card overflow-y-auto
        "
      >
        {/* Search + filter bar skeleton */}
        <div className="p-4 border-b border-hairline">
          <div className="h-9 bg-surface-base rounded-md animate-pulse" />
        </div>

        {/* Client rows skeleton */}
        <div className="divide-y divide-hairline">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 animate-pulse"
              style={{ opacity: 1 - i * 0.07 }}
            >
              <div className="w-9 h-9 rounded-full bg-aqua-100 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-ink-200 rounded w-2/3" />
                <div className="h-3 bg-hairline rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — client profile (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-surface-base">
        <div className="text-center space-y-2">
          <p className="text-label text-ink-400">Select a client</p>
          <p className="text-sm text-ink-400">
            Their profile, deals, and history will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
