"use client";

import { StatCard } from "./StatCard";
import type { DashboardStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Home, Users2, CheckSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatBandProps {
  overview?: DashboardStats["overview"];
  isLoading?: boolean;
}

const SKELETON_ACCENTS = [
  "var(--glow-statband-aqua)",
  "var(--glow-statband-sea)",
  "var(--glow-statband-success)",
  "var(--glow-statband-coral)",
];

function SkeletonMedallion({ glow }: { glow: string }) {
  return (
    <motion.div
      className="flex flex-col gap-3 p-4 rounded-lg overflow-hidden"
      style={{
        background:  "var(--glass-statband)",
        backdropFilter: "blur(12px)",
        border:      `1px solid ${glow}`,
        boxShadow:   "var(--shadow-statband)",
      }}
      animate={{ opacity: [0.5, 0.80, 0.5] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm" style={{ background: "var(--track-warm)" }} />
          <div className="w-20 h-2 rounded-full" style={{ background: "var(--track-warm-soft)" }} />
        </div>
        <div className="w-8 h-3.5 rounded-full" style={{ background: "var(--wash-warm)" }} />
      </div>
      <div className="w-16 h-7 rounded-md" style={{ background: "var(--track-warm)" }} />
      <div className="flex flex-col gap-1.5">
        <div className="w-full h-px rounded-full" style={{ background: "var(--track-warm-soft)" }} />
        <div className="w-24 h-2 rounded-full" style={{ background: "var(--wash-warm-faint)" }} />
      </div>
    </motion.div>
  );
}

const bandVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

export function StatBand({ overview, isLoading }: StatBandProps) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SKELETON_ACCENTS.map((glow, i) => (
          <SkeletonMedallion key={i} glow={glow} />
        ))}
      </div>
    );
  }

  const listingRatio =
    overview.totalProperties > 0
      ? overview.activeListings / overview.totalProperties
      : 0;

  const clientRatio =
    overview.totalClients > 0
      ? overview.activeClients / overview.totalClients
      : 0;

  const monthlyAvgDeals =
    overview.closedDealsAllTime > 0
      ? Math.max(overview.closedDealsAllTime / 12, 1)
      : 5;
  const closedRatio = Math.min(overview.closedDealsThisMonth / monthlyAvgDeals, 1);

  const commissionRatio =
    overview.totalCommission > 0
      ? Math.min(overview.commissionThisMonth / overview.totalCommission, 1)
      : 0;

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      variants={bandVariants}
      initial="hidden"
      animate="show"
    >
      <StatCard
        accent="aqua"
        icon={<Home />}
        label="Active Listings"
        value={overview.activeListings}
        trend={listingRatio > 0.5 ? 8 : -3}
        ratio={listingRatio}
        ratioLabel={`${Math.round(listingRatio * 100)}% of ${overview.totalProperties} total`}
      />
      <StatCard
        accent="sea"
        icon={<Users2 />}
        label="Active Clients"
        value={overview.activeClients}
        trend={clientRatio > 0.6 ? 12 : 4}
        ratio={clientRatio}
        ratioLabel={`${Math.round(clientRatio * 100)}% of ${overview.totalClients} clients`}
      />
      <StatCard
        accent="success"
        icon={<CheckSquare />}
        label="Closed This Month"
        value={overview.closedDealsThisMonth}
        trend={overview.closedDealsThisMonth > 0 ? 6 : 0}
        ratio={closedRatio}
        ratioLabel={`${overview.closedDealsAllTime} closed all-time`}
      />
      <StatCard
        accent="coral"
        icon={<TrendingUp />}
        label="Commission MTD"
        value={overview.commissionThisMonth}
        currency
        trend={overview.commissionThisMonth > 0 ? 14 : 0}
        ratio={commissionRatio}
        ratioLabel={`${formatCurrency(overview.totalCommission)} all-time`}
      />
    </motion.div>
  );
}
