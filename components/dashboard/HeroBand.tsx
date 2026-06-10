"use client";

import { AnimatedNumber, Skeleton } from "@/components/ui";
import { useCurrentAgent } from "@/hooks/useAgents";
import { motion } from "framer-motion";

interface HeroBandProps {
  portfolioValue: number;
  pipelineValue: number;
  commissionThisMonth: number;
  isLoading?: boolean;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const today = new Date().toLocaleDateString("en-AE", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

export function HeroBand({ portfolioValue, pipelineValue, commissionThisMonth, isLoading }: HeroBandProps) {
  const { agent } = useCurrentAgent();
  const firstName = agent?.name?.split(" ")[0];

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-tide text-white shadow-pop">
      {/* Geometric accent shapes (brutalist style, no blur) */}
      <motion.div
        className="pointer-events-none absolute -top-24 -right-12 w-64 h-64 bg-aqua-300/8 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -left-16 w-80 h-80 bg-coral-500/5 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
      />
      {/* Subtle geometric accent line */}
      <div className="pointer-events-none absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-white/20 to-transparent" />

      <div className="relative p-8 lg:p-10 min-h-60 lg:min-h-48">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: Greeting and date */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-aqua-100/70 text-xs lg:text-sm font-medium uppercase tracking-widest mb-3">
              {today}
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-700 tracking-tight leading-tight">
              {greeting()}
              {firstName && (
                <>
                  <br />
                  <span className="bg-gradient-to-r from-aqua-200 to-sea-200 bg-clip-text text-transparent">
                    {firstName}
                  </span>
                </>
              )}
            </h1>
          </motion.div>

          {/* Right: Asymmetric metrics with variable sizes */}
          <motion.div
            className="flex flex-col gap-6 lg:gap-8 lg:text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Primary metric: Portfolio (largest) */}
            <div className="flex flex-col lg:items-end">
              <p className="text-aqua-100/60 text-xs lg:text-sm font-medium uppercase tracking-widest mb-2">
                Portfolio Value
              </p>
              {isLoading ? (
                <Skeleton className="h-10 lg:h-12 w-40 bg-white/15" />
              ) : (
                <p className="font-display font-700 text-3xl lg:text-4xl text-money tracking-tight">
                  <AnimatedNumber value={portfolioValue} currency />
                </p>
              )}
            </div>

            {/* Secondary metrics: staggered below */}
            <div className="grid grid-cols-2 lg:flex lg:flex-col lg:gap-4 gap-4">
              <div className="lg:text-right">
                <p className="text-aqua-100/50 text-xs font-medium uppercase tracking-wide mb-1">
                  In Pipeline
                </p>
                {isLoading ? (
                  <Skeleton className="h-6 w-24 lg:w-32 lg:ml-auto bg-white/15" />
                ) : (
                  <p className="font-display font-600 text-lg lg:text-xl text-aqua-100">
                    <AnimatedNumber value={pipelineValue} currency />
                  </p>
                )}
              </div>
              <div className="lg:text-right">
                <p className="text-aqua-100/50 text-xs font-medium uppercase tracking-wide mb-1">
                  Commission MTD
                </p>
                {isLoading ? (
                  <Skeleton className="h-6 w-24 lg:w-32 lg:ml-auto bg-white/15" />
                ) : (
                  <p className="font-display font-600 text-lg lg:text-xl text-coral-200">
                    <AnimatedNumber value={commissionThisMonth} currency />
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
