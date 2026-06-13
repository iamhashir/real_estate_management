"use client";

import { StatusPill } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Deal, Property } from "@/lib/types";

interface ClientDealRowProps {
  deal: Deal;
  property: Property | null;
}

export function ClientDealRow({ deal, property }: ClientDealRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-surface-card border border-hairline px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-900 truncate">
          {property?.name ?? "Unknown property"}
        </p>
        <p className="text-xs text-ink-500">
          {deal.dealType === "rent" ? "Rent" : "Sale"}
          {deal.contractDate ? ` · ${formatDate(deal.contractDate)}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-medium text-ink-900 text-money">
          {formatCurrency(deal.agreedPrice ?? deal.listPrice)}
        </span>
        <StatusPill value={deal.stage} variant="deal" pulse={false} />
      </div>
    </div>
  );
}
