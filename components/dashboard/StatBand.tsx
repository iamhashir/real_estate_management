"use client";

import { StatCard } from "./StatCard";
import { Skeleton } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/lib/types";

interface StatBandProps {
  overview?: DashboardStats["overview"];
  isLoading?: boolean;
}

export function StatBand({ overview, isLoading }: StatBandProps) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        accent="aqua"
        label="Active Listings"
        value={overview.activeListings}
        subtitle={`${overview.totalProperties} total properties`}
      />
      <StatCard
        accent="sea"
        label="Active Clients"
        value={overview.activeClients}
        subtitle={`${overview.totalClients} on the books`}
      />
      <StatCard
        accent="success"
        label="Closed This Month"
        value={overview.closedDealsThisMonth}
        subtitle={`${overview.closedDealsAllTime} all-time`}
      />
      <StatCard
        accent="coral"
        label="Commission (Month)"
        value={overview.commissionThisMonth}
        format={(n) => formatCurrency(n)}
        subtitle={`${formatCurrency(overview.totalCommission)} all-time`}
      />
    </div>
  );
}
