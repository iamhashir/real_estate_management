"use client";

import { StatCard } from "./StatCard";
import { Skeleton, Stagger, StaggerItem } from "@/components/ui";
import type { DashboardStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Home, Users2, CheckSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatBandProps {
  overview?: DashboardStats["overview"];
  isLoading?: boolean;
}

export function StatBand({ overview, isLoading }: StatBandProps) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
      {/* Primary metric: largest, top-left to bottom-right span on desktop */}
      <StaggerItem>
        <motion.div
          className="lg:col-span-2 lg:row-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            accent="aqua"
            icon={<Home size={24} />}
            label="Active Listings"
            value={overview.activeListings}
            subtitle={`${overview.totalProperties} total properties across all listings`}
            large
          />
        </motion.div>
      </StaggerItem>

      {/* Secondary metrics: smaller, staggered */}
      <StaggerItem>
        <StatCard
          accent="sea"
          icon={<Users2 size={20} />}
          label="Active Clients"
          value={overview.activeClients}
          subtitle={`${overview.totalClients} total`}
        />
      </StaggerItem>
      <StaggerItem>
        <StatCard
          accent="success"
          icon={<CheckSquare size={20} />}
          label="Closed This Month"
          value={overview.closedDealsThisMonth}
          subtitle={`${overview.closedDealsAllTime} all-time`}
        />
      </StaggerItem>
      <StaggerItem>
        <StatCard
          accent="coral"
          icon={<TrendingUp size={20} />}
          label="Commission (MTD)"
          value={overview.commissionThisMonth}
          currency
          subtitle={`${formatCurrency(overview.totalCommission)} all-time`}
        />
      </StaggerItem>
    </Stagger>
  );
}
