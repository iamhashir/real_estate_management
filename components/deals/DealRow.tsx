"use client";

import { cn, formatCurrency, formatRelativeDate } from "@/lib/utils";
import { StatusPill } from "@/components/ui";
import { DEAL_STAGES } from "@/lib/constants";
import type { DealStage } from "@/lib/constants";

const STAGE_HEX: Record<string, string> = {
  info:    "#1390AE",
  sea:     "#0E6B86",
  warning: "#F5B53D",
  aqua:    "#19C7C2",
  success: "#1FB888",
  danger:  "#E5484D",
};

interface DealRowProps {
  deal: {
    _id: string;
    _creationTime: number;
    stage: DealStage;
    dealType: "sale" | "rent";
    listPrice: number;
    agreedPrice?: number;
    propertyName: string;
    buyerName: string | null;
    sellerName: string | null;
  };
  onClick: (id: string) => void;
}

export function DealRow({ deal, onClick }: DealRowProps) {
  const stageMeta  = DEAL_STAGES.find((s) => s.value === deal.stage);
  const accentHex  = STAGE_HEX[stageMeta?.color ?? "info"] ?? "#1390AE";
  const price      = deal.agreedPrice ?? deal.listPrice;
  const partyName  = deal.buyerName ?? deal.sellerName ?? "Unassigned";

  return (
    <button
      type="button"
      onClick={() => onClick(deal._id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-md text-left",
        "bg-surface-base hover:bg-surface-card border border-hairline",
        "transition-colors cursor-pointer group"
      )}
      style={{ borderLeftColor: accentHex, borderLeftWidth: "3px" }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink-900 truncate">{deal.propertyName}</p>
        <p className="text-[13px] text-ink-400 truncate mt-0.5">
          {partyName}
          <span className="mx-1.5 text-ink-300">·</span>
          {deal.dealType === "rent" ? "Rent" : "Sale"}
          <span className="mx-1.5 text-ink-300">·</span>
          {formatRelativeDate(deal._creationTime)}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-medium text-ink-900 text-money hidden sm:block">
          {formatCurrency(price)}
        </span>
        <StatusPill value={deal.stage} variant="deal" pulse={false} />
      </div>
    </button>
  );
}
