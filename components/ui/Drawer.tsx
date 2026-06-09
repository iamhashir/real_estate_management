"use client";

import { cn } from "@/lib/utils";
import { DRAWER_ANIMATION_MS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface DrawerProps {
  isOpen:       boolean;
  onClose:      () => void;
  title?:       string;
  description?: string;
  children:     React.ReactNode;
  footer?:      React.ReactNode;
  size?:        "sm" | "md" | "lg";
}

const desktopWidths = { sm: "max-w-sm", md: "max-w-[480px]", lg: "max-w-[600px]" };
const ease = [0.22, 1, 0.36, 1] as const;
const ms   = DRAWER_ANIMATION_MS / 1000;

export function Drawer({ isOpen, onClose, title, description, children, footer, size = "md" }: DrawerProps) {
  const { isMobile } = useBreakpoint();

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Escape key closes
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ms * 0.8 }}
            className="fixed inset-0 z-40 bg-sea-950/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {isMobile ? (
            // ── Mobile: bottom sheet ─────────────────────────────────────────
            <motion.div
              key="sheet"
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className={cn(
                "fixed inset-x-0 bottom-0 z-50",
                "bg-surface-card rounded-t-xl shadow-float",
                "flex flex-col max-h-[90dvh]",
                "touch-pan-y"
              )}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-hairline" />
              </div>
              <DrawerInner
                title={title}
                description={description}
                children={children}
                footer={footer}
                onClose={onClose}
              />
            </motion.div>
          ) : (
            // ── Desktop / tablet: right-side panel ───────────────────────────
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: ms, ease }}
              className={cn(
                "fixed inset-y-0 right-0 z-50",
                "w-full bg-surface-card shadow-float",
                "flex flex-col",
                desktopWidths[size]
              )}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <DrawerInner
                title={title}
                description={description}
                children={children}
                footer={footer}
                onClose={onClose}
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ─── Shared inner layout ──────────────────────────────────────────────────────

function DrawerInner({
  title,
  description,
  children,
  footer,
  onClose,
}: Pick<DrawerProps, "title" | "description" | "children" | "footer" | "onClose">) {
  return (
    <>
      {/* Header */}
      {(title || description) && (
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-hairline shrink-0">
          <div>
            {title && (
              <h2 className="text-h3 text-ink-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-ink-600 mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-700 transition-colors p-1 -mr-1 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="shrink-0 px-5 py-4 border-t border-hairline bg-surface-base safe-bottom">
          {footer}
        </div>
      )}
    </>
  );
}
