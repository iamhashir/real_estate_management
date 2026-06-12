"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { cn, formatCurrency } from "@/lib/utils";
import { DEAL_STAGES, type DealStage, type DealType } from "@/lib/constants";
import { STAGE_HEX } from "@/components/deals/DealRow";
import { useAdvanceDealStage } from "@/hooks/useDeals";
import { useCurrentAgent } from "@/hooks/useAgents";
import { useToast } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KanbanDeal {
  _id: string;
  _creationTime: number;
  stage: DealStage;
  dealType: DealType;
  listPrice: number;
  agreedPrice?: number;
  propertyName: string;
  buyerName: string | null;
  sellerName: string | null;
}

interface DealsKanbanProps {
  deals: KanbanDeal[];
  onOpenDeal: (id: string) => void;
}

// Glass card surface — matches the established style in dashboard/StatCard.tsx
const GLASS_STYLE: React.CSSProperties = {
  background:
    "linear-gradient(140deg, rgba(255,255,255,0.85) 0%, rgba(253,246,232,0.66) 60%, rgba(248,238,218,0.58) 100%)",
  backdropFilter:       "blur(20px) saturate(1.5)",
  WebkitBackdropFilter: "blur(20px) saturate(1.5)",
  border:               "1px solid rgba(255,255,255,0.95)",
  boxShadow:
    "0 1px 2px rgba(160,132,86,0.06), 0 12px 32px -10px rgba(160,132,86,0.16), inset 0 1px 0 rgba(255,255,255,1)",
};

function dealValue(d: KanbanDeal): number {
  return d.agreedPrice ?? d.listPrice ?? 0;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function KanbanCard({ deal, overlay }: { deal: KanbanDeal; overlay?: boolean }) {
  const stageMeta = DEAL_STAGES.find((s) => s.value === deal.stage);
  const accentHex = STAGE_HEX[stageMeta?.color ?? "info"] ?? "#1C97B5";
  const partyName = deal.buyerName ?? deal.sellerName ?? "Unassigned";

  return (
    <div
      className={cn(
        "rounded-lg p-3 select-none",
        overlay && "scale-[1.03] shadow-float"
      )}
      style={{
        ...GLASS_STYLE,
        borderLeft: `3px solid ${accentHex}`,
      }}
    >
      <p className="text-sm font-medium text-ink-900 truncate">{deal.propertyName}</p>
      <p className="text-xs text-ink-600 truncate mt-0.5">
        {partyName}
        <span className="mx-1.5 text-ink-300">·</span>
        {deal.dealType === "rent" ? "Rent" : "Sale"}
      </p>
      <p className="text-sm font-semibold text-ink-900 text-money mt-1.5">
        {formatCurrency(dealValue(deal))}
      </p>
    </div>
  );
}

// ─── Draggable wrapper ────────────────────────────────────────────────────────

function DraggableCard({
  deal,
  onOpen,
  dragHappenedRef,
}: {
  deal: KanbanDeal;
  onOpen: (id: string) => void;
  dragHappenedRef: React.MutableRefObject<boolean>;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id:   deal._id,
    data: { deal },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => {
        // A click that follows a real drag should not open the drawer
        if (isDragging || dragHappenedRef.current) return;
        onOpen(deal._id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(deal._id);
      }}
      className={cn(
        "cursor-grab active:cursor-grabbing touch-manipulation outline-none rounded-lg",
        "focus-visible:ring-2 focus-visible:ring-aqua-400",
        isDragging && "opacity-40"
      )}
      aria-label={`${deal.propertyName} — drag to change stage, press Enter to open`}
    >
      <KanbanCard deal={deal} />
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  deals,
  onOpenDeal,
  dragHappenedRef,
}: {
  stage: (typeof DEAL_STAGES)[number];
  deals: KanbanDeal[];
  onOpenDeal: (id: string) => void;
  dragHappenedRef: React.MutableRefObject<boolean>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.value });
  const accentHex = STAGE_HEX[stage.color] ?? "#1C97B5";
  const total = deals.reduce((sum, d) => sum + dealValue(d), 0);

  return (
    <section className="w-[280px] shrink-0 flex flex-col min-h-0 snap-start" aria-label={`${stage.label} column`}>
      {/* Header: label + count + value sum */}
      <header className="flex items-center gap-2 px-1.5 pb-2 shrink-0">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: accentHex }}
          aria-hidden="true"
        />
        <h2 className="font-display text-sm font-semibold text-ink-900">{stage.label}</h2>
        <span className="text-xs font-medium text-ink-600 bg-ink-200/40 rounded-full px-2 py-0.5 leading-none tabular-nums">
          {deals.length}
        </span>
        <span className="ml-auto text-xs text-ink-600 text-money truncate">
          {formatCurrency(total)}
        </span>
      </header>

      {/* Drop zone / card stack */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-lg p-1.5 space-y-2",
          "bg-surface-base/60 border transition-colors",
          isOver ? "border-aqua-300 bg-aqua-100/40" : "border-transparent"
        )}
      >
        {deals.length === 0 ? (
          <div
            className={cn(
              "h-24 rounded-lg border border-dashed flex items-center justify-center",
              "text-xs text-ink-600 transition-colors",
              isOver ? "border-aqua-300" : "border-hairline"
            )}
          >
            Drop deals here
          </div>
        ) : (
          deals.map((deal) => (
            <DraggableCard
              key={deal._id}
              deal={deal}
              onOpen={onOpenDeal}
              dragHappenedRef={dragHappenedRef}
            />
          ))
        )}
      </div>
    </section>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────

