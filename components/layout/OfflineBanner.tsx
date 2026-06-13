"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
          aria-live="assertive"
          className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-white"
          style={{ background: "var(--surface-warning)", backdropFilter: "blur(8px)" }}
        >
          <WifiOff size={14} aria-hidden="true" />
          <span>You&apos;re offline — changes will sync when reconnected</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
