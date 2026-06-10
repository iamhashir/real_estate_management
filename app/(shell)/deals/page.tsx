"use client";

import { useMemo, useState } from "react";
import { Plus, Search, FileSignature } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button, Reveal, Stagger, StaggerItem, Skeleton, EmptyState } from "@/components/ui";
import { DealRow } from "@/components/deals/DealRow";
import { DealDetailDrawer } from "@/components/forms/DealDetailDrawer";
import { DealFormDrawer } from "@/components/forms/DealFormDrawer";
import { useAllDeals } from "@/hooks/useDeals";
import { DEAL_STAGES, DEAL_TYPES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { DealStage, DealType } from "@/lib/constants";

type StageFilter = DealStage | "all";
type TypeFilter  = DealType  | "all";

const STAGE_CHIPS = [
  { value: "all",      label: "All" },
  ...DEAL_STAGES.map((s) => ({ value: s.value, label: s.label })),
] as const;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
        "min-h-[44px] shrink-0 border touch-manipulation",
        active
          ? "bg-aqua-100 text-sea-800 border-aqua-300"
          : "bg-surface-card text-ink-600 border-hairline hover:border-aqua-300"
      )}
    >
      {children}
    </button>
  );
}

export default function DealsPage() {
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [typeFilter,  setTypeFilter]  = useState<TypeFilter>("all");
  const [search,      setSearch]      = useState("");
  const [openDealId,  setOpenDealId]  = useState<string | null>(null);
  const [adding,      setAdding]      = useState(false);

  const { deals, isLoading } = useAllDeals({
    stage:    stageFilter !== "all" ? stageFilter : undefined,
    dealType: typeFilter  !== "all" ? typeFilter  : undefined,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return deals;
    return deals.filter((d) =>
      [d.propertyName, d.buyerName, d.sellerName].some((f) => f?.toLowerCase().includes(q))
    );
  }, [deals, search]);

  const pipelineValue = useMemo(
    () => filtered
      .filter((d) => d.stage !== "closed" && d.stage !== "cancelled")
      .reduce((sum: number, d: any) => sum + (d.agreedPrice ?? d.listPrice ?? 0), 0),
    [filtered]
  );

  const activeCount = filtered.filter((d) => d.stage !== "closed" && d.stage !== "cancelled").length;

  return (
    <PageShell>
      <div className="space-y-5">
        {/* Header */}
        <Reveal>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-h1 text-ink-900">Deals</h1>
              <p className="text-ink-600 mt-1">
                {isLoading ? "Loading…" : (
                  <>
                    {filtered.length} {filtered.length === 1 ? "deal" : "deals"}
                    {activeCount > 0 && pipelineValue > 0 && (
                      <span className="text-ink-400">
                        {" "}· {activeCount} active · {formatCurrency(pipelineValue)} pipeline
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
            <Button leftIcon={<Plus size={16} />} onClick={() => setAdding(true)}>
              <span className="hidden sm:inline">New Deal</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </Reveal>

        {/* Stage chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {STAGE_CHIPS.map((chip) => (
            <Chip
              key={chip.value}
              active={stageFilter === chip.value}
              onClick={() => setStageFilter(chip.value as StageFilter)}
            >
              {chip.label}
            </Chip>
          ))}
        </div>

        {/* Type toggle + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 shrink-0">
            {["all", ...DEAL_TYPES.map((t) => t.value)].map((v) => {
              const label = v === "all" ? "All types" : DEAL_TYPES.find((t) => t.value === v)?.label ?? v;
              return (
                <Chip
                  key={v}
                  active={typeFilter === v}
                  onClick={() => setTypeFilter(v as TypeFilter)}
                >
                  {label}
                </Chip>
              );
            })}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by property or client…"
              className="w-full h-9 pl-9 pr-3 rounded-md text-base md:text-sm bg-surface-card border border-hairline text-ink-900 placeholder:text-ink-400 outline-none focus:border-aqua-400 focus:shadow-glow transition-all"
            />
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[60px] rounded-md" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileSignature size={22} />}
            title={search || stageFilter !== "all" || typeFilter !== "all" ? "No matches" : "No deals yet"}
            description={
              search || stageFilter !== "all" || typeFilter !== "all"
                ? "Try a different search or clear the filters."
                : "Create your first deal to start tracking your pipeline."
            }
            action={<Button onClick={() => setAdding(true)}>New Deal</Button>}
          />
        ) : (
          <Stagger className="space-y-2">
            {filtered.map((deal) => (
              <StaggerItem key={deal._id}>
                <DealRow deal={deal} onClick={setOpenDealId} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>

      <DealDetailDrawer dealId={openDealId} onClose={() => setOpenDealId(null)} />
      <DealFormDrawer
        isOpen={adding}
        onClose={() => setAdding(false)}
        onCreated={(id) => { setAdding(false); setOpenDealId(id); }}
      />
    </PageShell>
  );
}
