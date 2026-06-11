"use client";

export const dynamic = 'force-dynamic';

import { useMemo, useState, useEffect } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { HeroBand } from "@/components/dashboard/HeroBand";
import { StatBand } from "@/components/dashboard/StatBand";
import { PipelinePanel } from "@/components/dashboard/PipelinePanel";
import { BreakdownPanel } from "@/components/dashboard/BreakdownPanel";
import { RecentListings } from "@/components/dashboard/RecentListings";
import { DealDetailDrawer } from "@/components/forms/DealDetailDrawer";
import { Reveal } from "@/components/ui";
import { useDashboard } from "@/hooks/useDashboard";
import { useProperties } from "@/hooks/useProperties";
import { shellNav } from "@/lib/shellNav";

export default function DashboardPage() {
  const { stats, isLoading } = useDashboard();
  const { properties, isLoading: propsLoading } = useProperties();
  const [dealDetailId, setDealDetailId] = useState<string | null>(null);

  useEffect(() => shellNav.deal.register((id) => setDealDetailId(id)), []);

  const portfolioValue = useMemo(
    () => properties.reduce((sum, p) => sum + (p.price ?? 0), 0),
    [properties]
  );
  const pipelineValue = useMemo(
    () => (stats?.pipeline ?? []).reduce((sum, d) => sum + (d.agreedPrice ?? d.listPrice ?? 0), 0),
    [stats]
  );

  return (
    <PageShell>
      <div className="space-y-5">
        <Reveal>
          <HeroBand
            portfolioValue={portfolioValue}
            pipelineValue={pipelineValue}
            commissionThisMonth={stats?.overview.commissionThisMonth ?? 0}
            isLoading={isLoading || propsLoading}
          />
        </Reveal>

        <StatBand overview={stats?.overview} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <Reveal delay={0.08} className="lg:col-span-2">
            <PipelinePanel
              pipeline={stats?.pipeline}
              isLoading={isLoading}
              onDealClick={setDealDetailId}
            />
          </Reveal>
          <Reveal delay={0.14}>
            <BreakdownPanel
              propertiesByStatus={stats?.propertiesByStatus}
              dealsByStage={stats?.dealsByStage}
              isLoading={isLoading}
            />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <RecentListings properties={properties} isLoading={propsLoading} />
        </Reveal>
      </div>

      <DealDetailDrawer dealId={dealDetailId} onClose={() => setDealDetailId(null)} />
    </PageShell>
  );
}
