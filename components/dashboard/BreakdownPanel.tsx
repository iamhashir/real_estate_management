"use client";

import { Card, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { PROPERTY_STATUSES, DEAL_STAGES } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";

interface BreakdownPanelProps {
  propertiesByStatus?: DashboardStats["propertiesByStatus"];
  dealsByStage?: DashboardStats["dealsByStage"];
  isLoading?: boolean;
}

const barColor: Record<string, string> = {
  aqua: "bg-aqua-500", warning: "bg-warning", coral: "bg-coral-500",
  info: "bg-info", sea: "bg-sea-600", success: "bg-success", danger: "bg-danger",
};

function BarRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-ink-600">{label}</span>
        <span className="text-ink-900 font-medium text-money">{count}</span>
      </div>
      <div className="h-1.5 rounded-full bg-hairline overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", barColor[color] ?? "bg-aqua-500")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function BreakdownPanel({ propertiesByStatus, dealsByStage, isLoading }: BreakdownPanelProps) {
  if (isLoading || !propertiesByStatus || !dealsByStage) {
    return <Skeleton className="h-full min-h-72 rounded-md" />;
  }

  const propTotal = Object.values(propertiesByStatus).reduce((a, b) => a + b, 0);
  const dealTotal = Object.values(dealsByStage).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-5 h-full space-y-6">
      <div>
        <h2 className="text-h3 text-ink-900 mb-3">Inventory</h2>
        <div className="space-y-3">
          {PROPERTY_STATUSES.map((s) => (
            <BarRow
              key={s.value}
              label={s.label}
              count={propertiesByStatus[s.value] ?? 0}
              total={propTotal}
              color={s.color}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-hairline pt-5">
        <h2 className="text-h3 text-ink-900 mb-3">Deals by Stage</h2>
        <div className="space-y-3">
          {DEAL_STAGES.filter((s) => s.value !== "cancelled").map((s) => (
            <BarRow
              key={s.value}
              label={s.label}
              count={dealsByStage[s.value] ?? 0}
              total={dealTotal}
              color={s.color}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
