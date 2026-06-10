"use client";

import { Card, StatusPill, Skeleton, EmptyState } from "@/components/ui";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { DEAL_STAGES, type DealStage } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";
import { Waves } from "lucide-react";

const STAGE_HEX: Record<string, string> = {
  info:    "#1390AE",
  sea:     "#0E6B86",
  warning: "#F5B53D",
  aqua:    "#19C7C2",
  success: "#1FB888",
  danger:  "#E5484D",
};

interface PipelinePanelProps {
  pipeline?: DashboardStats["pipeline"];
  isLoading?: boolean;
  onDealClick?: (id: string) => void;
}

// Active stages only, in flow order
const ACTIVE_STAGES = DEAL_STAGES.filter(
  (s) => s.value !== "closed" && s.value !== "cancelled"
);

export function PipelinePanel({ pipeline, isLoading, onDealClick }: PipelinePanelProps) {
  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-ink-900">Active Pipeline</h2>
        {pipeline && (
          <span className="text-sm text-ink-400">{pipeline.length} deals</span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md" />
          ))}
        </div>
      ) : !pipeline || pipeline.length === 0 ? (
        <EmptyState
          icon={<Waves size={22} />}
          title="Calm waters"
          description="No active deals yet. Create one from the “New” menu to start tracking your pipeline."
        />
      ) : (
        <div className="space-y-5">
          {ACTIVE_STAGES.map((stage) => {
            const deals = pipeline.filter((d) => d.stage === stage.value);
            if (!deals.length) return null;
            return (
              <div key={stage.value}>
                <div className="flex items-center gap-2 mb-2">
                  <StatusPill value={stage.value as DealStage} variant="deal" pulse={false} />
                  <span className="text-xs text-ink-400">{deals.length}</span>
                </div>
                <div className="space-y-1.5">
                  {deals.map((d) => {
                    const stageMeta = DEAL_STAGES.find((s) => s.value === d.stage);
                    const accentColor = STAGE_HEX[stageMeta?.color ?? "info"] ?? "#1390AE";
                    return (
                      <div
                        key={d._id}
                        role={onDealClick ? "button" : undefined}
                        tabIndex={onDealClick ? 0 : undefined}
                        onClick={() => onDealClick?.(d._id)}
                        onKeyDown={(e) => e.key === "Enter" && onDealClick?.(d._id)}
                        className="flex items-center justify-between gap-3 rounded-md bg-surface-base hover:bg-surface-card cursor-pointer px-3 py-2.5 border border-hairline transition-colors"
                        style={{ borderLeftColor: accentColor, borderLeftWidth: "3px" }}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink-900 truncate">{d.propertyName}</p>
                          <p className="text-xs text-ink-400 truncate">
                            {d.buyerName ?? "Unassigned"} · {d.dealType === "rent" ? "Rent" : "Sale"} · <span className="text-ink-400">{formatRelativeDate(d._creationTime)}</span>
                          </p>
                        </div>
                        <span className="text-sm font-medium text-ink-900 text-money shrink-0">
                          {formatCurrency(d.agreedPrice ?? d.listPrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
