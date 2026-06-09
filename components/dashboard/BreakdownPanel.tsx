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

const HEX: Record<string, string> = {
  aqua: "#19C7C2", warning: "#F5B53D", coral: "#FF6B5E",
  info: "#1390AE", sea: "#1390AE", success: "#1FB888", danger: "#E5484D",
};

function Donut({ segments, total }: { segments: { color: string; count: number }[]; total: number }) {
  let acc = 0;
  const stops = total
    ? segments
        .filter((s) => s.count > 0)
        .map((s) => {
          const start = (acc / total) * 360;
          acc += s.count;
          const end = (acc / total) * 360;
          return `${HEX[s.color] ?? "#19C7C2"} ${start}deg ${end}deg`;
        })
        .join(", ")
    : "#DCEAEE 0deg 360deg";

  return (
    <div className="relative w-32 h-32 shrink-0">
      <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${stops})` }} />
      <div className="absolute inset-[13px] rounded-full bg-surface-card grid place-items-center shadow-[inset_0_0_0_1px_rgba(11,31,38,0.06)]">
        <div className="text-center leading-none">
          <p className="text-2xl font-display font-600 text-ink-900 text-money">{total}</p>
          <p className="text-[10px] uppercase tracking-wide text-ink-400 mt-1">listings</p>
        </div>
      </div>
    </div>
  );
}

function BarRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-ink-600">{label}</span>
        <span className="text-ink-900 font-medium text-money">{count}</span>
      </div>
      <div className="h-1.5 rounded-full bg-hairline overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: HEX[color] ?? "#19C7C2" }} />
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

  const donutSegments = PROPERTY_STATUSES.map((s) => ({ color: s.color, count: propertiesByStatus[s.value] ?? 0 }));

  return (
    <Card className="p-5 h-full space-y-6">
      <div>
        <h2 className="text-h3 text-ink-900 mb-4">Inventory</h2>
        <div className="flex items-center gap-5">
          <Donut segments={donutSegments} total={propTotal} />
          <ul className="flex-1 space-y-2 min-w-0">
            {PROPERTY_STATUSES.map((s) => (
              <li key={s.value} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: HEX[s.color] }} />
                  <span className="text-ink-600 truncate">{s.label}</span>
                </span>
                <span className="text-ink-900 font-medium text-money shrink-0">{propertiesByStatus[s.value] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline pt-5">
        <h2 className="text-h3 text-ink-900 mb-3">Deals by Stage</h2>
        <div className="space-y-3">
          {DEAL_STAGES.filter((s) => s.value !== "cancelled").map((s) => (
            <BarRow key={s.value} label={s.label} count={dealsByStage[s.value] ?? 0} total={dealTotal} color={s.color} />
          ))}
        </div>
      </div>
    </Card>
  );
}
