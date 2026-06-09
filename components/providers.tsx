"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { MotionConfig } from "framer-motion";
import { ToastProvider } from "@/components/ui/Toast";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function Providers({ children }: { children: React.ReactNode }) {
  // reducedMotion="user" makes every Framer Motion animation respect the OS
  // "reduce motion" setting automatically.
  const tree = (
    <MotionConfig reducedMotion="user">
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  );
  if (!convex) return tree;
  return <ConvexProvider client={convex}>{tree}</ConvexProvider>;
}
