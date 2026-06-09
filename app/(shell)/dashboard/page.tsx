"use client";

import { PageShell } from "@/components/layout/PageShell";
import { StatBand } from "@/components/dashboard/StatBand";
import { PipelinePanel } from "@/components/dashboard/PipelinePanel";
import { BreakdownPanel } from "@/components/dashboard/BreakdownPanel";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { stats, isLoading } = useDashboard();

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-h1 text-ink-900">Dashboard</h1>
          <p className="text-ink-600 mt-1">Pipeline overview, key metrics, and inventory at a glance.</p>
        </div>

        <StatBand overview={stats?.overview} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2">
            <PipelinePanel pipeline={stats?.pipeline} isLoading={isLoading} />
          </div>
          <BreakdownPanel
            propertiesByStatus={stats?.propertiesByStatus}
            dealsByStage={stats?.dealsByStage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PageShell>
  );
}