export function DealsKanban({ deals, onOpenDeal }: DealsKanbanProps) {
  const toast            = useToast();
  const advanceStage     = useAdvanceDealStage();
  const { agent }        = useCurrentAgent();
  const reducedMotion    = useReducedMotion();

  const [activeDeal, setActiveDeal] = useState<KanbanDeal | null>(null);
  // Optimistic stage overrides, cleared once the server data catches up
  const [overrides, setOverrides]   = useState<Record<string, DealStage>>({});
  const dragHappenedRef             = useRef(false);

  // Small activation distance so plain clicks still open the drawer;
  // PointerSensor covers mouse, touch and pen input.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // Drop overrides that the realtime query now reflects (render-time state
  // adjustment — converges immediately, no effect needed)
  const settled = deals.filter((d) => overrides[d._id] === d.stage);
  if (settled.length > 0) {
    const next = { ...overrides };
    for (const d of settled) delete next[d._id];
    setOverrides(next);
  }

  const grouped = useMemo(() => {
    const map = {} as Record<DealStage, KanbanDeal[]>;
    for (const s of DEAL_STAGES) map[s.value] = [];
    for (const d of deals) {
      const stage = overrides[d._id] ?? d.stage;
      (map[stage] ?? map[d.stage]).push({ ...d, stage });
    }
    return map;
  }, [deals, overrides]);

  const handleDragStart = (e: DragStartEvent) => {
    dragHappenedRef.current = true;
    setActiveDeal((e.active.data.current?.deal as KanbanDeal) ?? null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveDeal(null);
    // Let the click event that follows pointerup pass before re-enabling opens
    setTimeout(() => { dragHappenedRef.current = false; }, 0);

    if (!over) return;
    const dealId = String(active.id);
    const target = String(over.id) as DealStage;
    const deal   = deals.find((d) => d._id === dealId);
    if (!deal) return;

    const currentStage = overrides[dealId] ?? deal.stage;
    if (currentStage === target) return;

    const label = DEAL_STAGES.find((s) => s.value === target)?.label ?? target;

    // Optimistic move
    setOverrides((prev) => ({ ...prev, [dealId]: target }));
    try {
      await advanceStage({
        id:      dealId as never,
        stage:   target,
        agentId: agent?._id as never,
      });
      toast.success(`Moved to ${label}`);
    } catch (err) {
      // Revert the optimistic move
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[dealId];
        return next;
      });
      toast.error(err instanceof Error ? err.message : "Could not move deal");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveDeal(null);
        setTimeout(() => { dragHappenedRef.current = false; }, 0);
      }}
    >
      <div
        className={cn(
          "flex items-stretch gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x",
          "h-[calc(100dvh-280px)] min-h-[420px]"
        )}
      >
        {DEAL_STAGES.map((stage) => (
          <KanbanColumn
            key={stage.value}
            stage={stage}
            deals={grouped[stage.value]}
            onOpenDeal={onOpenDeal}
            dragHappenedRef={dragHappenedRef}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={reducedMotion ? null : undefined}>
        {activeDeal && <KanbanCard deal={activeDeal} overlay={!reducedMotion} />}
      </DragOverlay>
    </DndContext>
  );
}
