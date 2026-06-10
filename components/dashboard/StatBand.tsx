"use client";

import { StatCard } from "./StatCard";
import { Skeleton } from "@/components/ui";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-md bg-ink-200/20" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-max"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {/* Primary metric: largest, top-left to bottom-right span on desktop */}
      <motion.div
        className="lg:col-span-2 lg:row-span-2"
        variants={{
          hidden: { opacity: 0, scale: 0.92, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <StatCard
          accent="aqua"
          icon={<Home size={28} />}
          label="Active Listings"
          value={overview.activeListings}
          subtitle={`${overview.totalProperties} total properties across all listings`}
          large
        />
      </motion.div>

      {/* Secondary metrics: smaller, staggered */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.92, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <StatCard
          accent="sea"
          icon={<Users2 size={22} />}
          label="Active Clients"
          value={overview.activeClients}
          subtitle={`${overview.totalClients} total`}
        />
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.92, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <StatCard
          accent="success"
          icon={<CheckSquare size={22} />}
          label="Closed This Month"
          value={overview.closedDealsThisMonth}
          subtitle={`${overview.closedDealsAllTime} all-time`}
        />
      </motion.div>

      <motion.div
        className="lg:col-span-2"
        variants={{
          hidden: { opacity: 0, scale: 0.92, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <StatCard
          accent="coral"
          icon={<TrendingUp size={22} />}
          label="Commission (MTD)"
          value={overview.commissionThisMonth}
          currency
          subtitle={`${formatCurrency(overview.totalCommission)} all-time`}
        />
      </motion.div>
    </motion.div>
  );
}
