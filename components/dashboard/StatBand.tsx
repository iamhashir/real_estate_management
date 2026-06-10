"use client";

import { StatCard } from "./StatCard";
import { Skeleton, Stagger, StaggerItem } from "@/components/ui";
import type { DashboardStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Building2, Users, CheckCircle2, Wallet } from "lucide-react";

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
    <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StaggerItem>
        <StatCard
          accent="aqua"
          icon={<Building2 size={18} />}
          label="Active Listings"
          value={overview.activeListings}
          subtitle={`${overview.totalProperties} total properties`}
        />
      </StaggerItem>
      <StaggerItem>
        <StatCard
          accent="sea"
          icon={<Users size={18} />}
          label="Active Clients"
          value={overview.activeClients}
          subtitle={`${overview.totalClients} on the books`}
        />
      </StaggerItem>
      <StaggerItem>
        <StatCard
          accent="success"
          icon={<CheckCircle2 size={18} />}
          label="Closed This Month"
          value={overview.closedDealsThisMonth}
          subtitle={`${overview.closedDealsAllTime} all-time`}
        />
      </StaggerItem>
      <StaggerItem>
        <StatCard
          accent="coral"
          icon={<Wallet size={18} />}
          label="Commission (Month)"
          value={overview.commissionThisMonth}
          currency
          subtitle={`all-time ${formatCurrency(overview.totalCommission)}`}
        />
      </StaggerItem>
    </Stagger>
  );
}
