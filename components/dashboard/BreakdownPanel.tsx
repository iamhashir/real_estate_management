"use client";

import { motion } from "framer-motion";
import { Card, Skeleton } from "@/components/ui";
import { PROPERTY_STATUSES, DEAL_STAGES } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";

interface BreakdownPanelProps {
  propertiesByStatus?: DashboardStats["propertiesByStatus"];
  dealsByStage?: DashboardStats["dealsByStage"];
  isLoading?: boolean;
}

const HEX: Record<string, string> = {
  aqua:    "var(--color-aqua-500)",
  warning: "var(--color-warning)",
  coral:   "var(--color-coral-500)",
  info:    "var(--color-sea-600)",
  sea:     "var(--color-sea-600)",
  success: "var(--color-success)",
  danger:  "var(--color-danger)",
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
          return `${HEX[s.color] ?? "var(--color-aqua-500)"} ${start}deg ${end}deg`;
        })
        .join(", ")
    : "var(--breakdown-empty) 0deg 360deg";

  return (
    <div className="relative w-32 h-32 shrink-0">
      <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${stops})` }} />
      <div
        className="absolute inset-[13px] rounded-full grid place-items-center"
        style={{
          background: "var(--breakdown-surface)",
          boxShadow:  "var(--breakdown-shadow)",
        }}
      >
        <div className="text-center leading-none">
          <p className="text-2xl font-display font-600 text-money" style={{ color: "var(--color-ink-900)" }}>{total}</p>
          <p className="text-[10px] uppercase tracking-wide mt-1" style={{ color: "var(--color-ink-500)" }}>listings</p>
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
        <span style={{ color: "var(--color-ink-400)" }}>{label}</span>
        <span className="font-medium text-money" style={{ color: "var(--color-ink-900)" }}>{count}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--track-warm)" }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{ backgroundColor: HEX[color] ?? "var(--color-aqua-500)" }}
        />
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
        <h2 className="text-h3 mb-4" style={{ color: "var(--color-ink-900)" }}>Inventory</h2>
        <div className="flex items-center gap-5">
          <Donut segments={donutSegments} total={propTotal} />
          <ul className="flex-1 space-y-2 min-w-0">
            {PROPERTY_STATUSES.map((s) => (
              <li key={s.value} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: HEX[s.color] }} />
                  <span className="truncate" style={{ color: "var(--color-ink-400)" }}>{s.label}</span>
                </span>
                <span className="font-medium text-money shrink-0" style={{ color: "var(--color-ink-900)" }}>
                  {propertiesByStatus[s.value] ?? 0}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-5" style={{ borderTopColor: "var(--track-warm)" }}>
        <h2 className="text-h3 mb-3" style={{ color: "var(--color-ink-900)" }}>Deals by Stage</h2>
        <div className="space-y-3">
          {DEAL_STAGES.filter((s) => s.value !== "cancelled").map((s) => (
            <BarRow key={s.value} label={s.label} count={dealsByStage[s.value] ?? 0} total={dealTotal} color={s.color} />
          ))}
        </div>
      </div>
    </Card>
  );
}
