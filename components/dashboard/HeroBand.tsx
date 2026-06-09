"use client";

import { AnimatedNumber, Skeleton } from "@/components/ui";
import { useCurrentAgent } from "@/hooks/useAgents";

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
    <div className="relative overflow-hidden rounded-md bg-gradient-tide text-white shadow-pop">
      {/* sheen / depth */}
      <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-aqua-300/20 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "repeating-radial-gradient(circle at 90% 10%, rgba(255,255,255,0.6) 0 1px, transparent 1px 56px)" }}
      />

      <div className="relative p-6 lg:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-aqua-100 text-sm">{today}</p>
            <h1 className="font-serif text-3xl lg:text-4xl mt-1 tracking-tight">
              {greeting()}{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-aqua-100/90 text-sm mt-1.5 max-w-md">
              Here&rsquo;s your control room — portfolio, pipeline, and this month&rsquo;s earnings at a glance.
            </p>
          </div>

          {/* Headline metrics */}
          <div className="grid grid-cols-3 gap-5 lg:gap-7 shrink-0">
            <HeroMetric label="Portfolio" value={portfolioValue} loading={isLoading} />
            <HeroMetric label="In Pipeline" value={pipelineValue} loading={isLoading} />
            <HeroMetric label="Commission · MTD" value={commissionThisMonth} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ label, value, loading }: { label: string; value: number; loading?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wide text-aqua-100/80 whitespace-nowrap">{label}</p>
      {loading ? (
        <Skeleton className="h-7 w-24 mt-1.5 bg-white/20" />
      ) : (
        <p className="font-display font-600 text-lg lg:text-xl mt-1 text-money whitespace-nowrap">
          <AnimatedNumber value={value} currency />
        </p>
      )}
    </div>
  );
}
