"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Drawer, Spinner, useToast } from "@/components/ui";
import { cn } from "@/lib/utils";
import { DEAL_STAGES, type DealStage } from "@/lib/constants";
import { STAGE_HEX } from "@/components/deals/DealRow";
import { useAdvanceDealStage } from "@/hooks/useDeals";
import { useCurrentAgent } from "@/hooks/useAgents";

export interface StageMenuDeal {
  _id: string;
  stage: DealStage;
  propertyName: string;
}

interface DealStageMenuProps {
  deal: StageMenuDeal | null;
  onClose: () => void;
}

/**
 * Quick stage-change action sheet for the mobile/tablet list view.
 * Renders as a bottom sheet on mobile via the shared Drawer component.
 */
export function DealStageMenu({ deal, onClose }: DealStageMenuProps) {
  const toast        = useToast();
  const advanceStage = useAdvanceDealStage();
  const { agent }    = useCurrentAgent();

  const [pending, setPending] = useState<DealStage | null>(null);

  // Keep the last non-null deal so content stays visible during the exit
  // animation (render-time state adjustment, no effect needed)
  const [current, setCurrent] = useState<StageMenuDeal | null>(deal);
  if (deal && deal !== current) setCurrent(deal);

  const handleSelect = async (stage: DealStage) => {
    if (!current || pending) return;
    if (stage === current.stage) {
      onClose();
      return;
    }
    const label = DEAL_STAGES.find((s) => s.value === stage)?.label ?? stage;
    setPending(stage);
    try {
      await advanceStage({
        id:      current._id as never,
        stage,
        agentId: agent?._id as never,
      });
      toast.success(`Moved to ${label}`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change stage");
    } finally {
      setPending(null);
    }
  };

  return (
    <Drawer
      isOpen={!!deal}
      onClose={onClose}
      title="Change stage"
      description={current?.propertyName}
      size="sm"
    >
      <motion.div
        className="space-y-1"
        role="listbox"
        aria-label="Deal stage"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
      >
        {DEAL_STAGES.map((stage) => {
          const isCurrent = current?.stage === stage.value;
          const accentHex = STAGE_HEX[stage.color] ?? "var(--color-sea-600)";
          return (
            <motion.div
              key={stage.value}
              variants={{
                hidden: { opacity: 0, y: 6 },
                show:   { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <button
                type="button"
                role="option"
                aria-selected={isCurrent}
                disabled={pending !== null}
                onClick={() => handleSelect(stage.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 rounded-md text-left",
                  "min-h-[44px] touch-manipulation transition-colors",
                  isCurrent
                    ? "bg-aqua-100 text-sea-800"
                    : "text-ink-900 hover:bg-surface-base",
                  pending !== null && !isCurrent && "opacity-60"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: accentHex }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium flex-1">{stage.label}</span>
                {pending === stage.value ? (
                  <Spinner size="sm" className="text-sea-700" />
                ) : isCurrent ? (
                  <Check size={16} className="text-sea-700 shrink-0" />
                ) : null}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </Drawer>
  );
}
