"use client";

import { AnimatedNumber, Skeleton } from "@/components/ui";
import { Skyline } from "@/components/illustrations";
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
    <div className="glass-cream relative overflow-hidden rounded-xl">
      {/* Animated skyline — draws itself along the bottom edge */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-full lg:w-3/5 opacity-[0.13] lg:opacity-[0.20]">
        <Skyline className="w-full h-auto" />
      </div>

      {/* Soft aqua orb behind the metrics */}
      <motion.div
        className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full"
        style={{
          background:
            "var(--glow-aqua-soft)",
          filter: "blur(30px)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Honey top-edge accent line */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--divider-brass)" }}
      />

      <div className="relative p-8 lg:p-14 min-h-72 lg:min-h-64 flex flex-col justify-between">
        <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-14">
          {/* Left: Greeting and date */}
          <motion.div
            className="flex-1 max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-ink-600 text-xs lg:text-sm font-bold uppercase tracking-[0.12em] mb-8 block">
              {today}
            </p>
            <h1 className="font-serif text-6xl lg:text-7xl font-600 leading-none text-ink-900 mb-2">
              {greeting()}
            </h1>
            {firstName && (
              <motion.h2
                className="font-serif text-5xl lg:text-6xl font-600 leading-none text-brass-500"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {firstName}
              </motion.h2>
            )}
          </motion.div>

          {/* Right: Asymmetric metrics */}
          <motion.div
            className="flex flex-col gap-8 lg:gap-10 lg:text-right"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Primary metric: Portfolio */}
            <div className="flex flex-col lg:items-end group">
              <p className="text-metric-label text-xs lg:text-sm font-bold uppercase tracking-[0.1em] mb-3">
                Portfolio Value
              </p>
              {isLoading ? (
                <Skeleton className="h-12 lg:h-14 w-48 bg-black/10 rounded-sm" />
              ) : (
                <motion.p
                  className="font-display font-800 text-3xl lg:text-4xl text-metric-ink tracking-tight leading-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <AnimatedNumber value={portfolioValue} currency />
                </motion.p>
              )}
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-2 lg:flex lg:flex-col lg:gap-6 gap-4">
              <div className="lg:text-right">
                <p className="text-metric-label text-xs font-bold uppercase tracking-[0.08em] mb-2">
                  In Pipeline
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-28 bg-black/10 rounded-sm lg:ml-auto" />
                ) : (
                  <p className="font-display font-700 text-xl lg:text-2xl text-metric-ink">
                    <AnimatedNumber value={pipelineValue} currency />
                  </p>
                )}
              </div>
              <div className="lg:text-right">
                <p className="text-metric-label text-xs font-bold uppercase tracking-[0.08em] mb-2">
                  Commission MTD
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-28 bg-black/10 rounded-sm lg:ml-auto" />
                ) : (
                  <p className="font-display font-700 text-xl lg:text-2xl text-emerald-500">
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
