"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface ModalProps {
  isOpen:        boolean;
  onClose:       () => void;
  title:         string;
  description?:  string;
  children?:     React.ReactNode;
  confirmLabel?: string;
  cancelLabel?:  string;
  onConfirm?:    () => void;
  variant?:      "default" | "danger";
  loading?:      boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  onConfirm,
  variant      = "default",
  loading      = false,
}: ModalProps) {
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

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
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-sea-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {isMobile ? (
            <motion.div
              key="modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-surface-card rounded-t-xl shadow-float safe-bottom"
              role="dialog"
              aria-modal="true"
            >
              <ModalBody {...{ title, description, children, confirmLabel, cancelLabel, onConfirm, onClose, variant, loading }} />
            </motion.div>
          ) : (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1,    y: 0 }}
                exit={{    opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md bg-surface-card rounded-lg shadow-float"
                role="dialog"
                aria-modal="true"
              >
                <ModalBody {...{ title, description, children, confirmLabel, cancelLabel, onConfirm, onClose, variant, loading }} />
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function ModalBody({
  title, description, children,
  confirmLabel, cancelLabel, onConfirm, onClose, variant, loading,
}: Omit<ModalProps, "isOpen">) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-h3 text-ink-900">{title}</h3>
          {description && <p className="text-sm text-ink-600 mt-1">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-ink-500 hover:text-ink-700 transition-colors p-1 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {children && <div>{children}</div>}

      {onConfirm && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
