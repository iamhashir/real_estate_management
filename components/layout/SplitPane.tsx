"use client";

import { cn } from "@/lib/utils";
import { CLIENT_LIST_WIDTH } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface SplitPaneProps {
  list: React.ReactNode;
  detail: React.ReactNode;
  /** Whether a detail item is currently selected (drives mobile/tablet overlay). */
  hasSelection: boolean;
  onBack: () => void;
  /** Shown in the right panel on desktop when nothing is selected. */
  placeholder?: React.ReactNode;
}

/**
 * Master/detail layout.
 *  - desktop (≥lg): fixed list column + fluid detail, always side by side
 *  - tablet/mobile: single list; selecting slides the detail in as a full
 *    overlay with a back button
 */
export function SplitPane({ list, detail, hasSelection, onBack, placeholder }: SplitPaneProps) {
  const { isDesktop } = useBreakpoint();

  if (isDesktop) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)]">
        <div
          className="shrink-0 border-r border-hairline overflow-y-auto bg-surface-card"
          style={{ width: CLIENT_LIST_WIDTH }}
        >
          {list}
        </div>
        <div className="flex-1 min-w-0 overflow-y-auto bg-surface-base">
          {hasSelection ? detail : placeholder}
        </div>
      </div>
    );
  }

  // Tablet / mobile: list with a sliding detail overlay
  return (
    <div className="relative h-[calc(100dvh-3.5rem-4rem)] md:h-[calc(100dvh-3.5rem)] overflow-hidden">
      <div className="h-full overflow-y-auto bg-surface-card">{list}</div>

      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-10 bg-surface-base flex flex-col"
          >
            <div className="h-12 shrink-0 flex items-center px-2 border-b border-hairline bg-surface-card">
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm font-medium text-sea-700 min-h-[44px] px-2"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
