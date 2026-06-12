"use client";

import { ChevronDown } from "lucide-react";
import { cn, formatCurrency, formatRelativeDate } from "@/lib/utils";
import { StatusPill } from "@/components/ui";
import { DEAL_STAGES } from "@/lib/constants";
import type { DealStage } from "@/lib/constants";

export const STAGE_HEX: Record<string, string> = {
  info:    "#1C97B5",
  sea:     "#15758F",
  warning: "#D9A647",
  aqua:    "#17BFBA",
  success: "#1FB888",
  danger:  "#E5484D",
};

interface DealRowDeal {
  _id: string;
  _creationTime: number;
  stage: DealStage;
  dealType: "sale" | "rent";
  listPrice: number;
  agreedPrice?: number;
  propertyName: string;
  buyerName: string | null;
  sellerName: string | null;
}

interface DealRowProps {
  deal: DealRowDeal;
  onClick: (id: string) => void;
  /** When provided, renders a tappable stage pill that opens the quick stage-change menu. */
  onStageMenu?: (deal: DealRowDeal) => void;
}

export function DealRow({ deal, onClick, onStageMenu }: DealRowProps) {
  const stageMeta  = DEAL_STAGES.find((s) => s.value === deal.stage);
  const accentHex  = STAGE_HEX[stageMeta?.color ?? "info"] ?? "#1C97B5";
  const price      = deal.agreedPrice ?? deal.listPrice;
  const partyName  = deal.buyerName ?? deal.sellerName ?? "Unassigned";

  return (
    // div with button semantics (not <button>) so the stage-change
    // affordance can be nested without invalid button-in-button HTML
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(deal._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(deal._id);
        }
      }}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-md text-left",
        "bg-surface-base hover:bg-surface-card border border-hairline",
        "transition-colors cursor-pointer group touch-manipulation",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400"
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
        {onStageMenu ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStageMenu(deal);
            }}
            className={cn(
              "flex items-center gap-1 -mr-1.5 px-1.5 rounded-md",
              "min-h-[44px] min-w-[44px] justify-center touch-manipulation",
              "hover:bg-surface-card transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400"
            )}
            aria-label={`Change stage for ${deal.propertyName} (currently ${stageMeta?.label ?? deal.stage})`}
            aria-haspopup="listbox"
          >
            <StatusPill value={deal.stage} variant="deal" pulse={false} />
            <ChevronDown size={14} className="text-ink-400 shrink-0" aria-hidden="true" />
          </button>
        ) : (
          <StatusPill value={deal.stage} variant="deal" pulse={false} />
        )}
      </div>
    </div>
  );
}
