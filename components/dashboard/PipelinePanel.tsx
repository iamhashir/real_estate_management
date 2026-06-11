"use client";

import { Card, StatusPill, Skeleton, EmptyState } from "@/components/ui";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { DEAL_STAGES, type DealStage } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";
import { Waves } from "lucide-react";

const STAGE_HEX: Record<string, string> = {
  info:    "#1390AE",
  sea:     "#0E6B86",
  warning: "#D4A95F",
  aqua:    "#19C7C2",
  success: "#2A6B54",
  danger:  "#A75049",
};

interface PipelinePanelProps {
  pipeline?: DashboardStats["pipeline"];
  isLoading?: boolean;
  onDealClick?: (id: string) => void;
}

const ACTIVE_STAGES = DEAL_STAGES.filter(
  (s) => s.value !== "closed" && s.value !== "cancelled"
);

export function PipelinePanel({ pipeline, isLoading, onDealClick }: PipelinePanelProps) {
  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3" style={{ color: "#111625" }}>Active Pipeline</h2>
        {pipeline && (
          <span className="text-sm" style={{ color: "#6B6560" }}>{pipeline.length} deals</span>
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
          description='No active deals yet. Create one from the "New" menu to start tracking your pipeline.'
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
                  <span className="text-xs" style={{ color: "#6B6560" }}>{deals.length}</span>
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
                        className="flex items-center justify-between gap-3 rounded-md cursor-pointer px-3 py-2.5 transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.55)",
                          border:     "1px solid rgba(255,255,255,0.80)",
                          boxShadow:  "0 1px 4px rgba(26,24,20,0.04)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.80)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.55)")}
                      >
                        {/* Stage accent dot replaces banned side-stripe */}
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: accentColor }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate" style={{ color: "#111625" }}>
                            {d.propertyName}
                          </p>
                          <p className="text-xs truncate" style={{ color: "#78716c" }}>
                            {d.buyerName ?? "Unassigned"} · {d.dealType === "rent" ? "Rent" : "Sale"} · {formatRelativeDate(d._creationTime)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-money shrink-0" style={{ color: "#111625" }}>
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
