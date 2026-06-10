"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id:      string;
  type:    ToastType;
  message: string;
}

interface ToastContextValue {
  toast:   (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error:   (message: string) => void;
  info:    (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = `toast-${++counterRef.current}`;
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), 3000);
  }, [dismiss]);

  const value: ToastContextValue = {
    toast,
    success: (m) => toast(m, "success"),
    error:   (m) => toast(m, "error"),
    info:    (m) => toast(m, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="false"
            className="fixed bottom-24 md:bottom-6 right-4 z-[9999] flex flex-col gap-2 items-end"
          >
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <ToastItem key={item.id} item={item} onDismiss={dismiss} />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// ─── Single toast ─────────────────────────────────────────────────────────────

const toastConfig: Record<ToastType, { icon: React.ReactNode; border: string }> = {
  success: {
    icon:   <CheckCircle size={16} className="text-success" />,
    border: "border-l-success",
  },
  error: {
    icon:   <XCircle size={16} className="text-danger" />,
    border: "border-l-danger",
  },
  info: {
    icon:   <Info size={16} className="text-aqua-500" />,
    border: "border-l-aqua-500",
  },
};

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const cfg = toastConfig[item.type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{    opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex items-center gap-2.5 bg-surface-card shadow-float rounded-md",
        "px-3 py-2.5 border border-hairline border-l-[3px] min-w-[220px] max-w-[340px]",
        cfg.border
      )}
    >
      <span className="shrink-0">{cfg.icon}</span>
      <p className="text-sm text-ink-900 flex-1 leading-snug">{item.message}</p>
      <button
        onClick={() => onDismiss(item.id)}
        className="shrink-0 text-ink-400 hover:text-ink-600 transition-colors rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
